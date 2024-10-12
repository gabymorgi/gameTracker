interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

const definitionInstructions: Message[] = [
  {
    role: "system",
    content: `You are a WordReference API that receives a word in English and returns its pronunciation and definitions in Spanish.
You will return a JSON with this format
      
interface WordResponse {
  pronuntiation: string;
  conjugation: string;
  definitions: Array<{
    type: string;
    translations: Array<string>;
    explanation: string;
  }>;
}

Additional Details:
pronunciation: phonetic pronunciation of the word according to the USA.
conjugation: '-ed' for regular verbs, '[past form], [past participle]' for irregular verbs.
definitions: there will be a definition for each relevant part of speech. Combine redundant meanings into a single definition. The explanation should be brief and at the bottom unless necessary for clarification.
type: part of speech (n, v, adj, adv, slang, etc.)`,
  },
  {
    role: "user",
    content: "bear",
  },
  {
    role: "assistant",
    content: JSON.stringify({
      pronuntiation: "bɛr",
      conjugation: "bore, borne",
      definitions: [
        {
          type: "n",
          translations: ["oso", "oso de peluche"],
          explanation: "mamífero carnívoro de gran tamaño.",
        },
        {
          type: "v",
          translations: ["soportar", "llevar", "soportar"],
          explanation: "sostener o llevar algo. Tolerar una situación.",
        },
        {
          type: "v",
          translations: ["dar a luz", "parir"],
          explanation: "traer al mundo un hijo.",
        },
        {
          type: "v",
          translations: ["tener", "llevar", "mostrar"],
          explanation: "tener una expresión facial.",
        },
      ],
    }),
  },
];

const phraseInstructions: Message[] = [
  {
    role: "system",
    content: `You are an API that generates sentences.
Given a word, your task is to generate sentences that are varied, demonstrating a broad use of the word in different contexts, meanings, inflections and parts of speech.
If the word is irregular, include the irregular forms.
Output must be a JSON with this format
      
interface PhraseResponse {
  sentences: Array<string>;
}`,
  },
  {
    role: "user",
    content: "strand",
  },
  {
    role: "assistant",
    content: JSON.stringify({
      sentences: [
        "We saw a bear wandering near the campsite last night.",
        "I can't bear the thought of losing my keys again.",
        "She bore three children, each with a unique personality.",
        "The document clearly states that all expenses must be borne by the client.",
        "She bears a striking resemblance to her grandmother",
        "He bore the pain silently, without asking for help.",
      ],
    }),
  },
];

const translationInstructions: Message[] = [
  {
    role: "system",
    content:
      "Your are a translator. The user will send a message in english, and you must say the same but in spanish",
  },
];

export interface Request {
  custom_id: string;
  method: string;
  url: string;
  body: {
    model: "gpt-3.5-turbo" | "gpt-4o-mini";
    max_tokens: number;
    messages?: Message[];
    response_format?: {
      type: string;
    };
  };
}

const baseRequest: Request = {
  custom_id: "request-1",
  method: "POST",
  url: "/v1/chat/completions",
  body: {
    model: "gpt-4o-mini",
    max_tokens: 1000,
  },
};

interface Word {
  id: string;
  value: string;
}

export const getDefinitionRequest = (word: Word) => {
  const request: Request = structuredClone(baseRequest);
  request.custom_id = word.id;
  request.body.response_format = {
    type: "json_object",
  };
  request.body.messages = structuredClone(definitionInstructions);
  request.body.messages.push({
    role: "user",
    content: word.value,
  });
  return request;
};

export const getPhraseRequest = (word: Word) => {
  const request = structuredClone(baseRequest);
  request.custom_id = word.id;
  request.body.response_format = {
    type: "json_object",
  };
  request.body.messages = structuredClone(phraseInstructions);
  request.body.messages.push({
    role: "user",
    content: word.value,
  });
  return request;
};

interface Phrase {
  id: string;
  content: string;
}

export const getTranslationRequest = (phrase: Phrase) => {
  const request = structuredClone(baseRequest);
  request.custom_id = phrase.id;
  request.body.messages = structuredClone(translationInstructions);
  request.body.messages.push({
    role: "user",
    content: phrase.content,
  });
  return request;
};
