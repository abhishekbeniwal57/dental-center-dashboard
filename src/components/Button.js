import React from "react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) => {
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const baseStyles =
    "inline-flex items-center justify-center border rounded-lg shadow-md font-medium transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary:
      "border-transparent text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 transform hover:-translate-y-0.5",
    secondary:
      "border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500 transform hover:-translate-y-0.5",
    danger:
      "border-transparent text-white bg-red-600 hover:bg-red-700 focus:ring-red-500 transform hover:-translate-y-0.5",
    success:
      "border-transparent text-white bg-green-600 hover:bg-green-700 focus:ring-green-500 transform hover:-translate-y-0.5",
  };

  const styles = `${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`;

  return (
    <button className={styles} {...props}>
      {children}
    </button>
  );
};

export default Button;
