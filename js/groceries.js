/**
 * groceries.js — Grocery list with Firebase Realtime Database for shared voting + suggestions
 *
 * Firebase config should be set before this script loads.
 * Uses Alpine.js for reactive UI binding.
 */

// Firebase will be initialized in the HTML page with the config
// This file provides the Alpine.js data store and Firebase sync logic

function groceryStore() {
  return {
    suggestions: [],
    votes: {},
    suggestionItem: '',
    suggestionName: '',
    db: null,

    init() {
      // Firebase db reference will be set after Firebase initializes
      if (typeof firebase !== 'undefined' && firebase.database) {
        this.db = firebase.database();
        this.loadSuggestions();
        this.loadVotes();
      }
    },

    // --- Suggestions ---
    async submitSuggestion() {
      if (!this.suggestionItem.trim()) return;
      if (!this.db) return;

      const suggestion = {
        item: this.suggestionItem.trim().slice(0, 100),
        name: this.suggestionName.trim().slice(0, 50) || 'Anonymous',
        timestamp: Date.now(),
        votes: 0,
      };

      await this.db.ref('suggestions').push(suggestion);
      this.suggestionItem = '';
      // Keep name filled for convenience
    },

    loadSuggestions() {
      if (!this.db) return;
      this.db.ref('suggestions').orderByChild('timestamp').on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
          this.suggestions = Object.entries(data).map(([key, val]) => ({
            id: key,
            ...val,
          })).reverse();
        } else {
          this.suggestions = [];
        }
      });
    },

    // --- Voting ---
    async vote(itemId, direction) {
      if (!this.db) return;
      const ref = this.db.ref(`votes/${itemId}`);
      const snapshot = await ref.once('value');
      const current = snapshot.val() || 0;
      await ref.set(current + (direction === 'up' ? 1 : -1));
    },

    async voteSuggestion(suggestionId, direction) {
      if (!this.db) return;
      const ref = this.db.ref(`suggestions/${suggestionId}/votes`);
      const snapshot = await ref.once('value');
      const current = snapshot.val() || 0;
      await ref.set(current + (direction === 'up' ? 1 : -1));
    },

    loadVotes() {
      if (!this.db) return;
      this.db.ref('votes').on('value', (snapshot) => {
        this.votes = snapshot.val() || {};
      });
    },

    getVoteCount(itemId) {
      return this.votes[itemId] || 0;
    },
  };
}
