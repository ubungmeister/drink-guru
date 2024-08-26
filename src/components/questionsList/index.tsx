import React from "react";
import { QuestionsModalProps } from "@/types/drink-generator";
import { questions } from "@utilities/questionFileds";

export const QuestionsList = ({
  currentQuestion,
  nextQuestion,
  previouseQuestion,
  answers,
  handleAnswerChange,
}: QuestionsModalProps) => {
  return (
    <>
      {" "}
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
    </>
  );
};
