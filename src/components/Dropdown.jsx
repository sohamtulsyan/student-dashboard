const Dropdown = ({ isOpen, onSelect, options }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute bg-white shadow-md rounded-md border border-gray-200 z-10 w-48 top-full left-0 mt-1">
      {options.map((option, index) => (
        <div
          key={index}
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
          onClick={() => onSelect(option.value)}
        >
          {option.icon && <span className="mr-2">{option.icon}</span>}
          {option.label}
        </div>
      ))}
    </div>
  );
};

export default Dropdown;
