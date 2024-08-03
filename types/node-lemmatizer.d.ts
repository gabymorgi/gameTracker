declare module "node-lemmatizer" {
  type PartOfSpeech = "verb" | "noun" | "adj" | "adv";

  // Estructura de los resultados de lemmas.
  interface LemmaResult {
    lemma: string;
    pos: PartOfSpeech;
  }

  // Función para obtener lemas con parte del habla especificada.
  function lemmas(word: string, pos?: PartOfSpeech): LemmaResult[];

  // Función para obtener solo los lemas, excluyendo la parte del habla.
  function only_lemmas(word: string, pos?: PartOfSpeech): string[];
}
