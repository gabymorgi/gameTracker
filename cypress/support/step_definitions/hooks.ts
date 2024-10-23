beforeEach(() => {
  cy.intercept("POST", "**/.netlify/functions/books/create", {
    fixture: "books/item.json",
  });
  cy.intercept("POST", "**/.netlify/functions/books/delete", {
    fixture: "books/item.json",
  });
  cy.intercept("POST", "**/.netlify/functions/books/update", {
    fixture: "books/item.json",
  });
  cy.intercept("POST", "**/.netlify/functions/books/get", {
    fixture: "books/list.json",
  });
  cy.intercept("POST", "**/.netlify/functions/books/statistics", {
    fixture: "books/statistics.json",
  });
  cy.intercept("POST", "**/.netlify/functions/changelogs/bookGet", {
    fixture: "changelogs/bookGet.json",
  });
  cy.intercept("POST", "**/.netlify/functions/changelogs/create", {
    fixture: "changelogs/item.json",
  });
  cy.intercept("POST", "**/.netlify/functions/changelogs/delete", {
    fixture: "changelogs/item.json",
  });
  cy.intercept("POST", "**/.netlify/functions/changelogs/update", {
    fixture: "changelogs/item.json",
  });
  cy.intercept("POST", "**/.netlify/functions/changelogs/get", {
    fixture: "changelogs/list.json",
  });
  cy.intercept("POST", "**/.netlify/functions/changelogs/games", {
    fixture: "games/list.json",
  });
  cy.intercept("POST", "**/.netlify/functions/games/aggregates", {
    fixture: "games/aggregates.json",
  });
  cy.intercept("POST", "**/.netlify/functions/games/create", {
    fixture: "games/item.json",
  });
  cy.intercept("POST", "**/.netlify/functions/games/delete", {
    fixture: "games/item.json",
  });
  cy.intercept("POST", "**/.netlify/functions/games/update", {
    fixture: "games/item.json",
  });
  cy.intercept("POST", "**/.netlify/functions/games/drop", {
    fixture: "games/drop.json",
  });
  cy.intercept("POST", "**/.netlify/functions/games/get", {
    fixture: "games/list.json",
  });
  cy.intercept("POST", "**/.netlify/functions/games/search", {
    fixture: "games/search.json",
  });
  cy.intercept("POST", "**/.netlify/functions/steam/game", {
    fixture: "games/list.json",
  });
  cy.intercept("POST", "**/.netlify/functions/steam/recentlyPlayed", {
    fixture: "steam/recentlyPlayed.json",
  });
  cy.intercept("POST", "**/.netlify/functions/steam/playerAchievements", {
    fixture: "steam/playerAchievements.json",
  });
  cy.intercept("POST", "**/.netlify/functions/tags/delete", {
    fixture: "tags/item.json",
  });
  cy.intercept("POST", "**/.netlify/functions/tags/upsert", {
    fixture: "tags/item.json",
  });
  cy.intercept("POST", "**/.netlify/functions/tags/get*", {
    fixture: "tags/list.json",
  }).as("getTags");
  cy.intercept("POST", "**/.netlify/functions/tags/getGameTags", {
    fixture: "tags/gameTags.json",
  });
  cy.intercept("POST", "**/.netlify/functions/words/delete", {
    fixture: "words/item.json",
  });
  cy.intercept("POST", "**/.netlify/functions/words/find", {
    fixture: "words/item.json",
  });
  cy.intercept("POST", "**/.netlify/functions/words/learn", {
    fixture: "words/item.json",
  });
  cy.intercept("POST", "**/.netlify/functions/words/create", {
    fixture: "words/item.json",
  });
  cy.intercept("POST", "**/.netlify/functions/words/update", {
    fixture: "words/item.json",
  });
  cy.intercept("POST", "**/.netlify/functions/words/get", {
    fixture: "words/list.json",
  });
  cy.intercept("POST", "**/.netlify/functions/words/search", {
    fixture: "words/search.json",
  });
  cy.intercept("POST", "**/.netlify/functions/words/statistics", {
    fixture: "words/statistics.json",
  });
  cy.intercept("POST", "**/.netlify/functions/login", {
    fixture: "login.json",
  });
});
