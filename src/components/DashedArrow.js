// src/components/DashedArrow.jsx

import React from "react";
import PropTypes from "prop-types";

const DashedArrow = ({ onAnimationComplete }) => {
  return (
    <div className="dashed-arrow">
      <img
        src="/images/arrow_up.svg"
        alt="Flèche pointant en haut"
        className="dashed-arrow-head"
      />
      <div
        className="dashed-arrow-line"
        onAnimationEnd={onAnimationComplete}
      ></div>
    </div>
  );
};

DashedArrow.propTypes = {
  onAnimationComplete: PropTypes.func.isRequired, // Callback after animation
};

export default DashedArrow;
