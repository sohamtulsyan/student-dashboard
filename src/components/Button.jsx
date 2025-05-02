import React from "react";

const Button = ({
  text,
  icon: Icon,
  onClick,
  background = "bg-yellow-300",
}) => {
  return (
    <button
      onClick={onClick}
      className={`${background} text-black flex items-center px-4 py-1 rounded-md hover:bg-yellow-400 transition`}
    >
      {Icon && <Icon className="mr-2 w-4 h-4" />}
      {text}
    </button>
  );
};

export default Button;
