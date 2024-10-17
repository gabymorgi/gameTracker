beforeEach(() => {
  cy.intercept("POST", "**/books/create", { fixture: "books/item.json" });
  cy.intercept("POST", "**/books/delete", { fixture: "books/item.json" });
  cy.intercept("POST", "**/books/update", { fixture: "books/item.json" });
  cy.intercept("POST", "**/books/get", { fixture: "books/list.json" });
  cy.intercept("POST", "**/books/statistics", {
    fixture: "books/statistics.json",
  });
  cy.intercept("POST", "**/changelogs/bookGet", {
    fixture: "changelogs/bookGet.json",
  });
  cy.intercept("POST", "**/changelogs/create", {
    fixture: "changelogs/item.json",
  });
  cy.intercept("POST", "**/changelogs/delete", {
    fixture: "changelogs/item.json",
  });
  cy.intercept("POST", "**/changelogs/update", {
    fixture: "changelogs/item.json",
  });
  cy.intercept("POST", "**/changelogs/get", {
    fixture: "changelogs/list.json",
  });
  cy.intercept("POST", "**/changelogs/games", { fixture: "games/list.json" });
  cy.intercept("POST", "**/games/aggregates", {
    fixture: "games/aggregates.json",
  });
  cy.intercept("POST", "**/games/create", { fixture: "games/item.json" });
  cy.intercept("POST", "**/games/delete", { fixture: "games/item.json" });
  cy.intercept("POST", "**/games/update", { fixture: "games/item.json" });
  cy.intercept("POST", "**/games/drop", { fixture: "games/drop.json" });
  cy.intercept("POST", "**/games/get", { fixture: "games/list.json" });
  cy.intercept("POST", "**/games/search", { fixture: "games/search.json" });
  cy.intercept("POST", "**/steam/game", { fixture: "games/list.json" });
  cy.intercept("POST", "**/steam/recentlyPlayed", {
    fixture: "steam/recentlyPlayed.json",
  });
  cy.intercept("POST", "**/steam/playerAchievements", {
    fixture: "steam/playerAchievements.json",
  });
  cy.intercept("POST", "**/tags/delete", { fixture: "tags/item.json" });
  cy.intercept("POST", "**/tags/upsert", { fixture: "tags/item.json" });
  cy.intercept("POST", "**/tags/get", { fixture: "tags/list.json" });
  cy.intercept("POST", "**/tags/getGameTags", {
    fixture: "tags/gameTags.json",
  });
  cy.intercept("POST", "**/words/delete", { fixture: "words/item.json" });
  cy.intercept("POST", "**/words/find", { fixture: "words/item.json" });
  cy.intercept("POST", "**/words/learn", { fixture: "words/item.json" });
  cy.intercept("POST", "**/words/create", { fixture: "words/item.json" });
  cy.intercept("POST", "**/words/update", { fixture: "words/item.json" });
  cy.intercept("POST", "**/words/get", { fixture: "words/list.json" });
  cy.intercept("POST", "**/words/search", { fixture: "words/search.json" });
  cy.intercept("POST", "**/words/statistics", {
    fixture: "words/statistics.json",
  });
  cy.intercept("POST", "**/login", { fixture: "login.json" });
});
