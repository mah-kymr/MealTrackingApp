import React from "react";

const InputField = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
}) => {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-bold mb-2">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && (
        <p className="mt-2 text-sm text-red-600 bg-red-100 px-4 py-2 rounded-md">
          {error}
        </p>
      )}
    </div>
  );
};

export default InputField;
