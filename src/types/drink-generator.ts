export type Answers = {
  [key: number]: string;
};

export type QuestionsModalProps = {
  currentQuestion: number;
  nextQuestion: () => void;
  previousQuestion: () => void;
  onRandomClick: () => void;
  answers: Answers;
  handleAnswerChange: (questionId: number, answer: string) => void;
};

export type DrinkRecipeType = {
  id: string;
  name: string;
  instructions: string;
  image: string;
  ingredients: { ingredient: string; measure: string }[];
};

export type MetricsType = {
  sweetness:string
  sourness:string
  alcoholStrength:string
  bitterness:string
  timeToMake:string
  rating:string
}
