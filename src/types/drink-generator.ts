export type Answers = {
  [key: number]: string;
};

export type QuestionsModalProps = {
  currentQuestion: number;
  nextQuestion: () => void;
  previouseQuestion: () => void;
  answers: Answers;
  handleAnswerChange: (questionId: number, answer: string) => void;
};
