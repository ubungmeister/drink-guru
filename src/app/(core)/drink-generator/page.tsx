"use client";

import { useEffect, useState } from "react";
import { Answers } from "@/types/drink-generator";
import { questions } from "@/utilities/questionFileds";
import { QuestionsList } from "@/components/questionsList";
import { DrinkRecipe } from "@/components/drinkRecipe";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [drink, setDrink] = useState<any>(null);
  const [showDrink, setShowDrink] = useState(false);

  const buildQuestionnaire = () => {
    let questionnatire = `The client has completed a quiz to determine their cocktail preferences. Based on the answers provided, please suggest only one cocktail name that aligns with their taste. Only one coctail name. ${
      drink &&
      `Choose different from ${drink.strDrink}"
  .`
    }`;
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

    return questionnatire;
  };

  const fetchDrinkSuggestion = async () => {
    const questionnatire = buildQuestionnaire();

    const response = await fetch("/api/aigenerate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(questionnatire),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch drink suggestion");
    }

    const data = (await response.json()) as any;
    setDrink(data.output);
    setShowDrink(true);
  };

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      fetchDrinkSuggestion(); // Trigger fetching the drink
    }
  };

  const previouseQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const onStartOver = () => {
    setShowDrink(!showDrink);
    setCurrentQuestion(0);
    setAnswers({});
  };

  return (
    <div>
      {/**show questions modal when the user is not done with the questions */}
      {showDrink ? (
        <>
          <div>{drink && drink.strDrink}</div>
          <button onClick={fetchDrinkSuggestion}>Dice</button>
          <button onClick={onStartOver}>Start Over</button>
        </>
      ) : (
        <QuestionsList
          previouseQuestion={previouseQuestion}
          currentQuestion={currentQuestion}
          nextQuestion={nextQuestion}
          answers={answers}
          handleAnswerChange={handleAnswerChange}
        />
      )}
    </div>
  );
}
