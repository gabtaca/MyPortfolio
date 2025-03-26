import React from "react";

const corners = [
  "folded-top-right",
  "folded-top-left",
  "folded-bottom-right",
  "folded-bottom-left",
];

export const getRandomFoldClass = () => {
  const shouldFold = Math.random() < 0.9; // 50% chance to add a fold
  if (!shouldFold) return ""; // No fold class
  return corners[Math.floor(Math.random() * corners.length)];
};

const getRandomPostItColor = () => {
  const colors = ["#FFA9D0", "#FFFFB2", "#C5FEFF", "#C8F06E", "#FFC551"];
  return colors[Math.floor(Math.random() * colors.length)];
};

const PostItContainer = ({ ideas }) => (
  <div className="post-it-container">
    {ideas.map((idea) => (
      <div
        key={idea.id}
        className={`post-it ${getRandomFoldClass()}`}
        style={{ backgroundColor: getRandomPostItColor() }}
      >
        <div className="post-it-content">
          <h3>{idea.title}</h3>
          <p>{idea.description}</p>
        </div>
      </div>
    ))}
  </div>
);

export default PostItContainer;
