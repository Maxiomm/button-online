import React from "react";

function ClickButton({ incrementCount }) {
  return (
    <div className="flex justify-center items-center h-full">
      <button
        className="bg-green-500 text-white w-24 h-24 rounded-full border-4 border-darkGreen flex items-center justify-center transition-transform transform animate-spin"
        onClick={incrementCount}
        onMouseEnter={(e) => {
          e.currentTarget.classList.add("animate-scaleUp");
          e.currentTarget.classList.remove("animate-spin");
        }}
        onMouseLeave={(e) => {
          e.currentTarget.classList.remove("animate-scaleUp");
          e.currentTarget.classList.add("animate-spin");
        }}
      >
        Click
      </button>
    </div>
  );
}

export default ClickButton;
