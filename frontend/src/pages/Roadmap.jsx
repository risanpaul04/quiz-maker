import React from "react";
import { ChartSpline, ClipboardPlus, Timer, Archive } from 'lucide-react';

const roadmap = [
    {
        icon: Timer,
        title: "Timed Quizzes",
        description: "Add time limits and countdowns for competitive quizzes.",
        date: "Jan 2026",
        status: "In Progress",
        progress: 20,
    },
    {
      icon: ClipboardPlus,
      title: "Quiz Analytics Dashboard",
      description: "Track quiz performance, user engagement, and popular topics.",
      date: "Q1 2026",
      status: "Planned",
    },
  {
    icon: Archive,
    title: "Question Bank & Import",
    description: "Save questions for reuse and import from CSV/Excel.",
    date: "Q1 2026",
    status: "Planned",
  },
  {
    icon: ChartSpline,
    title: "Advanced Reporting",
    description: "Generate detailed reports on individual and group performance.",
    date: "Q2 2026",
    status: "Planned",
  },
];

const statusColors = {
  Planned: "bg-blue-600",
  "In Progress": "bg-yellow-500",
  Completed: "bg-green-600",
};

const Roadmap = () => (
  <div className="max-w-5xl mx-auto py-16 px-4">
<div className="mb-6 p-4 rounded-lg bg-black flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold text-white mb-4 ">Product Roadmap</h1>
    <p className="text-lg text-white/80 mb-10 text-clip">
      Here’s what’s coming soon to Quiz Maker. Stay tuned for new features!
    </p>
</div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {roadmap.map((item, idx) => (
        <div
          key={idx}
          className="bg-[#23272f] border border-gray-700 rounded-xl shadow-lg p-6 flex flex-col justify-between min-h-[200px]"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="text-3xl text-white">
              <item.icon size={32} />
            </div>
            <h3 className="text-xl font-bold text-white">{item.title}</h3>
          </div>
          <p className="text-gray-300 mb-6">{item.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400 font-medium">{item.date}</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${statusColors[item.status] || "bg-gray-600"}`}
            >
              {item.status}
            </span>
          </div>
          {item.status === "In Progress" && (
            <div className="mt-4">
              <div className="w-full h-2 bg-gray-700 rounded-full">
                <div
                  className="h-2 rounded-full bg-yellow-400"
                  style={{ width: `${item.progress || 0}%` }}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default Roadmap;