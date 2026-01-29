import React, { useState, useRef, useEffect } from "react";

const DebouncedInput = ({
  value,
  onChange,
  className,
  name,
  placeholder,
}: {
  value: string;
  onChange: (value: string, param: string) => void;
  className: string;
  name: string;
  placeholder: string;
}) => {
  const [val, setVal] = useState<string>(value);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (val === value) return;
      console.log(val, value);
      onChange(val, name);
    }, 500);
  }, [val]);

  useEffect(() => {
    setVal(value);
  }, [value]);

  return (
    <input
      data-testid={"filter-" + name}
      className={className}
      value={val}
      name={name}
      placeholder={placeholder}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        setVal(e.target.value);
      }}
    />
  );
};

export default DebouncedInput;
