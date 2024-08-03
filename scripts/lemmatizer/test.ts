/* eslint-disable no-console */
import adj from "./dict/index.adj.json" assert { type: "json" };

const wordnetFiles = {
  noun: ["./dict/index.noun.json", "./dict/noun.exc.json"],
  verb: ["./dict/index.verb.json", "./dict/verb.exc.json"],
  adj: ["./dict/index.adj.json", "./dict/adj.exc.json"],
  adv: ["./dict/index.adv.json", "./dict/adv.exc.json"],
};

const morphologicalSubstitutions = {
  noun: [
    ["ies", "y"],
    ["ves", "f"],
    ["men", "man"],
  ],
  verb: [
    ["ies", "y"],
    ["ied", "y"],
    ["cked", "c"],
    ["cked", "ck"],
    ["able", "e"],
    ["able", ""],
    ["ability", "e"],
    ["ability", ""],
  ],
  adj: [
    ["er", ""],
    ["est", ""],
    ["er", "e"],
    ["est", "e"],
    ["ier", "y"],
    ["iest", "y"],
  ],
  adv: [
    ["er", ""],
    ["est", ""],
    ["er", "e"],
    ["est", "e"],
    ["ier", "y"],
    ["iest", "y"],
  ],
};

class Test {
  constructor() {
    console.log("Test class");
  }
}

try {
  // console.log(adj);
  const lemma = new Test();
  console.log(adj);
} catch (error) {
  console.error("Error during lemmatizer initialization:", error);
}
