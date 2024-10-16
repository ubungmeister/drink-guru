"use client";

import { useState, useEffect } from "react";
import { Answers, DrinkRecipeType } from "@/types/drink-generator";
import { questions } from "@/utilities/questionFileds";
import { QuestionsList } from "@/components/questionsList";
import { DrinkRecipe } from "@/components/drinkRecipe";
import { StartModule } from "@/components/startModule";
import { randomAswersChoose } from "@utilities/questionFileds";
import { DrinkLoading } from "@/components/library/animations/DrinkLoading";
import { toast } from "react-toastify";

export default function Page() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [drink, setDrink] = useState<DrinkRecipeType | null>(null);
  const [showDrink, setShowDrink] = useState(false);
  const [showStartModule, setShowStartModule] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isDrinkSaved, setIsDrinkSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const checkIfSaved = async () => {
      if (!drink) return;
      try {
        const response = await fetch(`/api/saveddrinks/${drink.id}`);
        const data = await response.json();
        setIsDrinkSaved(data.isCocktailSaved);
      } catch (error) {
        console.log("Failed to fetch", error);
      }
    };
    checkIfSaved();
  }, [drink, isDrinkSaved]);

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
    setIsDataLoading(true);
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
    setIsDataLoading(false);
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

  const onSaveDrink = async () => {
    setIsSaving(true);
    const response = await fetch("/api/saveddrinks", {
      method: isDrinkSaved ? "DELETE" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ drink: drink }),
    });
    if (!response.ok) {
      setIsSaving(false);

      throw new Error("Failed to save drink");
    }
    setIsDrinkSaved(!isDrinkSaved);
    setIsSaving(false);

    toast.success(isDrinkSaved ? "Drink DELETED" : "Drink SAVED");
  };

  if (isDataLoading) {
    return <DrinkLoading />;
  }

  if (showStartModule) {
    return <StartModule setShowStartModule={setShowStartModule} />;
  }

  if (showDrink && drink && !isDataLoading) {
    return (
      <DrinkRecipe
        drink={drink}
        startOver={onStartOver}
        fetchAgain={fetchDrinkSuggestion}
        saveDrink={onSaveDrink}
        isLoading={isDataLoading}
        isDrinkSaved={isDrinkSaved}
        isSaving={isSaving}
      />
    );
  }
  if (!isDataLoading) {
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
