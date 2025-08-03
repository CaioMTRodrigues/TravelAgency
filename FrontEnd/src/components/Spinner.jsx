import React from "react";
import "./Spinner.css"; // Estilo separado

const Spinner = () => {
  return (
    <div className="spinner-overlay">
      <div className="spinner" />
    </div>
  );
};

export default Spinner;
