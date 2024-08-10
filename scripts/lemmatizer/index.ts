/* eslint-disable no-console */
import { fileURLToPath } from "url";
import { readFile } from "../utils/file.js";
import { dirname, join } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));

enum PartsOfSpeech {
  verb = "verb",
  noun = "noun",
  adj = "adj",
  adv = "adv",
}

async function loadJsonDynamically<T>(filename: string): Promise<T> {
  return await readFile<T>(join(__dirname, "dict", `${filename}.json`), true);
}

function endsWith(str: string, suffix: string): boolean {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function hasDoubleConsonant(form: string, suffix: string): boolean {
  // for like bigger -> big
  // length after removing suffix from form
  const len = form.length - suffix.length;
  return (
    isVowel(form[len - 3]) &&
    !isVowel(form[len - 2]) &&
    form[len - 2] === form[len - 1]
  );
}

function isVowel(letter: string): boolean {
  return ["a", "e", "i", "o", "u"].includes(letter);
}

function endsWithEs(form: string): boolean {
  return ["ches", "shes", "oes", "ses", "xes", "zes"].some((end) =>
    endsWith(form, end),
  );
}

function endsWithVerbVowelYs(form: string): boolean {
  return ["ays", "eys", "iys", "oys", "uys"].some((end) => endsWith(form, end));
}

export class Lemmatizer {
  private morphSubs: Record<PartsOfSpeech, Array<[string, string]>>;
  private wordlists: Record<string, Record<string, string>> = {};
  private exceptions: Record<string, Record<string, string>> = {};
  private isInitialized: boolean = false;

  async initialize() {
    this.morphSubs =
      await loadJsonDynamically<Record<PartsOfSpeech, Array<[string, string]>>>(
        "morphSubs",
      );
    for (const pos in PartsOfSpeech) {
      this.wordlists[pos] = {};
      this.exceptions[pos] = {};

      const indx = await loadJsonDynamically<Array<string>>(`${pos}.index`);
      indx.forEach((w) => {
        this.wordlists[pos][w] = w;
      });
      const exc = await loadJsonDynamically<Array<[string, string]>>(
        `${pos}.exc`,
      );
      exc.forEach((item) => {
        const w = item[0];
        const s = item[1];
        this.exceptions[pos][w] = s;
      });
    }
    this.isInitialized = true;
  }

  constructor() {
    this.initialize();
  }

  async awaitUntilInitialized() {
    while (!this.isInitialized) {
      console.log("Waiting for initialization...");
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  private baseForms(pos: PartsOfSpeech, form: string): string[] {
    const iBases = this.irregularBases(pos, form);
    const rBases = this.regularBases(pos, form);

    return iBases.concat(rBases);
  }

  private irregularBases(pos: PartsOfSpeech, form: string): string[] {
    if (this.exceptions[pos][form] && this.exceptions[pos][form] !== form) {
      return [this.exceptions[pos][form]];
    }
    return [];
  }

  private regularBases(pos: PartsOfSpeech, form: string): string[] {
    let bases: string[] = [];
    // bases -> [ [lemma1, lemma2, lemma3...], pos ]
    switch (pos) {
      case PartsOfSpeech.verb:
        bases = this.possibleVerbBases(form);
        break;
      case PartsOfSpeech.noun:
        bases = this.possibleNounBases(form);
        break;
      default:
        bases = this.possibleAdjAdvBases(form, pos);
        break;
    }
    if (bases) {
      return this.checkLemmas(bases, pos);
    }

    return [];
  }

  // check if possible bases are include in lemma wordlists and push
  private checkLemmas(lemmas: string[], pos: PartsOfSpeech): string[] {
    return lemmas.filter(
      (lemma) =>
        this.wordlists[pos][lemma] && this.wordlists[pos][lemma] === lemma,
    );
  }

  private possibleNounBases(form: string): string[] {
    const lemmas = [];

    if (endsWithEs(form)) {
      // watches -> watch
      const noun_base = form.slice(0, -2);
      lemmas.push(noun_base);
      if (
        !this.wordlists["noun"][noun_base] ||
        this.wordlists["noun"][noun_base] !== noun_base
      ) {
        // horses -> horse
        lemmas.push(form.slice(0, -1));
      }
    } else if (endsWith(form, "s")) {
      lemmas.push(form.slice(0, -1));
    }

    this.morphSubs[PartsOfSpeech.noun].forEach((entry) => {
      const morpho = entry[0];
      const origin = entry[1];
      if (endsWith(form, morpho)) {
        lemmas.push(form.slice(0, -morpho.length) + origin);
      }
    });

    // to push a word like 'us' as it is
    lemmas.push(form);

    return lemmas;
  }

  private possibleAdjAdvBases(form: string, pos: PartsOfSpeech): string[] {
    const lemmas = [];

    if (endsWith(form, "est") && hasDoubleConsonant(form, "est")) {
      // biggest -> big
      lemmas.push(form.slice(0, -4));
    } else if (endsWith(form, "er") && hasDoubleConsonant(form, "er")) {
      // bigger -> bigger
      lemmas.push(form.slice(0, -3));
    }

    this.morphSubs[pos].forEach((entry) => {
      const morpho = entry[0];
      const origin = entry[1];
      if (endsWith(form, morpho)) {
        lemmas.push(form.slice(0, -morpho.length) + origin);
      }
    });

    // to push a word like 'after' as it is
    lemmas.push(form);

    return lemmas;
  }

  private possibleVerbBases(form: string): string[] {
    const lemmas = [];

    if (endsWithEs(form)) {
      // goes -> go
      const verb_base = form.slice(0, -2);
      lemmas.push(verb_base);
      if (
        !this.wordlists["verb"][verb_base] ||
        this.wordlists["verb"][verb_base] !== verb_base
      ) {
        // opposes -> oppose
        lemmas.push(form.slice(0, -1));
      }
    } else if (endsWithVerbVowelYs(form)) {
      // annoys -> annoy
      lemmas.push(form.slice(0, -1));
    } else if (
      endsWith(form, "ed") &&
      !endsWith(form, "ied") &&
      !endsWith(form, "cked")
    ) {
      // saved -> save
      const past_base = form.slice(0, -1);
      lemmas.push(past_base);
      if (
        !this.wordlists["verb"][past_base] ||
        this.wordlists["verb"][past_base] !== past_base
      ) {
        // talked -> talk, but not push like coded -> cod
        lemmas.push(form.slice(0, -2));
      }
    } else if (endsWith(form, "ed") && hasDoubleConsonant(form, "ed")) {
      // dragged -> drag
      lemmas.push(form.slice(0, -3));
      // added -> add
      lemmas.push(form.slice(0, -2));
      // pirouetted -> pirouette
      lemmas.push(form.slice(0, -2) + "e");
    } else if (endsWith(form, "ing") && hasDoubleConsonant(form, "ing")) {
      // dragging -> drag
      lemmas.push(form.slice(0, -4));
      // adding -> add
      lemmas.push(form.slice(0, -3));
      // pirouetting -> pirouette
      lemmas.push(form.slice(0, -3) + "e");
    } else if (endsWith(form, "ing") && !this.exceptions["verb"][form]) {
      // coding -> code
      const ing_base = form.slice(0, -3) + "e";
      lemmas.push(ing_base);
      if (
        !this.wordlists["verb"][ing_base] ||
        this.wordlists["verb"][ing_base] !== ing_base
      ) {
        // talking -> talk, but not push like coding -> cod
        lemmas.push(form.slice(0, -3));
      }
    } else if (endsWith(form, "able") && hasDoubleConsonant(form, "able")) {
      lemmas.push(form.slice(0, -5));
    } else if (
      endsWith(form, "ability") &&
      hasDoubleConsonant(form, "ability")
    ) {
      lemmas.push(form.slice(0, -8));
    } else if (endsWith(form, "s")) {
      lemmas.push(form.slice(0, -1));
    }

    this.morphSubs["verb"].forEach(function (entry) {
      const morpho = entry[0];
      const origin = entry[1];
      if (endsWith(form, morpho)) {
        lemmas.push(form.slice(0, -morpho.length) + origin);
      }
    });

    lemmas.push(form);

    return lemmas;
  }

  lemmas(form: string): string[] {
    let lems = [];
    for (const pos in PartsOfSpeech) {
      lems = lems.concat(this.baseForms(pos as PartsOfSpeech, form));
    }

    // when lemma not found and the form is not included in wordlists.
    if (lems.length === 0) {
      lems.push(form);
    }

    return [...new Set(lems)];
  }
}
