import React, { useState, useEffect, useRef } from "react";
import { createTask, updateTask } from "@/api/backend"; // Adjust path if needed
import Button from "./Button";




const TaskModal = ({ task, onClose, onSave, newTask, assignmentId }) => {


const [loading, setLoading] = useState(false);

  // Initialize state with the task data format from your API
  const [taskData, setTaskData] = useState({
    Id: task.Id,
    Title: task.Title || "",
    Description: task.Description || "", // Keep this even if not in original JSON
    Priority: task.Priority || 4,
    Complete: task.Complete || false,
    End: task.End || "",
    Assignments: task.Assignments || { Id: 0, Title: "" },
  });

  const modalRef = useRef(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData({
      ...taskData,
      [name]: value,
    });
  };

  const handleToggleComplete = () => {
    setTaskData({
      ...taskData,
      Complete: !taskData.Complete,
    });
  };

  const formatDateTimeForInput = (dateTimeString) => {
    if (!dateTimeString) return "";
    // Convert the ISO string to a local datetime-local format
    try {
      const date = new Date(dateTimeString);
      return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM
    } catch (error) {
      return "";
    }
  };

const handleSubmit = async (e) => {
  if (e) e.preventDefault();
  setLoading(true); // Start loading

  try {
    let savedTask;
    if (newTask) {
      savedTask = await createTask(taskData, assignmentId);
      // savedTask = await createTask({});
    } else {
      savedTask = await updateTask(taskData.Id, taskData);
    }

    if (onSave) onSave(savedTask);
    onClose();
  } catch (error) {
    console.error("Error saving task:", error);
    alert("Failed to save task. Please try again.");
  } finally {
    setLoading(false); // Stop loading
  }
};


  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden"
      >
        <div className="bg-amber-50 px-6 py-4 border-b border-amber-100">
          <h3 className="text-lg font-medium text-amber-900">Task Details</h3>
        </div>

        <div className="px-6 py-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="Title"
              value={taskData.Title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="Description"
              value={taskData.Description}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date & Time
            </label>
            <input
              type="datetime-local"
              name="End"
              value={formatDateTimeForInput(taskData.End)}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              name="Priority"
              value={taskData.Priority}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value={1}>High</option>
              <option value={2}>Medium</option>
              <option value={3}>Low</option>
              <option value={4}>None</option>
            </select>
          </div>

          {task.Assignments && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assignment
              </label>
              <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                {task.Assignments.Title}
              </div>
            </div>
          )}

          <div className="mb-6">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={taskData.Complete}
                onChange={handleToggleComplete}
                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                Mark as complete
              </span>
            </label>
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-gray-200">
            <Button text="Cancel" onClick={onClose} background="bg-gray-200" />
            <Button
              text={loading ? "Saving..." : "Save"}
              onClick={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
