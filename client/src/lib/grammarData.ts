// Grammar revision data structure
// Design Philosophy: Signal words are mandatory - every question must have explicit markers

export interface Question {
  id: number;
  type: 'multiple_choice' | 'fill_blank' | 'word_reordering';
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
  chineseTranslation: string;
  vocabulary: string[];
}

export interface GrammarPoint {
  id: number;
  name: string;
  englishName: string;
  description: string;
  questions: Question[];
}

export interface GrammarDatabase {
  metadata: {
    totalQuestions: number;
    grammarPoints: number;
    version: string;
    designStandard: string;
  };
  grammarPoints: GrammarPoint[];
}

let grammarData: GrammarDatabase | null = null;

export const loadGrammarData = async (): Promise<GrammarDatabase> => {
  if (grammarData) return grammarData as GrammarDatabase;
  
  try {
    const response = await fetch('/grammar-questions-database.json');
    grammarData = await response.json();
    return grammarData as GrammarDatabase;
  } catch (error) {
    console.error('Failed to load grammar data:', error);
    throw error;
  }
};

export const getGrammarPoints = async (): Promise<GrammarPoint[]> => {
  const data = await loadGrammarData();
  return data.grammarPoints;
};

export const getGrammarPointById = async (id: number): Promise<GrammarPoint | undefined> => {
  const points = await getGrammarPoints();
  return points.find(gp => gp.id === id);
};

export const getQuestionById = async (grammarPointId: number, questionId: number): Promise<Question | undefined> => {
  const grammarPoint = await getGrammarPointById(grammarPointId);
  return grammarPoint?.questions.find(q => q.id === questionId);
};

export const getAllQuestions = async (): Promise<Question[]> => {
  const points = await getGrammarPoints();
  return points.flatMap(gp => gp.questions);
};

export const getQuestionsByType = async (type: 'multiple_choice' | 'fill_blank' | 'word_reordering'): Promise<Question[]> => {
  const questions = await getAllQuestions();
  return questions.filter(q => q.type === type);
};

// Utility to parse and highlight signal words in explanations
export const parseExplanation = (text: string): (string | { type: 'signal' | 'bold'; content: string })[] => {
  const signalWords = [
    'yesterday', 'last week', 'last month', 'last year', 'last night',
    'ago', 'in 2010', 'in 2020', 'in 2015', 'in time',
    'already', 'yet', 'just', 'since', 'for', 'ever',
    'always', 'usually', 'often', 'sometimes', 'never', 'every day',
    'by', 'when', 'while', 'as soon as', 'unless',
    'so...that', 'where', 'who', 'that',
    'recently', 'ever since', 'day by day', 'on the go'
  ];

  const pattern = /\*\*([^*]+)\*\*/g;
  const parts: (string | { type: 'signal' | 'bold'; content: string })[] = [];
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    const word = match[1];
    
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    // Check if this word is a signal word
    const isSignal = signalWords.some(sw => sw.toLowerCase() === word.toLowerCase());
    parts.push({
      type: isSignal ? 'signal' : 'bold',
      content: word
    });

    lastIndex = pattern.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
};
