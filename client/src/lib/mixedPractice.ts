import { Question, GrammarPoint } from "./grammarData";

export interface MixedPracticeSession {
  id: string;
  questions: Question[];
  currentIndex: number;
  correctCount: number;
  totalAttempted: number;
  startTime: Date;
  grammarPointMap: Map<number, GrammarPoint>;
}

/**
 * Create a mixed practice session with random questions
 * @param grammarPoints - All grammar points
 * @param count - Number of questions to include (default: 20)
 * @returns Mixed practice session
 */
export const createMixedPracticeSession = (
  grammarPoints: GrammarPoint[],
  count: number = 20
): MixedPracticeSession => {
  // Collect all questions from all grammar points
  const allQuestions: (Question & { grammarPointId: number })[] = [];
  const grammarPointMap = new Map<number, GrammarPoint>();

  grammarPoints.forEach(gp => {
    grammarPointMap.set(gp.id, gp);
    gp.questions.forEach(q => {
      allQuestions.push({ ...q, grammarPointId: gp.id });
    });
  });

  // Shuffle and select random questions
  const shuffled = allQuestions.sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, allQuestions.length));

  return {
    id: `session-${Date.now()}`,
    questions: selected,
    currentIndex: 0,
    correctCount: 0,
    totalAttempted: 0,
    startTime: new Date(),
    grammarPointMap,
  };
};

/**
 * Get the current question in the session
 */
export const getCurrentQuestion = (
  session: MixedPracticeSession
): Question | null => {
  if (session.currentIndex >= session.questions.length) {
    return null;
  }
  return session.questions[session.currentIndex];
};

/**
 * Get the grammar point name for a question
 */
export const getGrammarPointName = (
  session: MixedPracticeSession,
  question: Question & { grammarPointId?: number }
): string => {
  const grammarPointId = (question as any).grammarPointId;
  if (!grammarPointId) return "Unknown";

  const gp = session.grammarPointMap.get(grammarPointId);
  return gp?.name || "Unknown";
};

/**
 * Record an answer in the session
 */
export const recordAnswer = (
  session: MixedPracticeSession,
  isCorrect: boolean
): MixedPracticeSession => {
  return {
    ...session,
    correctCount: session.correctCount + (isCorrect ? 1 : 0),
    totalAttempted: session.totalAttempted + 1,
  };
};

/**
 * Move to next question
 */
export const moveToNextQuestion = (
  session: MixedPracticeSession
): MixedPracticeSession => {
  return {
    ...session,
    currentIndex: Math.min(
      session.currentIndex + 1,
      session.questions.length - 1
    ),
  };
};

/**
 * Move to previous question
 */
export const moveToPreviousQuestion = (
  session: MixedPracticeSession
): MixedPracticeSession => {
  return {
    ...session,
    currentIndex: Math.max(session.currentIndex - 1, 0),
  };
};

/**
 * Check if the session is complete
 */
export const isSessionComplete = (session: MixedPracticeSession): boolean => {
  return (
    session.currentIndex >= session.questions.length - 1 &&
    session.totalAttempted > 0
  );
};

/**
 * Get session statistics
 */
export const getSessionStats = (session: MixedPracticeSession) => {
  const accuracy =
    session.totalAttempted > 0
      ? Math.round((session.correctCount / session.totalAttempted) * 100)
      : 0;

  const elapsedTime = Math.floor(
    (Date.now() - session.startTime.getTime()) / 1000
  );

  return {
    totalQuestions: session.questions.length,
    attempted: session.totalAttempted,
    correct: session.correctCount,
    accuracy,
    elapsedTime,
    remaining: session.questions.length - session.currentIndex - 1,
  };
};
