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
   * Upload a screenshot to Google Drive via REST API.
   *
   * @param {Object} config
   * @param {string} config.folderId  - Google Drive folder ID
   * @param {string} config.base64    - Base64 PNG data (with or without data: prefix)
   * @param {string} config.toolId    - Tool identifier
   * @param {string} config.itemId    - Item identifier
   * @param {string} config.accessToken - Google OAuth access token from Firebase Auth
   * @returns {Promise<{fileId, viewUrl, thumbnailUrl}>}
   */
  async function upload(config) {
    // Remove data URL prefix if present
    var base64Data = config.base64;
    if (base64Data.indexOf(",") > -1) {
      base64Data = base64Data.split(",")[1];
    }

    // Convert base64 to blob
    var byteString = atob(base64Data);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    var blob = new Blob([ab], { type: "image/png" });

    // Build filename
    var timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    var fileName =
      (config.toolId || "unknown") +
      "_" +
      (config.itemId || "unknown") +
      "_" +
      timestamp +
      ".png";

    // Create metadata
    var metadata = {
      name: fileName,
      parents: [config.folderId],
      mimeType: "image/png",
    };

    // Multipart upload to Drive API
    var boundary = "-------314159265358979323846";
    var delimiter = "\r\n--" + boundary + "\r\n";
    var close_delim = "\r\n--" + boundary + "--";

    var multipartRequestBody =
      delimiter +
      "Content-Type: application/json\r\n\r\n" +
      JSON.stringify(metadata) +
      delimiter +
      "Content-Type: image/png\r\n" +
      "Content-Transfer-Encoding: base64\r\n\r\n" +
      base64Data +
      close_delim;

    console.log("[ReviewScreenshot] Uploading to Drive...");

    var response = await fetch(
      "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + config.accessToken,
          "Content-Type": 'multipart/related; boundary="' + boundary + '"',
        },
        body: multipartRequestBody,
      }
    );

    if (!response.ok) {
      throw new Error("Drive upload failed: " + response.statusText);
    }

    var file = await response.json();
    var fileId = file.id;

    // Make file publicly viewable
    await fetch(
      "https://www.googleapis.com/drive/v3/files/" +
        fileId +
        "/permissions",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + config.accessToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: "reader",
          type: "anyone",
        }),
      }
    );

    console.log("[ReviewScreenshot] Upload complete:", fileId);

    return {
      fileId: fileId,
      viewUrl: "https://drive.google.com/file/d/" + fileId + "/view",
      thumbnailUrl:
        "https://drive.google.com/thumbnail?id=" + fileId + "&sz=w400",
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
