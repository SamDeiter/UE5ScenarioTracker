/**
 * ReviewScreenshot Module
 * Captures the visible page using html2canvas and uploads
 * the screenshot to Google Drive via a Firebase Cloud Function.
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

  // Cloud Function URL for screenshot uploads
  var UPLOAD_FUNCTION_URL =
    "https://uploadscreenshot-l42ahadwua-uc.a.run.app";

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
   * Upload a screenshot to Google Drive via Cloud Function.
   *
   * @param {Object} config
   * @param {string} config.base64    - Base64 PNG data (with or without data: prefix)
   * @param {string} config.toolId    - Tool identifier
   * @param {string} config.itemId    - Item identifier
   * @param {string} config.reviewerEmail - Reviewer email
   * @returns {Promise<{fileId, viewUrl, thumbnailUrl}>}
   */
  async function upload(config) {
    console.log("[ReviewScreenshot] Uploading via Cloud Function...");

    var response = await fetch(UPLOAD_FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageData: config.base64,
        toolId: config.toolId || "",
        itemId: config.itemId || "",
        reviewerEmail: config.reviewerEmail || "",
      }),
    });

    if (!response.ok) {
      var errorText = await response.text();
      throw new Error("Screenshot upload failed: " + errorText);
    }

    var data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Screenshot upload failed");
    }

    console.log("[ReviewScreenshot] Upload complete:", data.fileId);

    return {
      fileId: data.fileId,
      viewUrl: data.viewUrl,
      thumbnailUrl: data.thumbnailUrl,
    };
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
