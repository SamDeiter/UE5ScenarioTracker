/**
 * ReviewGoogleSheets Module v2
 * Extends ReviewStorage with Google Sheets cloud support via Apps Script.
 * Generic — works with any Reviewport tool.
 *
 * Handles Google Workspace CORS restrictions by using:
 * - Hidden form + iframe for POST (writes) — survives 302 redirects
 * - JSONP for GET (reads) — bypasses CORS entirely
 *
 * Usage:
 *   const sheetsAdapter = new window.ReviewStorage.GoogleSheets({
 *     scriptUrl: 'https://script.google.com/.../exec',
 *     toolId: 'scenario-tracker',
 *     getUser: () => ({
 *       email: firebase.auth().currentUser?.email || 'anonymous',
 *       displayName: firebase.auth().currentUser?.displayName || 'Unknown'
 *     })
 *   });
 */

class GoogleSheetsAdapter extends window.ReviewStorage.Base {
  constructor(config = {}) {
    super();
    this.scriptUrl = config.scriptUrl;
    this.toolId = config.toolId || "unknown-tool";
    this.getUser =
      config.getUser ||
      (() => ({ email: "anonymous", displayName: "Unknown" }));
    this._cache = null;
    this._iframe = null;
    this._oauthAccessToken = null;
    
    // Try to load OAuth token from localStorage
    try {
      const stored = localStorage.getItem('review_oauth_token');
      if (stored) {
        this._oauthAccessToken = stored;
        console.log('[ReviewGoogleSheets] Loaded OAuth token from localStorage');
      }
    } catch (e) {
      console.warn('[ReviewGoogleSheets] Could not load OAuth token from localStorage');
    }
  }

  /**
   * Create or reuse a hidden iframe for form submissions.
   */
  _getIframe() {
    if (!this._iframe) {
      this._iframe = document.createElement("iframe");
      this._iframe.name = "review-storage-frame";
      this._iframe.style.display = "none";
      document.body.appendChild(this._iframe);
    }
    return this._iframe;
  }

  /**
   * POST data via hidden form + iframe.
   * This survives the 302 redirect that Apps Script does,
   * which breaks fetch and sendBeacon (they convert POST→GET on redirect).
   */
  _postViaForm(data) {
    return new Promise((resolve) => {
      const iframe = this._getIframe();
      const form = document.createElement("form");
      form.method = "POST";
      form.action = this.scriptUrl;
      form.target = "review-storage-frame";
      form.style.display = "none";

      // Apps Script doPost receives e.parameter for form fields
      // and e.postData.contents for the raw body.
      // We send each field as a hidden input for reliable delivery.
      const fields = {
        toolId: data.toolId || "",
        itemId: data.itemId || "",
        itemTitle: data.itemTitle || "",
        status: data.status || "",
        note: data.note || "",
        highlights: JSON.stringify(data.highlights || []),
        reviewerEmail: data.reviewerEmail || "",
        reviewerName: data.reviewerName || "",
      };

      for (const [key, value] of Object.entries(fields)) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      }

      document.body.appendChild(form);

      // Resolve after a short delay (we can't read the iframe response cross-origin)
      iframe.onload = () => {
        resolve(true);
        form.remove();
      };

      // Timeout fallback in case onload doesn't fire
      setTimeout(() => {
        resolve(true);
        if (form.parentNode) form.remove();
      }, 5000);

      form.submit();
    });
  }

  /**
   * Load reviews using JSONP (bypasses CORS on Workspace Apps Script).
   */
  async load(appId) {
    if (!this.scriptUrl) {
      console.warn(
        "[ReviewGoogleSheets] No scriptUrl configured, skipping load"
      );
      return null;
    }

    try {
      const user = this.getUser();
      const callbackName = "__reviewCb_" + Date.now();

      const result = await new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          delete window[callbackName];
          reject(new Error("JSONP timeout"));
        }, 10000);

        window[callbackName] = (data) => {
          clearTimeout(timeoutId);
          delete window[callbackName];
          resolve(data);
        };

        const url =
          `${this.scriptUrl}?toolId=${encodeURIComponent(this.toolId)}` +
          `&email=${encodeURIComponent(user.email)}` +
          `&callback=${callbackName}`;

        const script = document.createElement("script");
        script.src = url;
        script.onerror = () => {
          clearTimeout(timeoutId);
          delete window[callbackName];
          reject(new Error("JSONP script load failed"));
        };
        document.head.appendChild(script);
        script.onload = () => script.remove();
      });

      if (!result || !result.success || !result.reviews) {
        return null;
      }

      const itemStatuses = {};
      for (const review of result.reviews) {
        itemStatuses[review.itemId] = {
          status: review.status,
          note: review.note || "",
          highlights: review.highlights || [],
          updatedAt: review.timestamp,
        };
      }

      this._cache = { currentIndex: 0, itemStatuses };
      console.log(
        `[ReviewGoogleSheets] Loaded ${result.reviews.length} reviews for ${this.toolId}`
      );
      return this._cache;
    } catch (error) {
      console.warn("[ReviewGoogleSheets] Load failed:", error.message);
      return null;
    }
  }

  /**
   * Save changed review items to the Sheet via hidden form POST.
   */
  async save(appId, data) {
    if (!this.scriptUrl) {
      console.warn(
        "[ReviewGoogleSheets] No scriptUrl configured, skipping save"
      );
      return false;
    }

    try {
      const user = this.getUser();
      const itemStatuses = data.itemStatuses || {};
      const changedItems = this._getChangedItems(itemStatuses);

      if (changedItems.length === 0) {
        return true;
      }

      // Submit each changed item via hidden form
      for (const itemId of changedItems) {
        const status = itemStatuses[itemId];
        await this._postViaForm({
          toolId: this.toolId,
          itemId: itemId,
          itemTitle: status.title || itemId,
          status: status.status,
          note: status.note || "",
          highlights: status.highlights || [],
          reviewerEmail: user.email,
          reviewerName: user.displayName,
        });
      }

      // Update cache
      this._cache = { ...data };

      console.log(
        `[ReviewGoogleSheets] Saved ${changedItems.length} review(s) to Sheet`
      );
      return true;
    } catch (error) {
      console.error("[ReviewGoogleSheets] Save error:", error);
      return false;
    }
  }

  /**
   * Compare current statuses against cache to find what changed
   */
  _getChangedItems(currentStatuses) {
    const cachedStatuses =
      this._cache && this._cache.itemStatuses ? this._cache.itemStatuses : {};
    const changed = [];

    for (const itemId of Object.keys(currentStatuses)) {
      const current = currentStatuses[itemId];
      const cached = cachedStatuses[itemId];

      if (
        !cached ||
        cached.status !== current.status ||
        cached.note !== current.note
      ) {
        changed.push(itemId);
      }
    }

    return changed;
  }

  // Request Drive API access for already-signed-in users
  async requestDriveAccess() {
    if (!window.firebase || !window.firebase.auth || !window.firebase.auth().currentUser) {
      throw new Error("User must be signed in first");
    }
    
    console.log("[ReviewGoogleSheets] Requesting Drive API access...");
    const provider = new window.firebase.auth.GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/drive.file");
    
    try {
      // Use signInWithPopup instead of reauthenticateWithPopup to bypass COOP restrictions
      // The user is already signed in, but this will request additional scopes
      const result = await window.firebase.auth().signInWithPopup(provider);
      const credential = window.firebase.auth.GoogleAuthProvider.credentialFromResult(result);
      
      if (credential && credential.accessToken) {
        this._oauthAccessToken = credential.accessToken;
        try {
          localStorage.setItem('review_oauth_token', credential.accessToken);
          console.log("[ReviewGoogleSheets] Drive API access granted and token stored");
        } catch (e) {
          console.warn('[ReviewGoogleSheets] Could not store OAuth token:', e);
        }
        return credential.accessToken;
      }
      
      throw new Error("No access token received from Google");
    } catch (error) {
      console.error("[ReviewGoogleSheets] Failed to get Drive access:", error);
      
      // Check if popup was blocked
      if (error.code === 'auth/popup-blocked') {
        throw new Error("Popup was blocked by your browser. Please allow popups for this site and try again.");
      }
      
      // Check for COOP/CORS errors
      if (error.message && error.message.includes('cross-origin')) {
        throw new Error("Browser security settings blocked the authentication popup. Please sign out and sign back in to grant screenshot permissions.");
      }
      
      throw error;
    }
  }

  // Get OAuth access token for Google APIs (e.g., Drive)
  getOAuthAccessToken() {
    return this._oauthAccessToken;
  }
}

// Add to global ReviewStorage namespace
window.ReviewStorage.GoogleSheets = GoogleSheetsAdapter;
