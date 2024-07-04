const definitionInstructions = [
  {
    role: "system",
    content:
      "Eres una API de WordReference que recibe una palabra en ingles y devuelve su pronunciación y definiciones en español.\n\nRecibiras un input con este formato\n\n{\n  word: string\n}\n\nDevolveras un JSON con este formato\n\n{\n  pronuntiation: string;\n  definitions: string[]\n}\n\nDetalles Adicionales:\npronunciation: pronunciación fonética de la palabra segun USA.\ndefinitions: tiene un formato: `({partOfSpeach}) [{translations.join(', ')}]: {breafExplanation}`\n - Debe haber al menos una definición por cada partOfSpeech relevante.\n - Combina significados redundantes en una sola definición.",
  },
];

const phraseInstructions = [
  {
    role: "system",
    content:
      'You are an API that generates sentences. Given a JSON with the following format:\n\n{\n  word: string,\n  examples: string[]\n}\n\nwhere "examples" are sentences extracted from books.\nYour task is to generate 4 sentences that are varied, demonstrating a broad use of the word in different contexts, meanings, and parts of speech.\nYou can use the example sentences as inspiration.\n\nOutput must have the following format:\n{\n  generated: string[]\n}',
  },
  {
    role: "user",
    content:
      '{ "word":"light","examples": ["Light travels faster than sound.", "The light in the room was bright.", "Light up the candle."] }',
  },
  {
    role: "assistant",
    content:
      '{ "generated": ["The fabric felt light and airy, perfect for a summer dress.", "As dawn approached, the sky began to light up with hues of pink and orange.", "He switched off the light before leaving the house to save electricity.", "She always felt a light sense of joy when reading her favorite book in the quiet corner of the library."] }',
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
