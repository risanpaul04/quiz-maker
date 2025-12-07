import React from "react";
import { Link } from "react-router";
import Badge from "./Badge";
import { Calendar, FileText, User, ArrowRightFromLine } from "lucide-react";

const QuizCard = ({ quiz, className }) => {
  const { title, description, questions, creator, createdAt } = quiz;

  const totalQuestions = questions.length;
  const dateCreated = new Date(createdAt).toLocaleDateString();

  return (
    <div
      className={`bg-white rounded-xl shadow-lg p-6 flex flex-col
        h-full justify-between transform hover:scale-105 ${className || ""}`}
    >
      {/* title & description */}
      <div className="">
        <h3 className="text-xl font-bold text-gray-800 line-clamp-2">
          {title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {description || "No description available"}
        </p>
      </div>

      <div>
        {/* bagdes */}
        <div className="w-full flex flex-wrap justify-between items-center">
          <Badge
            icon={Calendar}
            text={dateCreated}
            bgColor="bg-red-100"
            textColor="text-red-700"
          ></Badge>

          <Badge
            icon={FileText}
            text={`${totalQuestions} questions`}
            bgColor="bg-yellow-100"
            textColor="text-yellow-700"
          ></Badge>

          <Badge
            icon={User}
            text={creator.username || 'anonymous'}
            bgColor="bg-green-100"
            textColor="text-green-700"
            className="font-semibold"
          ></Badge>
        </div>

        <div
          className="my-2 w-fit p-2 rounded-full border-1 border-blue-600 
            bg-blue-100 text-blue-600 font-bold transform hover:scale-105 transition duration-75
            hover:bg-blue-300
            "
        >
          <Link
            to={`/quiz/${quiz._id}`}
            className="btn btn-primary text-md flex gap-2 items-center"
          >
            Take Quiz <ArrowRightFromLine />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuizCard;