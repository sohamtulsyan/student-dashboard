import React, { useState } from "react";
import TaskModal from "./TaskModal";
import { format, parseISO, isTomorrow, isToday } from "date-fns";

const TaskItem = ({
  task,
  view = "assignment",
  onStatusChange,
  parentAssignmentName = "",
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isCompleted, setIsCompleted] = useState(task.Complete);

  const handleTaskClick = (e) => {
    if (!e.target.closest(".checkbox-container")) {
      setShowModal(true);
    }
  };

  const due = () => {
    const date = parseISO(task.End);

    const timeStr = format(date, "h:mmaaa").toLowerCase(); // '7:30pm'

    if (isTomorrow(date)) {
      return `By Tomorrow, ${timeStr}`;
    } else if (isToday(date)) {
      return `By Today, ${timeStr}`;
    } else {
      const dayMonth = format(date, "do MMMM"); // "12th May"
      return `By ${dayMonth}, ${timeStr}`;
    }
  };

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    const newStatus = !isCompleted ? "completed" : "pending";
    setIsCompleted(!isCompleted);
    onStatusChange?.(task.id, newStatus);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const rightSideText =
    view === "assignment"
      ? `${due() || "No due date"}`
      : parentAssignmentName;

  const getPriorityStyles = () => {
    switch (task.Priority) {
      case 1:
        return "border-l-4 border-red-500";
      case 2:
        return "border-l-4 border-yellow-500";
      case 3:
        return "border-l-4 border-blue-500";
      default:
        return "";
    }
  };

  const getStatusStyles = () => {
    if (isCompleted) {
      return "bg-amber-700 border-amber-800";
    } else if (task.status === "in-progress") {
      return "bg-white border-2 border-amber-700";
    } else {
      return "bg-white border-2 border-gray-300";
    }
  };

  return (
    <>
      <div
        className={`flex items-center px-4 py-3 border-b border-gray-200 cursor-pointer ${getPriorityStyles()}`}
        onClick={handleTaskClick}
      >
        <div
          className="checkbox-container mr-4 cursor-pointer"
          onClick={handleCheckboxClick}
        >
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors duration-200 ${getStatusStyles()}`}
          >
            {isCompleted && <div className="w-2 h-2 bg-white rounded-full" />}
          </div>
        </div>

        <div className="flex-grow">
          <div
            className={`text-sm ${
              isCompleted ? "line-through text-gray-500" : ""
            }`}
          >
            {task.Title}
          </div>
          {task.Description && (
            <div className="text-xs text-gray-500 mt-1 truncate max-w-xs">
              {task.Description}
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500 ml-2">{rightSideText}</div>
      </div>

      {showModal && (
        <TaskModal
          task={task}
          newTask={false}
          onClose={handleCloseModal}
          onStatusChange={(status) => {
            setIsCompleted(status === "completed");
            onStatusChange?.(task.Id, status);
            handleCloseModal();
          }}
        />
      )}
    </>
  );
};

export default TaskItem;
