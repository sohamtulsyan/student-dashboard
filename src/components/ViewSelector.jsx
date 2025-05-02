"use client";

import { useState } from "react";
import Dropdown from "./Dropdown";

const ViewSelector = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentOption =
    options.find((option) => option.value === value) || options[0];

  return (
    <div className="relative">
      <button
        className="bg-yellow-300 text-black px-3 py-1 rounded-md flex items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        {currentOption.label} {isOpen ? "▲" : "▼"}
      </button>
      <Dropdown
        isOpen={isOpen}
        options={options}
        onSelect={(val) => {
          onChange(val);
          setIsOpen(false);
        }}
      />
    </div>
  );
};

export default ViewSelector;
