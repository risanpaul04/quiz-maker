import React from "react";

const InputField = ({
  id,
  label,
  type,
  name,
  value,
  onChange,
  placeHolder = "",
  required = false,
  className = "",
  ...rest
}) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={id} className="text-lg font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeHolder}
        className="
                input w-full p-3 border border-gray-300 rounded-lg text-base
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                shadow-sm transition duration-150 ease-in-out"
        {...rest}
      />
    </div>
  );
};

export default InputField;
