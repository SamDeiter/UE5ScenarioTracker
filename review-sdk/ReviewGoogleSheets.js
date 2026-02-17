/**
 * ReviewGoogleSheets Module
 * Extends ReviewStorage with Google Sheets cloud support via Apps Script.
 * Generic — works with any Reviewport tool.
 *
 * Usage:
 *   const sheetsAdapter = new window.ReviewStorage.GoogleSheets({
 *     scriptUrl: 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec',
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
    this.getUser = config.getUser || (() => ({ email: "anonymous", displayName: "Unknown" }));
    this._cache = null; // In-memory cache of loaded reviews
  }

  /**
   * Load all review statuses for this tool + reviewer from the Sheet.
   * Returns an object compatible with ReviewCore state:
   * { currentIndex, itemStatuses: { itemId: { status, note, highlights } } }
   */
  async load(appId) {
    if (!this.scriptUrl) {
      console.warn("[ReviewGoogleSheets] No scriptUrl configured, skipping load");
      return null;
    }

    try {
      const user = this.getUser();
      const url = `${this.scriptUrl}?toolId=${encodeURIComponent(this.toolId)}&email=${encodeURIComponent(user.email)}&callback=__reviewCallback`;

      // Use JSONP to bypass CORS on Google Workspace Apps Script
      const result = await new Promise((resolve, reject) => {
        const callbackName = "__reviewCallback_" + Date.now();
        const timeoutId = setTimeout(() => {
          delete window[callbackName];
          reject(new Error("JSONP timeout"));
        }, 10000);

        window[callbackName] = (data) => {
          clearTimeout(timeoutId);
          delete window[callbackName];
          resolve(data);
        };

        // Use the callback parameter
        const jsonpUrl = url.replace("callback=__reviewCallback", `callback=${callbackName}`);
        const script = document.createElement("script");
        script.src = jsonpUrl;
        script.onerror = () => {
          clearTimeout(timeoutId);
          delete window[callbackName];
          reject(new Error("JSONP script load failed"));
        };
        document.head.appendChild(script);
        script.onload = () => script.remove();
      });

      if (!result || !result.success || !result.reviews) {
        // Fallback: try regular fetch (works if not a Workspace account)
        return await this._fetchLoad(appId);
      }

      // Convert flat rows back into ReviewCore's itemStatuses format
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
      console.warn("[ReviewGoogleSheets] JSONP load failed, trying fetch:", error.message);
      return await this._fetchLoad(appId);
    }
  }

  // Fallback fetch-based load (works for non-Workspace Apps Script)
  async _fetchLoad(appId) {
    try {
      const user = this.getUser();
      const url = `${this.scriptUrl}?toolId=${encodeURIComponent(this.toolId)}&email=${encodeURIComponent(user.email)}`;
      const response = await fetch(url, { redirect: "follow" });
      const result = await response.json();
      if (!result.success || !result.reviews) return null;

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
      return this._cache;
    } catch (error) {
      console.error("[ReviewGoogleSheets] Fetch load also failed:", error);
      return null;
    }
  }

  /**
   * Save a single review item to the Sheet.
   * Called by ReviewCore.saveState() which sends the full state,
   * but we only POST the items that have changed.
   */
  async save(appId, data) {
    if (!this.scriptUrl) {
      console.warn("[ReviewGoogleSheets] No scriptUrl configured, skipping save");
      return false;
    }

    try {
      const user = this.getUser();
      const itemStatuses = data.itemStatuses || {};

      // Find items that have changed since last cache
      const changedItems = this._getChangedItems(itemStatuses);

      if (changedItems.length === 0) {
        return true; // Nothing to save
      }

      // POST each changed item using no-cors to bypass CORS preflight
      // (Google Workspace Apps Script redirects don't support CORS headers)
      const promises = changedItems.map((itemId) => {
        const status = itemStatuses[itemId];
        const payload = JSON.stringify({
          toolId: this.toolId,
          itemId: itemId,
          itemTitle: status.title || itemId,
          status: status.status,
          note: status.note || "",
          highlights: status.highlights || [],
          reviewerEmail: user.email,
          reviewerName: user.displayName,
        });

        // Use navigator.sendBeacon for fire-and-forget reliability,
        // falling back to no-cors fetch
        if (navigator.sendBeacon) {
          const blob = new Blob([payload], { type: "application/json" });
          navigator.sendBeacon(this.scriptUrl, blob);
          return Promise.resolve();
        }

        return fetch(this.scriptUrl, {
          method: "POST",
          mode: "no-cors",
          body: payload,
        });
      });

      await Promise.all(promises);

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
}

// Add to global ReviewStorage namespace
window.ReviewStorage.GoogleSheets = GoogleSheetsAdapter;
