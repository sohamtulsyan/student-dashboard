"use client";

import React, { useState, useRef, useEffect } from "react";
import ViewSelector from "./ViewSelector";
import CommonCard from "./CommonCard";
import TasksCard from "./TasksCard";

const mockExams = [
  { id: 1, title: "Quiz 1", date: "02/05/2025" },
  { id: 2, title: "Mid-semester Exam", date: "08/05/2025" },
];

// Main App Component
function Tasks({ tasks = [], assignments = [] }) {
  const [leftWidth, setLeftWidth] = useState(50);
  const [leftViewType, setLeftViewType] = useState("assignment");
  const [rightViewType, setRightViewType] = useState("today");
  const [expandedAssignment, setExpandedAssignment] = useState(null);
  const sliderRef = useRef(null);

  const handleMouseDown = (e) => {
    e.preventDefault();
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (sliderRef.current) {
      const containerWidth = sliderRef.current.parentElement.offsetWidth;
      const newLeftWidth = (e.clientX / containerWidth) * 100;
      if (newLeftWidth >= 30 && newLeftWidth <= 70) {
        setLeftWidth(newLeftWidth);
      }
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const toggleAssignmentExpand = (id) => {
    console.log("Toggling assignment with ID:", id);
    if (expandedAssignment === id) {
      setExpandedAssignment(null);
    } else {
      setExpandedAssignment(id);
    }
  };

  const renderView = (viewType) => {
    switch (viewType) {
      case "assignment":
        const incompleteAssignments = assignments.filter(
          (task) => task.Complete === false
        );
        return (
          <>
            <h2 className="text-xl font-bold text-yellow-400 mb-4">
              ASSIGNMENTS
            </h2>
            <div>
              {incompleteAssignments.map((assignment) => (
                <CommonCard
                  key={assignment.Id}
                  item={assignment}
                  isExpanded={expandedAssignment === assignment.Id}
                  onToggle={toggleAssignmentExpand}
                  type="assignment"
                />
              ))}
            </div>

            <h2 className="text-xl font-bold text-yellow-400 mt-6 mb-4">
              EXAMS
            </h2>
            <div>
              {mockExams.map((exam) => (
                <CommonCard
                  key={exam.id}
                  item={exam}
                  isExpanded={expandedAssignment === exam.id}
                  onToggle={toggleAssignmentExpand}
                  type="exam"
                />
              ))}
            </div>
          </>
        );

      case "inbox":
        return (
          <div className="text-center p-4 text-gray-500">
            Task Inbox View (To be implemented)
          </div>
        );

      case "priority":
        return (
          <div className="text-center p-4 text-gray-500">
            Priority-wise View (To be implemented)
          </div>
        );

      case "tomorrow":
        return (
          <div className="text-center p-4 text-gray-500">
            Tomorrow's Tasks View (To be implemented)
          </div>
        );

      case "today":
        const getTodayTasks = (tasks) => {
          const today = new Date();
          const yyyy = today.getFullYear();
          const mm = String(today.getMonth() + 1).padStart(2, "0"); // months are 0-based
          const dd = String(today.getDate()).padStart(2, "0");
          const todayStr = `${yyyy}-${mm}-${dd}`; // e.g., "2025-05-02"

          return tasks.filter((task) => {
            const endDate = new Date(task.End);
            const endDateStr = endDate.toISOString().split("T")[0]; // keep only "YYYY-MM-DD"
            return endDateStr === todayStr;
          });
        };
        const todayTasks = getTodayTasks(tasks);
        return (
          <>
            <h2 className="text-2xl font-bold mb-2">TODAY</h2>
            <div className="text-sm text-gray-500 mb-4">
              {todayTasks.length} Tasks
            </div>
            <TasksCard tasks={todayTasks} view={leftViewType} />
          </>
        );

      default:
        return null;
    }
  };

  const viewOptions = [
    { label: "Assignment-wise View", value: "assignment", icon: "▸" },
    { label: "Task Inbox", value: "inbox", icon: "▸" },
    { label: "Priority-wise View", value: "priority", icon: "▸" },
    { label: "Tomorrow's Tasks", value: "tomorrow", icon: "▸" },
    { label: "Today's Tasks", value: "today", icon: "▸" },
  ];

  // Add useEffect for responsive layout
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768); // 768px is standard tablet breakpoint
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`${isMobileView ? "block" : "flex"} h-screen bg-gray-100`}>
      {/* Left Panel */}
      <div
        className="bg-white overflow-auto"
        style={{ width: isMobileView ? "100%" : `${leftWidth}%` }}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold">
              <span>YOUR </span>
              <span className="text-yellow-400">TASKS</span>
            </h1>
            <ViewSelector
              value={leftViewType}
              onChange={setLeftViewType}
              label="Assignment-wise View"
              options={viewOptions}
              position="bottom"
            />
          </div>
          {renderView(leftViewType)}
        </div>
      </div>

      {/* Slider - only show in desktop view */}
      {!isMobileView && (
        <div
          ref={sliderRef}
          className="w-6 bg-gray-200 flex items-center justify-center cursor-ew-resize"
          onMouseDown={handleMouseDown}
        >
          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white">
            ⇔
          </div>
        </div>
      )}

      {/* Right Panel - only show in desktop view */}
      {!isMobileView && (
        <div className="bg-white overflow-auto" style={{ flexGrow: 1 }}>
          <div className="p-4">
            <div className="flex justify-between items-center mb-6">
              <ViewSelector
                value={rightViewType}
                onChange={setRightViewType}
                label="Assignment-wise View"
                options={viewOptions}
                position="bottom"
              />
            </div>

            {renderView(rightViewType)}
          </div>
        </div>
      )}

      {/* Modals */}
    </div>
  );
}

export default Tasks;
