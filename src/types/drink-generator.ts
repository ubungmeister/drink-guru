export type Answers = {
  [key: number]: string;
};

export type QuestionsModalProps = {
  currentQuestion: number;
  nextQuestion: () => void;
  previousQuestion: () => void;
  answers: Answers;
  handleAnswerChange: (questionId: number, answer: string) => void;
};

export type DrinkRecipeType = {
  name: string;
  instructions: string;
  image: string;
  ingredients: { ingredient: string; measure: string }[];
};
