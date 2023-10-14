export interface Phrase {
  id: string;
  content: string;
  translation: string;
}

export interface Memo {
  id: string;
  word: string;
  phrases: Phrase[];
  definition: string;
  pronunciation: string;
  priority: number;
  fails: number;
  success: number;
}