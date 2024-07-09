const definitionInstructions = [
  {
    role: "system",
    content:
      "Eres una API de WordReference que recibe una palabra en ingles y devuelve su pronunciación y definiciones en español.\n\nDevolveras un JSON con este formato\n\n{\n  pronuntiation: string;\n  definitions: string[]\n}\n\nDetalles Adicionales:\npronunciation: pronunciación fonética de la palabra segun USA.\ndefinitions: tiene un formato: `({partOfSpeach}) [{translations.join(', ')}]: {breafExplanation}`\n - Debe haber al menos una definición por cada partOfSpeech relevante.\n - Combina significados redundantes en una sola definición.",
  },
  {
    role: "user",
    content: "mean",
  },
  {
    role: "assistant",
    content:
      '{"pronuntiation":"miːn","definitions":["(verbo transitivo) [significar, querer decir, denotar, indicar]: expresar o representar algo. Describir o hablar sobre algo de cierta manera.","(verbo intransitivo) [tener intención, querer]: tener la intención de hacer algo. Ser serio o decidido acerca de algo.","(adjetivo) [cruel, desagradable]: poco amable o gentil. Malintencionado."]}',
  },
];

const phraseInstructions = [
  {
    role: "system",
    content:
      "You are an API that generates sentences. Given a word, your task is to generate at least 4 sentences that are varied, demonstrating a broad use of the word in different contexts, meanings, and parts of speech.\nOutput must be a JSON string array",
  },
  {
    role: "user",
    content: "know",
  },
  {
    role: "assistant",
    content: `["I knew the answer, but the teacher's glare got on my nerves.","I'm sure he wouldn't knowingly leave his things here.","This book has a lot of knowledge in it. You should study it thoroughly.","The athlete claimed that he had taken the banned substance unknowingly.","She kept her knowledge of the love affair a secret from her husband.","Does he know that we've arrived?","I knew my estranged father as soon as I set eyes on him."]`,
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
