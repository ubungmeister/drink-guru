"use client";

import {useState } from "react";
import { Answers, DrinkRecipeType } from "@/types/drink-generator";
import { questions } from "@/utilities/questionFileds";
import { QuestionsList } from "@/components/questionsList";
import { DrinkRecipe } from "@/components/drinkRecipe";
import { StartModule } from "@/components/startModule";
import { randomAswersChoose } from "@utilities/questionFileds";
import { DrinkLoading } from "@/components/library/animations/DrinkLoading";

export default function Page() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [drink, setDrink] = useState<DrinkRecipeType | null>(null);
  const [showDrink, setShowDrink] = useState(false);
  const [showStartModule, setShowStartModule] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
 

  const buildQuestionnaire = () => {
    let questionnatire = `The client has completed a quiz to determine their cocktail preferences. Based on the answers provided, please suggest only one cocktail name that aligns with their taste. Only one coctail name. ${
      drink &&
      `Choose different from ${drink.name}"
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
    setIsLoading(true);
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
    setIsLoading(false);
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

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const onStartOver = () => {
    setShowDrink(!showDrink);
    setCurrentQuestion(0);
    setAnswers({});
  };

  const onRandomClick = () => {
    const randomAnswers = randomAswersChoose();
    setAnswers(randomAnswers);
    fetchDrinkSuggestion();
  };

  if (isLoading) {
    return <DrinkLoading />;
  }

  if (showStartModule) {
    return <StartModule setShowStartModule={setShowStartModule} />;
  }

  if (showDrink && drink && !isLoading) {
    return (
      <DrinkRecipe
        drink={drink}
        startOver={onStartOver}
        fetchAgain={fetchDrinkSuggestion}
        isLoading={isLoading}
      />
    );
  }
  if (!isLoading) {
    return (
      <QuestionsList
        previousQuestion={previousQuestion}
        currentQuestion={currentQuestion}
        nextQuestion={nextQuestion}
        answers={answers}
        handleAnswerChange={handleAnswerChange}
        onRandomClick={onRandomClick}
      />
    );
  }
}
