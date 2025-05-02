import React from "react";
import CommonCard from "./CommonCard";

const AssignmentWiseView = ({ assignments, exams, expandedId, onToggle }) => {
  return (
    <div>
      {assignments.map((assignment) => (
        <CommonCard
          key={assignment.id}
          type="assignment"
          item={assignment}
          isExpanded={expandedId === assignment.id}
          onToggle={onToggle}
        />
      ))}

      {exams.map((exam) => (
        <CommonCard
          key={exam.id}
          type="exam"
          item={exam}
          isExpanded={false} // exams don't expand
        />
      ))}
    </div>
  );
};

export default AssignmentWiseView;
