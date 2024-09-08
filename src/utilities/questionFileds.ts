import {Answers} from "@/types/drink-generator"
export const questions = [
  {
    id: 1,
    prompt: "Sweet or Sour?",
    options: ["Sweet", "Sour"],
    color: "#FB7D8A",
  },
  {
    id: 2,
    prompt: "How strong it should be?",
    options: ["Light", "Medium", "Strong"],
    color: "#FF9CB4",
  },
  {
    id: 3,
    prompt: "Fruity or Herbal flavors?",
    options: ["Fruity", "Herbal"],
    color: "#FCBABA",
  },
  {
    id: 4,
    prompt: "Preferred spirit?",
    options: ["Vodka", "Rum", "Gin", "Whiskey", "No Preference"],
    color: "#f0b999",
  },
  {
    id: 5,
    prompt: "How to serve?",
    options: ["On the rocks", "Straight up", "Mixed"],
    color: "#f29e74",
  },
];

export const randomAswersChoose = () => {
  const answers:Answers = {};
  questions.forEach((question) => {
    const randomOption = Math.floor(Math.random() * question.options.length);
    answers[question.id] = question.options[randomOption];
  });
  return answers
}
