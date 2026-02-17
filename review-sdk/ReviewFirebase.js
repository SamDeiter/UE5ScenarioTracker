/**
 * ReviewFirebase Module
 * Extends ReviewStorage with Firestore cloud support.
 * Requires Firebase SDK to be loaded.
 */

class FirestoreAdapter extends window.ReviewStorage.Base {
  constructor(config) {
    super();
    this.config = config;
    this.db = null;
    this.auth = null;
    this.userId = null;
    this._oauthAccessToken = null;
    
    // Try to load OAuth token from localStorage
    try {
      const stored = localStorage.getItem('review_oauth_token');
      if (stored) {
        this._oauthAccessToken = stored;
        console.log('[ReviewFirebase] Loaded OAuth token from localStorage');
      }
    } catch (e) {
      console.warn('[ReviewFirebase] Could not load OAuth token from localStorage');
    }
  }

  async init() {
    if (!window.firebase) {
      throw new Error(
        "[ReviewFirebase] Firebase SDK not found. Please include firebase-app.js and firebase-firestore.js",
      );
    }

    // Initialize Firebase if not already
    if (!window.firebase.apps.length) {
      window.firebase.initializeApp(this.config);
    }

    this.db = window.firebase.firestore();
    this.auth = window.firebase.auth();

    // Wait for auth to resolve
    return new Promise((resolve) => {
      this.auth.onAuthStateChanged((user) => {
        this.userId = user ? user.uid : "anonymous";
        console.log(`[ReviewFirebase] Authenticated as: ${this.userId}`);
        resolve();
      });
    });
  }

  async load(appId) {
    if (!this.db) await this.init();

    try {
      const doc = await this.db
        .collection("reviews")
        .doc(`${this.userId}_${appId}`)
        .get();
      if (doc.exists) {
        return doc.data();
      }
      return null;
    } catch (e) {
      console.error("[ReviewFirebase] Firestore load error:", e);
      return null;
    }
  }

  async save(appId, data) {
    if (!this.db) await this.init();

    try {
      await this.db
        .collection("reviews")
        .doc(`${this.userId}_${appId}`)
        .set(
          {
            ...data,
            appId,
            userId: this.userId,
            updatedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true },
        );
      return true;
    } catch (e) {
      console.error("[ReviewFirebase] Firestore save error:", e);
      return false;
    }
  }

  // Auth Helpers
  async login() {
    const provider = new window.firebase.auth.GoogleAuthProvider();
    // Request Drive API scope for screenshot uploads
    provider.addScope("https://www.googleapis.com/auth/drive.file");

    const result = await this.auth.signInWithPopup(provider);

    // Extract and store the OAuth access token
    const credential = window.firebase.auth.GoogleAuthProvider.credentialFromResult(result);
    if (credential && credential.accessToken) {
      this._oauthAccessToken = credential.accessToken;
      // Persist to localStorage
      try {
        localStorage.setItem('review_oauth_token', credential.accessToken);
        console.log("[ReviewFirebase] OAuth access token captured and stored");
      } catch (e) {
        console.warn('[ReviewFirebase] Could not store OAuth token:', e);
      }
    }

    return result;
  }

  async logout() {
    this._oauthAccessToken = null;
    // Clear from localStorage
    try {
      localStorage.removeItem('review_oauth_token');
    } catch (e) {
      // Ignore
    }
    return this.auth.signOut();
  }

  // Request Drive API access for already-signed-in users
  async requestDriveAccess() {
    if (!this.auth.currentUser) {
      throw new Error("User must be signed in first");
    }
    
    console.log("[ReviewFirebase] Requesting Drive API access...");
    const provider = new window.firebase.auth.GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/drive.file");
    
    try {
      // Re-authenticate to get Drive scope
      const result = await this.auth.currentUser.reauthenticateWithPopup(provider);
      const credential = window.firebase.auth.GoogleAuthProvider.credentialFromResult(result);
      
      if (credential && credential.accessToken) {
        this._oauthAccessToken = credential.accessToken;
        try {
          localStorage.setItem('review_oauth_token', credential.accessToken);
          console.log("[ReviewFirebase] Drive API access granted and token stored");
        } catch (e) {
          console.warn('[ReviewFirebase] Could not store OAuth token:', e);
        }
        return credential.accessToken;
      }
    } catch (error) {
      console.error("[ReviewFirebase] Failed to get Drive access:", error);
      throw error;
    }
  }

  // Get OAuth access token for Google APIs (e.g., Drive)
  getOAuthAccessToken() {
    return this._oauthAccessToken;
  }
}

// Add to global ReviewStorage
window.ReviewStorage.Firebase = FirestoreAdapter;
