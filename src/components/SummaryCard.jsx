import React from "react";

const SummaryCard = ({ title, value, extraClass = "" }) => {
  return (
    <div className={`summary-card ${extraClass}`}>
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
};

export default SummaryCard;