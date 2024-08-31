import React from "react";
import { QuestionsModalProps } from "@/types/drink-generator";
import { questions } from "@utilities/questionFileds";
import { motion, AnimatePresence } from "framer-motion";
import { FaDice } from "react-icons/fa";
import { SyncLoader as Loader } from "react-spinners";

export const QuestionsList = ({
  currentQuestion,
  nextQuestion,
  previousQuestion,
  answers,
  handleAnswerChange,
  isLoading,
}: QuestionsModalProps) => {
  // Show loading message if loading is true
  if (isLoading) {
    return (
      <div className="flex items-start pt-48 justify-center min-h-screen">
        <motion.div
          className="w-[296px] h-[180px] p-4 rounded-2xl space-x-1 flex items-center justify-center text-white text-center"
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            backgroundColor: "#f29e74",
          }}
        >
          <h3 className="font-medium text-xl">Loading, please wait</h3>
          <Loader color="white" loading={true} size={7} />
        </motion.div>
      </div>
    );
  }

  // Show questions if not loading
  return (
    <div className="flex items-start pt-48 justify-center min-h-screen">
      <div className="flex flex-col items-center space-y-4">
        <AnimatePresence>
          {questions.map((question, index) => {
            const isVisible = index === currentQuestion; // Only show the current question
            return (
              isVisible && (
                <motion.div
                  className="w-[296px]  p-4 rounded-2xl transition-all duration-100 text-white"
                  key={question.id}
                  style={{
                    backgroundColor: question.color,
                  }}
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="mb-4 font-medium text-xl text-center">
                    {question.prompt}
                  </h3>
                  <div className="flex flex-row flex-wrap space-x-2 mb-4 justify-center">
                    {question.options.map((option, idx) => (
                      <label key={idx} className="flex items-center mb-2">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option}
                          checked={answers[question.id] === option}
                          onChange={() =>
                            handleAnswerChange(question.id, option)
                          }
                          className="mr-2"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                  <div className="flex justify-between">
                    {currentQuestion > 0 && (
                      <button onClick={previousQuestion}>Previous</button>
                    )}
                    {currentQuestion === 0 && (
                      <button className="flex flex-row space-x-1">
                        <span>Random</span> <FaDice />
                      </button>
                    )}
                    <button onClick={nextQuestion}>
                      {currentQuestion === questions.length - 1
                        ? "Submit"
                        : "Next Question"}
                    </button>
                  </div>
                </motion.div>
              )
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
