/**
 * groceries.js — Grocery list with Firebase Realtime Database for shared voting + suggestions
 *
 * Firebase config should be set before this script loads.
 * Uses Alpine.js for reactive UI binding.
 */

const GROCERY_SCRIPT_VERSION = '20260318-3';
window.__GROCERY_SCRIPT_VERSION = GROCERY_SCRIPT_VERSION;
console.info('[groceries] script loaded', GROCERY_SCRIPT_VERSION);

// Firebase will be initialized in the HTML page with the config
// This file provides the Alpine.js data store and Firebase sync logic

function groceryStore() {
  let db = null;

  return {
    suggestions: [],
    votes: {},
    suggestionItem: '',
    suggestionName: '',
    firebaseError: '',
    connectionState: 'idle',

    init() {
      if (typeof firebase === 'undefined' || typeof firebase.database !== 'function') {
        this.setFirebaseError('Firebase SDK failed to load on this page.');
        return;
      }

      if (!Array.isArray(firebase.apps) || firebase.apps.length === 0) {
        this.setFirebaseError('Firebase did not initialize. Check the config block in groceries.html.');
        return;
      }

      try {
        db = firebase.database();
        this.connectionState = 'connecting';
        console.info('[groceries] firebase initialized', firebase.SDK_VERSION || 'unknown');
        this.watchConnection();
        this.loadSuggestions();
        this.loadVotes();
      } catch (error) {
        this.setFirebaseError('Firebase failed to start.', error);
      }
    },

    // --- Suggestions ---
    async submitSuggestion() {
      if (!this.suggestionItem.trim()) return;
      if (!db) return;

      const suggestion = {
        item: this.suggestionItem.trim().slice(0, 100),
        name: this.suggestionName.trim().slice(0, 50) || 'Anonymous',
        timestamp: Date.now(),
        votes: 0,
      };

      try {
        await db.ref('suggestions').push(suggestion);
        this.firebaseError = '';
        this.suggestionItem = '';
        // Keep name filled for convenience
      } catch (error) {
        this.setFirebaseError('Could not submit the suggestion to Firebase.', error);
      }
    },

    loadSuggestions() {
      if (!db) return;
      db.ref('suggestions').on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
          this.suggestions = Object.entries(data)
            .filter(([, val]) => val && typeof val === 'object')
            .map(([key, val]) => ({ id: key, ...val }))
            .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        } else {
          this.suggestions = [];
        }
      }, (error) => {
        this.setFirebaseError('Could not read suggestions from Firebase.', error);
      });
    },

    // --- Voting ---
    async vote(itemId, direction) {
      if (!db) return;
      const delta = direction === 'up' ? 1 : -1;

      try {
        await db.ref(`votes/${itemId}`).transaction((current) => (current || 0) + delta);
        this.firebaseError = '';
      } catch (error) {
        this.setFirebaseError(`Could not update the vote for "${itemId}".`, error);
      }
    },

    async voteSuggestion(suggestionId, direction) {
      if (!db) return;
      const delta = direction === 'up' ? 1 : -1;

      try {
        await db.ref(`suggestions/${suggestionId}/votes`).transaction((current) => (current || 0) + delta);
        this.firebaseError = '';
      } catch (error) {
        this.setFirebaseError('Could not update that suggestion vote.', error);
      }
    },

    loadVotes() {
      if (!db) return;
      db.ref('votes').on('value', (snapshot) => {
        this.votes = snapshot.val() || {};
      }, (error) => {
        this.setFirebaseError('Could not read grocery votes from Firebase.', error);
      });
    },

    getVoteCount(itemId) {
      return this.votes[itemId] || 0;
    },

    watchConnection() {
      if (!db) return;

      db.ref('.info/connected').on('value', (snapshot) => {
        this.connectionState = snapshot.val() ? 'connected' : 'disconnected';
      }, (error) => {
        this.setFirebaseError('Could not monitor the Firebase connection.', error);
      });
    },

    statusMessage() {
      if (this.firebaseError) {
        return this.firebaseError;
      }

      if (!db || this.connectionState === 'idle') {
        return '';
      }

      if (this.connectionState === 'connecting') {
        return 'Connecting to live grocery votes...';
      }

      if (this.connectionState === 'disconnected') {
        return 'Live grocery voting is offline right now. You can still browse the list.';
      }

      return '';
    },

    setFirebaseError(message, error) {
      console.error(message, error);
      this.firebaseError = error?.message ? `${message} ${error.message}` : message;
      this.connectionState = 'error';
    },
  };
}
