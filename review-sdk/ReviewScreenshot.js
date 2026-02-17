/**
 * ReviewScreenshot Module
 * Captures the visible page using html2canvas and uploads
 * the screenshot to Google Drive via the Apps Script API.
 *
 * Depends on: html2canvas (loaded from CDN)
 *
 * Usage:
 *   ReviewScreenshot.capture()       → Promise<base64 PNG string>
 *   ReviewScreenshot.upload(config)  → Promise<{ viewUrl, thumbnailUrl }>
 */

(function () {
  "use strict";

  // CDN URL for html2canvas
  var HTML2CANVAS_CDN =
    "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";

  var _loaded = false;

  /**
   * Lazy-load html2canvas from CDN if not already present.
   */
  function ensureHtml2Canvas() {
    return new Promise(function (resolve, reject) {
      if (window.html2canvas) {
        resolve();
        return;
      }
      if (_loaded) {
        // Already loading, wait for it
        var check = setInterval(function () {
          if (window.html2canvas) {
            clearInterval(check);
            resolve();
          }
        }, 100);
        return;
      }
      _loaded = true;
      var script = document.createElement("script");
      script.src = HTML2CANVAS_CDN;
      script.onload = function () {
        console.log("[ReviewScreenshot] html2canvas loaded");
        resolve();
      };
      script.onerror = function () {
        reject(new Error("Failed to load html2canvas from CDN"));
      };
      document.head.appendChild(script);
    });
  }

  /**
   * Capture the visible viewport as a base64 PNG string.
   * Temporarily hides review SDK UI elements during capture.
   */
  async function capture() {
    await ensureHtml2Canvas();

    // Temporarily hide review UI elements so they don't appear in screenshot
    var reviewElements = document.querySelectorAll(
      "review-bar, review-issue-dialog, review-highlight-overlay",
    );
    var originalDisplay = [];
    reviewElements.forEach(function (el) {
      originalDisplay.push(el.style.display);
      el.style.display = "none";
    });

    try {
      var canvas = await window.html2canvas(document.body, {
        useCORS: true,
        allowTaint: true,
        scale: 1, // 1x for reasonable file size
        logging: false,
        windowWidth: document.documentElement.scrollWidth,
        windowHeight: window.innerHeight,
        scrollX: 0,
        scrollY: -window.scrollY, // Capture current scroll position
      });

      return canvas.toDataURL("image/png");
    } finally {
      // Restore review UI
      reviewElements.forEach(function (el, i) {
        el.style.display = originalDisplay[i];
      });
    }
  }

  /**
   * Upload a screenshot to Google Drive via Apps Script.
   *
   * @param {Object} config
   * @param {string} config.scriptUrl  - Apps Script web app URL
   * @param {string} config.base64     - Base64 PNG data (with or without data: prefix)
   * @param {string} config.toolId     - Tool identifier
   * @param {string} config.itemId     - Item identifier
   * @param {string} config.reviewerEmail - Reviewer email
   * @returns {Promise<{viewUrl, thumbnailUrl}>}
   */
  function upload(config) {
    return new Promise(function (resolve, reject) {
      var iframe = document.createElement("iframe");
      iframe.name = "screenshot-upload-frame-" + Date.now();
      iframe.style.display = "none";
      document.body.appendChild(iframe);

      var form = document.createElement("form");
      form.method = "POST";
      form.action = config.scriptUrl;
      form.target = iframe.name;
      form.style.display = "none";

      var fields = {
        action: "screenshot",
        imageData: config.base64,
        toolId: config.toolId || "",
        itemId: config.itemId || "",
        reviewerEmail: config.reviewerEmail || "",
      };

      for (var key in fields) {
        var input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = fields[key];
        form.appendChild(input);
      }

      document.body.appendChild(form);

      // We can't read the iframe response cross-origin,
      // so we resolve after a timeout
      iframe.onload = function () {
        console.log("[ReviewScreenshot] Upload complete");
        resolve({ success: true });
        setTimeout(function () {
          form.remove();
          iframe.remove();
        }, 1000);
      };

      // Timeout fallback
      setTimeout(function () {
        resolve({ success: true });
        if (form.parentNode) form.remove();
        if (iframe.parentNode) iframe.remove();
      }, 15000); // Screenshots may take longer

      console.log("[ReviewScreenshot] Uploading screenshot...");
      form.submit();
    });
  }

  /**
   * One-shot: capture and upload.
   */
  async function captureAndUpload(config) {
    var base64 = await capture();
    config.base64 = base64;
    return upload(config);
  }

  // Expose as global
  window.ReviewScreenshot = {
    capture: capture,
    upload: upload,
    captureAndUpload: captureAndUpload,
  };
})();
