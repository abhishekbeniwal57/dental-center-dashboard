import React from "react";

const FormInput = ({
  label,
  id,
  type = "text",
  error,
  className = "",
  ...props
}) => {
  return (
    <div className={`mb-6 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-base font-medium text-gray-700 mb-2"
        >
          {label}
        </label>
      )}

      <input
        id={id}
        type={type}
        className={`
          form-input block w-full px-4 py-3 text-base
          border-gray-300 rounded-lg shadow-sm
          focus:ring-blue-500 focus:border-blue-500 focus:ring-2
          transition duration-150 ease-in-out
          ${error ? "border-red-300" : "border-gray-300"}
        `}
        {...props}
      />

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FormInput;
