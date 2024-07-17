const definitionInstructions = [
  {
    role: "system",
    content:
      "Eres una API de WordReference que recibe una palabra en ingles y devuelve su pronunciación y definiciones en español.\n\nDevolveras un JSON con este formato\n\n{\n  pronuntiation: string;\n  definitions: string[]\n}\n\nDetalles Adicionales:\npronunciation: pronunciación fonética de la palabra segun USA.\ndefinitions: tiene un formato: `({partOfSpeach}) [{translations.join(', ')}]: {breafExplanation}`\n - Debe haber al menos una definición por cada partOfSpeech relevante.\n - Combina significados redundantes en una sola definición.",
  },
  {
    role: "user",
    content: "strand",
  },
  {
    role: "assistant",
    content:
      '{"pronuntiation":"/strænd/","definitions":["(verb) [dejar varado]: Dejar a alguien en un lugar del que no puede salir fácilmente.","(noun) [playa, costa]: Una orilla de mar, río o lago.","(noun) [hebra, hilo]: Un solo filamento de una cuerda, alambre o cabello."]}',
  },
];

const phraseInstructions = [
  {
    role: "system",
    content:
      "You are an API that generates sentences. Given a word, your task is to generate at least 4 sentences 2 lines long that are varied, demonstrating a broad use of the word in different contexts, meanings, and parts of speech.\nOutput must be a JSON string array",
  },
  {
    role: "user",
    content: "strand",
  },
  {
    role: "assistant",
    content: `["The fishermen repaired their nets on the strand.","Even if there were such a way, one would still be stranded in the middle of the mountains, weeks from civilization.","A single strand of wire was enough to complete the circuit.","The city that once covered it did range the eastern strand.","They walked along the sandy strand, enjoying the sunset.","She tucked a stray strand of hair behind her ear.","Shallan was stranded on a stretch of coast that was almost completely uninhabited, in lands that froze at night."]`,
  },
];

const translationInstructions = [
  {
    role: "system",
    content:
      "Your are a translator. The user will send a message in english, and you must say the same but in spanish",
  },
];

const baseRequest = {
  custom_id: "request-1",
  method: "POST",
  url: "/v1/chat/completions",
  body: {
    model: "gpt-3.5-turbo",
    messages: [],
    max_tokens: 1000,
  },
};

export const generateDefinitionRequest = (id, input) => {
  const request = structuredClone(baseRequest);
  request.custom_id = id;
  request.body.response_format = {
    type: "json_object",
  };
  request.body.messages = structuredClone(definitionInstructions);
  request.body.messages.push({
    role: "user",
    content: JSON.stringify(input),
  });
  return request;
};

export const generatePhraseRequest = (id, input) => {
  const request = structuredClone(baseRequest);
  request.custom_id = id;
  request.body.response_format = {
    type: "json_object",
  };
  request.body.messages = structuredClone(phraseInstructions);
  request.body.messages.push({
    role: "user",
    content: JSON.stringify(input),
  });
  return request;
};

export const generateTranslationRequest = (id, input) => {
  const request = structuredClone(baseRequest);
  request.custom_id = id;
  request.body.messages = structuredClone(translationInstructions);
  request.body.messages.push({
    role: "user",
    content: input,
  });
  return request;
};
