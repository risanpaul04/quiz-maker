import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { quizAPI, resultAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const QuizTaking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  const fetchQuiz = async () => {
    try {
      const response = await quizAPI.getQuizById(id);
      setQuiz(response.data);
    } catch (err) {
      setError('Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer
    });
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    const unanswered = quiz.questions.filter(q => !answers[q._id]);
    if (unanswered.length > 0) {
      if (!window.confirm(`You have ${unanswered.length} unanswered questions. Submit anyway?`)) {
        return;
      }
    }

    setSubmitting(true);

    try {
      const resultData = {
        quizId: id,
        answers: Object.entries(answers).map(([questionId, selectedAnswer]) => ({
          questionId,
          selectedAnswer
        }))
      };

      const response = await resultAPI.submitResult(resultData);
      navigate('/results/latest', {
        state: { result: response.data.result, quiz }
      });
    } catch (err) {
      setError('Failed to submit quiz');
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="max-w-2xl mx-auto text-center text-white">
        <h2 className="text-2xl font-bold">Quiz not found</h2>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{quiz.title}</h1>
        <div className="space-y-2">
<div className="flex justify-between text-sm text-gray-600">
<span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
<span>{Math.round(progress)}% Complete</span>
</div>
<div className="w-full bg-gray-200 rounded-full h-3">
<div
className="bg-gradient-to-r from-primary-500 to-purple-600 h-3 rounded-full transition-all duration-300"
// style={{ width: ${progress} }} 
/>
</div>
</div>
</div>
{/* Question */}
  <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
    <h2 className="text-xl font-bold text-gray-800 mb-6">
      {currentQuestion + 1}. {question.questionText}
    </h2>

    <div className="space-y-3">
      {question.options.map((option, index) => {
        const isSelected = answers[question._id] === option.text;
        return (
          <div
            key={index}
            onClick={() => handleAnswerSelect(question._id, option.text)}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              isSelected
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                isSelected ? 'border-primary-500 bg-primary-500' : 'border-gray-300'
              }`}>
                {isSelected && (
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className="flex-1 font-medium text-gray-800">
                {String.fromCharCode(65 + index)}. {option.text}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  </div>

  {/* Navigation */}
  <div className="bg-white rounded-2xl shadow-xl p-6">
    <div className="flex justify-between items-center mb-4">
      <button
        onClick={handlePrevious}
        disabled={currentQuestion === 0}
        className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ← Previous
      </button>

      <div className="flex gap-2 flex-wrap justify-center">
        {quiz.questions.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentQuestion(index)}
            className={`w-10 h-10 rounded-lg font-medium transition-all ${
              index === currentQuestion
                ? 'bg-primary-500 text-white'
                : answers[quiz.questions[index]._id]
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {currentQuestion === quiz.questions.length - 1 ? (
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="btn btn-primary px-2 py-3 text-nowrap outline-none ring-2 ring-blue-600 bg-blue-100 text-blue-600 rounded disabled:opacity-50 "
        >
          {submitting ? 'Submitting...' : 'Submit Quiz'}
        </button>
      ) : (
        <button
          onClick={handleNext}
          className="btn btn-primary"
        >
          Next →
        </button>
      )}
    </div>
  </div>
</div>
);
};
export default QuizTaking;