"use client";

import { useState } from "react";

type Answers = {
  [key: number]: string;
};


export default function Page() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [drink, setDrink] = useState<string | null>(null);

  const questions = [
    {
      id: 1,
      prompt: "Do you prefer your drinks to be Sweet or Sour?",
      options: ["Sweet", "Sour"],
    },
    {
      id: 2,
      prompt: "How strong do you like your cocktails?",
      options: ["Light", "Medium", "Strong"],
    },
    {
      id: 3,
      prompt: "Do you enjoy Fruity or Herbal flavors?",
      options: ["Fruity", "Herbal"],
    },
    {
      id: 4,
      prompt: "Do you have a preferred spirit?",
      options: ["Vodka", "Rum", "Gin", "Whiskey", "No Preference"],
    },
    {
      id: 5,
      prompt: "How do you prefer your drink served?",
      options: ["On the rocks", "Straight up", "Mixed"],
    },
  ];

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  let questionnatire = `The client has completed a quiz to determine their cocktail preferences. Based on the answers provided, please suggest only one cocktail name that aligns with their taste. Only one coctail name. ${drink && `Choose different from ${drink} `}`;

  const nextQuestion = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      if (currentQuestion === questions.length - 1) {
        Object.entries(answers).map(([key, value]) => {
          const question = questions.find(
            (question) => question.id === parseInt(key),
          );
          questionnatire = questionnatire.concat(
            (question?.prompt as string) + " " + value + ". ",
          );
          return {
            question: question?.prompt,
            answer: value,
          };
        });

        try {
          const response = await fetch("/api/aigenerate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(questionnatire),
          });

          const data = await response.json();

          if (response.ok) {
            setDrink(data.output);
          } else {
            console.error("Response error:", response.statusText);
          }
        } catch (error) {}
      }
    }
  };
  const previouseQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  return (
    <div>
      {questions.map((question, index) => (
        <div
          key={question.id}
          style={{ display: index === currentQuestion ? "block" : "none" }}
        >
          <h3>{question.prompt}</h3>
          {currentQuestion > 0 && (
            <button onClick={previouseQuestion}>Previous</button>
          )}
          {question.options.map((option, idx) => (
            <label key={idx}>
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option}
                checked={answers[question.id] === option}
                onChange={() => handleAnswerChange(question.id, option)}
              />
              {option}
            </label>
          ))}
          {
            <button onClick={nextQuestion}>
              {currentQuestion === questions.length - 1
                ? "Submit"
                : "Next Question"}
            </button>
          }
        </div>
      ))}
    </div>
  );
}
