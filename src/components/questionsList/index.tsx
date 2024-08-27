import React from "react";
import { QuestionsModalProps } from "@/types/drink-generator";
import { questions } from "@utilities/questionFileds";

export const QuestionsList = ({
  currentQuestion,
  nextQuestion,
  previousQuestion,
  answers,
  handleAnswerChange,
}: QuestionsModalProps) => {
  return (
    <div className="flex justify-center items-start min-h-screen pt-48">
      {" "}
      {questions.map((question, index) => (
        <div
          key={question.id}
          style={{ display: index === currentQuestion ? "block" : "none" }}
        >
          <h3>{question.prompt}</h3>
          {currentQuestion > 0 && (
            <button onClick={previousQuestion}>Previous</button>
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
};
