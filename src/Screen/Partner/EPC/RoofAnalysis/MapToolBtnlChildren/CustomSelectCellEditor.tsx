import React, { useState, useEffect, useRef } from "react";

const CustomSelectCellEditor = (props: any) => {
  const [value, setValue] = useState(props.value);
  const dropdownRef = useRef<any>(null);

  useEffect(() => {
    setTimeout(() => dropdownRef.current.focus());
  }, []);

  const handleChange = (event: any) => {
    setValue(event.target.value);
  };

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      // props.stopEditing();
    }
  };

  return (
    <select
      ref={dropdownRef}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={() => console.log(props)}
    >
      <option value="Walkway">Walkway</option>
      <option value="Lifeline">Lifeline</option>
      <option value="Handrail">Handrail</option>
      <option value="Module Cleaning Pipe">Module Cleaning Pipe</option>
      <option value="Water Storage Tank">Water Storage Tank</option>
      <option value="Lightning Arrestor">Lightning Arrestor</option>
    </select>
  );
};

export default CustomSelectCellEditor;
