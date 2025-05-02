import React, { useState } from "react";
import AttachmentItem from "./AttachmentItem";
import { Info, Send, ClipboardPaste, BookCheck } from "lucide-react";
import Button from "./Button";
import TaskModal from "./TaskModal";
import TasksCard from "./TasksCard";
import SubmitModal from "./SubmitModal";
import DetailsModal from "./DetailsModal";
import { formatDistanceToNow, isBefore } from "date-fns";

const CommonCard = ({ item, isExpanded, onToggle, type }) => {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const isAssignment = type === "assignment";

  const handleDetails = (e) => {
    e.stopPropagation();
    setShowDetailsModal(true);
  };

  const handleSubmit = (e) => {
    e.stopPropagation();
    setShowSubmitModal(true);
  };

  const handleCloseModal = () => {
    setShowTaskModal(false);
    setSelectedTask(null);
  };

  const getDueString = () => {
    const dueDate = new Date(item.End || item["End Date"]);
    const now = new Date();

    if (isBefore(dueDate, now)) {
      return "Past Due";
    }

    return `Due in ${formatDistanceToNow(dueDate, { addSuffix: false })}`;
  };

  return (
    <div className="bg-white rounded-lg shadow mb-4 overflow-hidden">
      {/* Header */}
      <div
        className={`flex items-center px-4 py-3 ${
          isAssignment ? "cursor-pointer" : ""
        }`}
        onClick={() => isAssignment && onToggle?.(item.Id)}
      >
        <div className="w-6 h-6 mr-3 flex items-center justify-center">
          {isAssignment ? (
            <ClipboardPaste className="w-5 h-5" />
          ) : (
            <BookCheck className="w-5 h-5" />
          )}
        </div>
        <div className="flex-grow">
          <div className="font-medium text-lg">{item.Title}</div>
        </div>
        <div className="text-sm text-gray-500">
          {isAssignment ? getDueString() : item.date}
        </div>
      </div>

      {/* Expanded */}
      {isExpanded && (
        <div>
          <div className="bg-yellow-50 p-4">
            <p className="text-sm">{item.details || item.Description}</p>
            {item.attachments?.length > 0 && (
              <div className="mt-4">
                <div className="font-medium mb-2">Attachments:</div>
                <div className="flex flex-wrap gap-4">
                  {item.attachments.map((attachment, idx) => (
                    <AttachmentItem key={idx} attachment={attachment} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tasks */}
          <div>
            <TasksCard viewType="assignment" tasks={item.Tasks} assignmentId={item.Id}/>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between p-4 border-t border-gray-200">
            <div className="flex items-center justify-between gap-4">
              <Button text="Details" icon={Info} onClick={handleDetails} />
              <Button text="Submit" icon={Send} onClick={handleSubmit} />
            </div>
          </div>

          <SubmitModal
            isOpen={showSubmitModal}
            onClose={() => setShowSubmitModal(false)}
            Id={item.Id}
          />
          <DetailsModal
            isOpen={showDetailsModal}
            onClose={() => setShowDetailsModal(false)}
            assignment={item}
            due={getDueString()}
          />
        </div>
      )}

      {/* Task Modal */}
      {showTaskModal && selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={handleCloseModal}
          onStatusChange={(status) => {
            console.log(`Task status changed to ${status}`);
            handleCloseModal();
          }}
        />
      )}
    </div>
  );
};

export default CommonCard;
