/*
 * JavaScript Lemmatizer v0.0.2
 * https://github.com/takafumir/javascript-lemmatizer
 * MIT License
 * by Takafumi Yamano
 */

function endsWith(str: string, suffix: string): boolean {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

async function loadWordnetFiles(pos: string, list: string, exc: string) {
  const key_idx = pos + this.idx;
  this.open_file(key_idx, list);
  const action = await import(list);
  const key_exc = pos + this.exc;
  this.open_file(key_exc, exc);
}

// Lemmatizer properties
Lemmatizer.prototype = {
  form: "",
  idx: "_idx",
  exc: "_exc",
  lems: [], // -> [ ["lemma1", "verb"], ["lemma2", "noun"]... ]

  // **************************************************
  // public
  // **************************************************
  // reuturn Array of ["lemma", "pos"] pairs
  // like [ ["lemma1", "verb"], ["lemma2", "noun"]... ]
  lemmas: function (form, pos) {
    const self = this;
    this.lems = [];
    this.form = form;

    const parts = ["verb", "noun", "adj", "adv"];
    if (pos && !_.include(parts, pos)) {
      console.log("warning: pos must be 'verb' or 'noun' or 'adj' or 'adv'.");
      return;
    }

    if (!pos) {
      _.each(parts, function (pos) {
        self.irregular_bases(pos);
      });
      _.each(parts, function (pos) {
        self.regular_bases(pos);
      });

      // when lemma not found and the form is included in wordlists.
      if (this.is_lemma_empty()) {
        _.chain(parts)
          .select(function (pos) {
            return self.wordlists[pos][form];
          })
          .each(function (pos) {
            self.lems.push([form, pos]);
          });
      }
      // when lemma not found and the form is not included in wordlists.
      if (this.is_lemma_empty()) {
        this.lems.push([form, ""]);
      }
    } else {
      this.base_forms(pos);
      if (this.is_lemma_empty()) {
        this.lems.push([form, pos]);
      }
    }

    // sort to verb -> noun -> adv -> adj
    return _.sortBy(this.uniq_lemmas(this.lems), function (val) {
      return val[1];
    }).reverse();
  },

  // return only uniq lemmas without pos like [ 'high' ] or [ 'leave', 'leaf' ]
  only_lemmas: function (form, pos) {
    const result = _.map(this.lemmas(form, pos), function (val) {
      return val[0];
    });
    return _.uniq(result);
  },

  // **************************************************
  // private
  // The following properties(methods) are only used by
  // Lemmatizer inside, so don't call them from outside.
  // **************************************************
  is_lemma_empty: function () {
    return this.lems.length === 0;
  },

  setup_dic_data: function (pos) {
    const self = this;
    const key_idx = pos + this.idx;
    _.each(this.fetch_data(key_idx), function (w) {
      self.wordlists[pos][w] = w;
    });
    const key_exc = pos + this.exc;
    _.each(this.fetch_data(key_exc), function (item) {
      const w = item[0];
      const s = item[1];
      self.exceptions[pos][w] = s;
    });
  },

  

  store_data: function (key, data) {
    localStorage.setItem(key, data);
  },

  fetch_data: function (key) {
    const data = JSON.parse(localStorage.getItem(key));
    return data;
  },
  // end of set up dictionary data

  base_forms: function (pos) {
    this.irregular_bases(pos);
    this.regular_bases(pos);
  },

  // build array lemmas(this.lems) like [ [lemma1, "verb"], [lemma2, "noun"]... ]
  irregular_bases: function (pos) {
    if (
      this.exceptions[pos][this.form] &&
      this.exceptions[pos][this.form] !== this.form
    ) {
      this.lems.push([this.exceptions[pos][this.form], pos]);
    }
  },

  // build array lemmas(this.lems) like [ [lemma1, "verb"], [lemma2, "noun"]... ]
  regular_bases: function (pos) {
    let bases = null;
    // bases -> [ [lemma1, lemma2, lemma3...], pos ]
    switch (pos) {
      case "verb":
        bases = this.possible_verb_bases();
        break;
      case "noun":
        bases = this.possible_noun_bases();
        break;
      case "adj":
        bases = this.possible_adj_adv_bases("adj");
        break;
      case "adv":
        bases = this.possible_adj_adv_bases("adv");
        break;
      default:
        break;
    }
    if (bases) {
      this.check_lemmas(bases);
    }
  },

  // check if possible bases are include in lemma wordlists and push
  check_lemmas: function (bases) {
    const self = this;
    // bases -> [ [lemma1, lemma2, lemma3...], pos ]
    const lemmas = bases[0];
    const pos = bases[1];
    _.each(lemmas, function (lemma) {
      if (self.wordlists[pos][lemma] && self.wordlists[pos][lemma] === lemma) {
        self.lems.push([lemma, pos]);
      }
    });
  },

  possible_verb_bases: function () {
    const form = this.form;
    const lemmas = [];

    if (this.ends_with_es()) {
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
    } else if (this.ends_with_verb_vowel_ys()) {
      // annoys -> annoy
      lemmas.push(form.slice(0, -1));
    } else if (
      form.endsWith("ed") &&
      !form.endsWith("ied") &&
      !form.endsWith("cked")
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
    } else if (form.endsWith("ed") && this.double_consonant("ed")) {
      // dragged -> drag
      lemmas.push(form.slice(0, -3));
      // added -> add
      lemmas.push(form.slice(0, -2));
      // pirouetted -> pirouette
      lemmas.push(form.slice(0, -2) + "e");
    } else if (form.endsWith("ing") && this.double_consonant("ing")) {
      // dragging -> drag
      lemmas.push(form.slice(0, -4));
      // adding -> add
      lemmas.push(form.slice(0, -3));
      // pirouetting -> pirouette
      lemmas.push(form.slice(0, -3) + "e");
    } else if (form.endsWith("ing") && !this.exceptions["verb"][form]) {
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
    } else if (form.endsWith("able") && this.double_consonant("able")) {
      lemmas.push(form.slice(0, -5));
    } else if (form.endsWith("ability") && this.double_consonant("ability")) {
      lemmas.push(form.slice(0, -8));
    } else if (form.endsWith("s")) {
      lemmas.push(form.slice(0, -1));
    }

    _.each(this.morphological_substitutions["verb"], function (entry) {
      const morpho = entry[0];
      const origin = entry[1];
      if (form.endsWith(morpho)) {
        lemmas.push(form.slice(0, -morpho.length) + origin);
      }
    });

    lemmas.push(form);

    return [lemmas, "verb"];
  },

  possible_noun_bases: function () {
    const form = this.form;
    const lemmas = [];

    if (this.ends_with_es()) {
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
    } else if (form.endsWith("s")) {
      lemmas.push(form.slice(0, -1));
    }

    _.each(this.morphological_substitutions["noun"], function (entry) {
      const morpho = entry[0];
      const origin = entry[1];
      if (form.endsWith(morpho)) {
        lemmas.push(form.slice(0, -morpho.length) + origin);
      }
    });

    // to push a word like 'us' as it is
    lemmas.push(form);

    return [lemmas, "noun"];
  },

  possible_adj_adv_bases: function (pos) {
    const form = this.form;
    const lemmas = [];

    if (form.endsWith("est") && this.double_consonant("est")) {
      // biggest -> big
      lemmas.push(form.slice(0, -4));
    } else if (form.endsWith("er") && this.double_consonant("er")) {
      // bigger -> bigger
      lemmas.push(form.slice(0, -3));
    }

    _.each(this.morphological_substitutions[pos], function (entry) {
      const morpho = entry[0];
      const origin = entry[1];
      if (form.endsWith(morpho)) {
        lemmas.push(form.slice(0, -morpho.length) + origin);
      }
    });

    // to push a word like 'after' as it is
    lemmas.push(form);

    return [lemmas, pos];
  },

  double_consonant: function (suffix) {
    // for like bigger -> big
    const form = this.form;
    // length after removing suffix from form
    const len = form.length - suffix.length;
    return (
      this.is_vowel(form[len - 3]) &&
      !this.is_vowel(form[len - 2]) &&
      form[len - 2] === form[len - 1]
    );
  },

  is_vowel: function (letter) {
    return _.include(["a", "e", "i", "o", "u"], letter);
  },

  // [ ["leave", "verb"], ["leaf", "noun"], ["leave", "verb"], ["leave", "noun"] ];
  // -> [ ["leave", "verb"], ["leaf", "noun"], ["leave", "noun"] ];
  uniq_lemmas: function (lemmas) {
    const u_lemmas = [];
    const len = lemmas.length;
    for (let i = 0; i < len; i++) {
      const val = lemmas[i];
      if (!this.is_include(u_lemmas, val) && val[0].length > 1) {
        u_lemmas.push(val);
      }
    }
    return u_lemmas;
  },

  is_include: function (lemmas, target) {
    const len = lemmas.length;
    for (let i = 0; i < len; i++) {
      if (lemmas[i][0] === target[0] && lemmas[i][1] === target[1]) {
        return true;
      }
    }
    return false;
  },

  ends_with_es: function () {
    let result = false;
    const form = this.form;
    const ends = ["ches", "shes", "oes", "ses", "xes", "zes"];
    _.each(ends, function (end) {
      if (form.endsWith(end)) {
        result = true;
      }
    });
    return result;
  },

  ends_with_verb_vowel_ys: function () {
    let result = false;
    const form = this.form;
    const ends = ["ays", "eys", "iys", "oys", "uys"];
    _.each(ends, function (end) {
      if (form.endsWith(end)) {
        result = true;
      }
    });
    return result;
  },
};

