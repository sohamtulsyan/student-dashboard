import React, { useState } from "react";
import TaskItem from "./TaskItem";
import { CirclePlus } from "lucide-react";
import Button from "./Button";
import TaskModal from "./TaskModal";
import { createTask, updateTask } from "@/api/backend"; // Make sure path is correct

function TasksCard({ tasks: initialTasks = [], viewType, assignmentId }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask]= useState(false);

  const handleAddTask = () => {
    const newTask = {
      Title: "",
      Description: "",
      Priority: 0,
      Complete: false,
      End: "",
    };
    setSelectedTask(newTask);
    setShowTaskModal(true);
    setNewTask(true);
  };

  const handleSave = async (taskData) => {
    try {
      if (!taskData.Id || taskData.Id === 0) {
        const newTask = await createTask(taskData);
        setTasks((prev) =>
          [...prev, newTask].sort((a, b) => new Date(a.End) - new Date(b.End))
        );
      } else {
        const updated = await updateTask(taskData.Id, taskData);
        setTasks((prev) =>
          prev.map((t) => (t.Id === updated.Id ? updated : t))
        );
      }
    } catch (error) {
      console.error("Error saving task:", error);
    }
    setShowTaskModal(false);
    setSelectedTask(null);
    setNewTask(false);
  };

  const className =
    viewType === "assignment"
      ? ""
      : "bg-white rounded-lg shadow overflow-hidden";

  return (
    <>
      <div className={className}>
        {tasks.length>0?tasks.map((task) => (
          <TaskItem
            key={task.Id}
            view={viewType}
            task={task}
          />
        )):"No tasks available"}
        <Button
          text="Add Task"
          onClick={handleAddTask}
          icon={CirclePlus}
          background="transparent"
        />
      </div>

      {showTaskModal && selectedTask && (
        <TaskModal
          task={selectedTask}
          newTask = {newTask}
          onClose={() => setShowTaskModal(false)}
          onSave={handleSave}
          assignmentId={assignmentId}
        />
      )}
    </>
  );
}

export default TasksCard;
