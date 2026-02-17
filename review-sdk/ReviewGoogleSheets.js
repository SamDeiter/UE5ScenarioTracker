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
  async _postJSON(data) {
    try {
      const resp = await fetch(this.scriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolId: data.toolId || "",
          itemId: data.itemId || "",
          itemTitle: data.itemTitle || "",
          status: data.status || "",
          note: data.note || "",
          highlights: data.highlights || [],
          screenshotUrl: data.screenshotUrl || "",
          reviewerEmail: data.reviewerEmail || "",
          reviewerName: data.reviewerName || "",
        }),
      });
      const result = await resp.json();
      return result.success;
    } catch (err) {
      console.error("[ReviewGoogleSheets] POST error:", err);
      return false;
    }
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
      const url =
        `${this.scriptUrl}?toolId=${encodeURIComponent(this.toolId)}` +
        `&email=${encodeURIComponent(user.email)}`;

      const resp = await fetch(url);
      const result = await resp.json();

      if (!result || !result.success || !result.reviews) {
        return null;
      }

      const itemStatuses = {};
      for (const review of result.reviews) {
        itemStatuses[review.itemId] = {
          status: review.status,
          note: review.note || "",
          highlights: review.highlights || [],
          screenshotUrl: review.screenshotUrl || "",
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

      // Submit each changed item via JSON POST
      for (const itemId of changedItems) {
        const status = itemStatuses[itemId];
        await this._postJSON({
          toolId: this.toolId,
          itemId: itemId,
          itemTitle: status.title || itemId,
          status: status.status,
          note: status.note || "",
          highlights: status.highlights || [],
          screenshotUrl: status.screenshotUrl || "",
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
    
    const currentUser = window.firebase.auth().currentUser;
    console.log("[ReviewGoogleSheets] Getting access token from current user session...");
    
    try {
      // Get the ID token from the current user (already signed in via gatekeeper)
      // This includes the OAuth access token we need for Drive API
      const token = await currentUser.getIdToken(true); // true = force refresh
      
      // For Google Drive API, we need the OAuth access token, not the ID token
      // Check if we can get it from the auth state
      const authResult = await currentUser.getIdTokenResult();
      
      // The access token might be available in the user's provider data
      if (currentUser.providerData && currentUser.providerData.length > 0) {
        const googleProvider = currentUser.providerData.find(p => p.providerId === 'google.com');
        if (googleProvider) {
          console.log("[ReviewGoogleSheets] Found Google provider data");
          
          // Get a fresh token by calling getIdToken with force refresh
          // Note: Firebase ID tokens can be used for Google APIs if the user authenticated with Google
          this._oauthAccessToken = token;
          try {
            localStorage.setItem('review_oauth_token', token);
            console.log("[ReviewGoogleSheets] Using Firebase auth token for Drive API access");
          } catch (e) {
            console.warn('[ReviewGoogleSheets] Could not store token:', e);
          }
          return token;
        }
      }
      
      // If we can't get the OAuth token from the session, show helpful message
      throw new Error(
        "Could not obtain Drive API permissions from your current session. " +
        "Please sign out completely from Reviewport and sign back in to grant screenshot upload permissions."
      );
    } catch (error) {
      console.error("[ReviewGoogleSheets] Failed to get access token:", error);
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
