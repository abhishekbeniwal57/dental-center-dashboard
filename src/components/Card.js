import React from "react";

const Card = ({ children, title, className = "", ...props }) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-modern border border-gray-100 overflow-hidden transition-shadow duration-300 hover:shadow-xl ${className}`}
      {...props}
    >
      {title && (
        <div className="border-b border-gray-100 px-8 py-5">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        </div>
      )}
      <div className="p-8">{children}</div>
    </div>
  );
};

export default Card;
