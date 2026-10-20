import React from "react";

const PageHeader = ({ title, subtitle, buttonText, onButtonClick }) => {
  return (
    <div className="page-header">
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>

      {buttonText && (
        <button className="primary-btn" onClick={onButtonClick}>
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default PageHeader;