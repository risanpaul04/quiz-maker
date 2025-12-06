import React, { useState } from "react";
import { useNavigate } from "react-router";
import { quizAPI } from "../services/api";
import ErrorMessage from "../components/ErrorMessage";

const QuizCreation = () => {
  const [quizData, setQuizData] = useState({
    title: "",
    description: "",
    isPublic: true,
  });
  const [questions, setQuestions] = useState([
    {
      questionText: "",
      options: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
      correctAnswer: "",
    },
  ]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleQuizDataChange = (e) => {
    const { name, value, type, checked } = e.target;
    setQuizData({
      ...quizData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleQuestionChange = (questionIndex, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex].text = value;
    setQuestions(updatedQuestions);
  };

  const handleCorrectAnswerChange = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    const selectedOption = updatedQuestions[questionIndex].options[optionIndex];

    updatedQuestions[questionIndex].correctAnswer = selectedOption.text;
    updatedQuestions[questionIndex].options.forEach((opt, idx) => {
      opt.isCorrect = idx === optionIndex;
    });

    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        options: [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
        correctAnswer: "",
      },
    ]);
  };

  const removeQuestion = (questionIndex) => {
    if (questions.length > 1) {
      const updatedQuestions = questions.filter(
        (_, index) => index !== questionIndex
      );
      setQuestions(updatedQuestions);
    }
  };

  const validateQuiz = () => {
    if (!quizData.title.trim()) {
      setError("Quiz title is required");
      return false;
    }

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];

      if (!question.questionText.trim()) {
        setError(`Question ${i + 1} text is required`);
        return false;
      }

      const filledOptions = question.options.filter((opt) => opt.text.trim());
      if (filledOptions.length < 2) {
        setError(`Question ${i + 1} must have at least 2 options`);
        return false;
      }

      if (!question.correctAnswer) {
        setError(`Question ${i + 1} must have a correct answer selected`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateQuiz()) {
      return;
    }

    setLoading(true);

    try {
      const quizPayload = {
        ...quizData,
        questions: questions.map((q) => ({
          questionText: q.questionText,
          options: q.options.filter((opt) => opt.text.trim()),
          correctAnswer: q.correctAnswer,
        })),
      };

      await quizAPI.createQuiz(quizPayload);
      navigate("/my-quizzes");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create quiz");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Create New Quiz
        </h1>

        {error && <ErrorMessage message={error} onClose={() => setError("")} />}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Quiz Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">
              Quiz Information
            </h2>

            <div className="flex flex-col gap-2">
              <label htmlFor="title" className="label">
                Quiz Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={quizData.title}
                onChange={handleQuizDataChange}
                placeholder="Enter quiz title"
                required
                className="input border-2 border-gray-200 rounded-sm py-2 px-1"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="description" className="label">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={quizData.description}
                onChange={handleQuizDataChange}
                placeholder="Enter quiz description (optional)"
                rows="3"
                className="input resize-none input border-2 border-gray-200 rounded-sm py-2 px-1"
              />
            </div>

            <div className="flex items-center justify-center border-2 border-gray-200 w-fit p-2 rounded-sm">
              <input
                type="checkbox"
                id="isPublic"
                name="isPublic"
                checked={quizData.isPublic}
                onChange={handleQuizDataChange}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label
                htmlFor="isPublic"
                className="ml-2 text-gray-700 font-medium"
              >
                Make quiz public
              </label>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Questions</h2>
              <button
                type="button"
                onClick={addQuestion}
                className="mt-2 flex items-center justify-center p-2 text-blue-600 border border-blue-400 rounded-lg hover:bg-blue-50 transition duration-150"
              >
                + Add Question
              </button>
            </div>

            {questions.map((question, qIndex) => (
              <div
                key={qIndex}
                className="border-2 border-gray-200 rounded-xl p-6 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-800">
                    Question {qIndex + 1}
                  </h3>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIndex)}
                      className="btn p-1 border-1 border-red-400  text-red-600 hover:text-red-700 hover:bg-red-200 rounded-sm  font-medium"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="flex flex-col gap-5 p-6 bg-white rounded-lg shadow-md border border-gray-100">
                  {/* Question Text Input */}
                  <div className="flex flex-col gap-2">
                    <label className="text-lg font-semibold text-gray-800">
                      Question Text <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={question.questionText}
                      onChange={(e) =>
                        handleQuestionChange(
                          qIndex,
                          "questionText",
                          e.target.value
                        )
                      }
                      placeholder="Enter your question clearly and concisely"
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg text-base
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       transition duration-150"
                    />
                  </div>

                  {/* Options Section */}
                  <div className="space-y-3">
                    <label className="text-lg font-semibold text-gray-800 block">
                      Options <span className="text-red-500">*</span> (Select
                      the correct answer)
                    </label>

                    {question.options.map((option, oIndex) => (
                      <div
                        key={oIndex}
                        className={`
                    flex items-center gap-3 p-3 rounded-lg border-2 
                    cursor-pointer transition duration-150
                    ${
                      option.isCorrect
                        ? "border-green-500 bg-green-50 shadow-md"
                        : "border-gray-200 hover:border-blue-300"
                    }
                `}
                        onClick={() =>
                          handleCorrectAnswerChange(qIndex, oIndex)
                        }
                      >
                        {/* Custom Styled Radio Button */}
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition duration-150
                                ${
                                  option.isCorrect
                                    ? "border-green-600 bg-green-600"
                                    : "border-gray-400"
                                }`}
                        >
                          {option.isCorrect && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>

                        <input
                          type="text"
                          value={option.text}
                          onChange={(e) =>
                            handleOptionChange(qIndex, oIndex, e.target.value)
                          }
                          placeholder={`Option ${oIndex + 1}`}
                          // Prevent propagation of the click event from the input to the div's onClick
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1 p-0 border-none bg-transparent text-gray-700 placeholder-gray-400
                               focus:outline-none focus:ring-0 text-base"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="btn btn-primary flex-1 py-3 border-1 text-blue-600 border-blue-400 hover:bg-blue-50 rounded-sm"
              disabled={loading}
            >
              {loading ? "Creating Quiz..." : "Create Quiz"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/quizzes")}
              className="btn flex-1 py-3 border-1 text-red-600 border-red-400 hover:bg-red-200 rounded-sm transition delay-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizCreation;