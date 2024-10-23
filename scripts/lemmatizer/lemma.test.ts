import { describe, it, expect } from "vitest";
import { Lemmatizer } from ".";

describe("lemmatizer", async () => {
  it("should return the correct lemma", async () => {
    const lemmatizer = new Lemmatizer();
    await lemmatizer.awaitUntilInitialized();
    let result = lemmatizer.lemmas("running");
    expect(result[0]).toEqual("run");

    result = lemmatizer.lemmas("born");
    expect(result[0]).toEqual("bear");
  });
});
