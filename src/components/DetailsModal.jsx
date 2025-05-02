import React, { useState } from "react";
import { X, Paperclip, ChevronDown, User, Plus } from "lucide-react";
import AttachmentItem from "./AttachmentItem";
import TasksCard from "./TasksCard";
import Button from "./Button";
import SubmitModal from "./SubmitModal";

export default function DetailsModal({ assignment, isOpen, onClose, due }) {
  // State declarations should all be at the top before any conditional returns
  const [showReplies, setShowReplies] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false); // Added state for dragging if needed

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  // Format date range
  const formatDateRange = (startDate, endDate) => {
    return `${startDate} - ${endDate}`;
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl overflow-hidden">
        {/* Header */}
        <div className="p-4 flex justify-between items-center border-b">
          <div className="flex items-center gap-2">
            <div className="text-gray-400">
              <Paperclip size={24} />
            </div>
            <h2 className="text-2xl font-semibold">{assignment?.Title}</h2>
            <span className="text-gray-500 ml-2">
              - {due}
            </span>
          </div>
          <div className="text-gray-500">
            {assignment?.startDate && assignment?.endDate
              ? formatDateRange(assignment.startDate, assignment.endDate)
              : assignment?.date}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 bg-yellow-50 border-b">
          <div className="prose max-w-none">
            <p className="text-sm">{assignment?.details}</p>
          </div>

          {/* Attachments */}
          {assignment?.attachments && assignment.attachments.length > 0 && (
            <div className="mt-4">
              <div className="font-medium mb-2">Attachments:</div>
              <div className="flex flex-wrap gap-4">
                {assignment.attachments.map((attachment, index) => (
                  <AttachmentItem key={index} attachment={attachment} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tasks Section */}
        {assignment?.tasks && assignment.tasks.length > 0 && (
          <div className="border-b">
            <TasksCard viewType="assignment" tasks={assignment.tasks} />
          </div>
        )}

        {/* Your Work Section */}
        <div className="px-6 py-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-xl">
              YOUR <span className="text-amber-500">WORK</span>
            </h3>
            <div className="text-gray-500">
              {assignment?.status || "UNGRADED"}
            </div>
          </div>

          {/* Submission files */}
          <div className="flex flex-wrap gap-3 mb-4">
            {assignment?.submissions?.map((submission, index) => (
              <AttachmentItem key={index} attachment={submission} />
            ))}
          </div>

          {/* Add Content Button */}
          <Button
            text="ADD CONTENT"
            icon={Plus}
            onClick={(e) => {
              e.stopPropagation();
              setShowSubmitModal(true);
            }}
          />
        </div>

        {/* Discussions Section */}
        <div className="px-6 py-4 border-t">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-xl">
              DISCUSSIONS & <span className="text-amber-500">COMMENTS</span>
            </h3>
            <Button
              text="ADD COMMENT"
              icon={Plus}
              onClick={(e) => {
                e.stopPropagation();
                console.log("Add comment clicked");
              }}
            />
          </div>

          {/* Comments */}
          {assignment?.comments && assignment.comments.length > 0 && (
            <div className="bg-yellow-50 rounded-lg p-4 mb-4">
              {assignment.comments.map((comment, index) => (
                <div key={index} className="mb-2 last:mb-0">
                  <div className="flex items-start gap-2">
                    <div className="text-gray-400 pt-1">
                      <User size={16} />
                    </div>
                    <div>
                      <p className="font-medium">{comment.text}</p>
                      <div className="flex justify-between">
                        <button
                          className="text-gray-600 flex items-center text-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowReplies(!showReplies);
                          }}
                        >
                          <ChevronDown
                            size={16}
                            className={`transform ${
                              showReplies ? "rotate-180" : ""
                            }`}
                          />
                          <span>View Replies</span>
                        </button>
                        <span className="text-gray-500 text-sm">
                          {comment.author || "Anonymous"}
                        </span>
                      </div>

                      {/* Replies (conditionally shown) */}
                      {showReplies && comment.replies && (
                        <div className="pl-6 mt-2 border-l-2 border-gray-200">
                          {comment.replies.map((reply, replyIndex) => (
                            <div key={replyIndex} className="mb-2">
                              <p>{reply.text}</p>
                              <div className="text-right">
                                <span className="text-gray-500 text-sm">
                                  {reply.author || "Anonymous"}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SubmitModal - Pass the assignment prop */}
        <SubmitModal
          isOpen={showSubmitModal}
          onClose={() => setShowSubmitModal(false)}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          assignment={assignment}
        />

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 flex justify-end">
          <Button text="SUBMIT" onClick={onClose} />
        </div>

        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
}
