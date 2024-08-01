import React from "react";

function ClickButton({ incrementCount }) {
  return (
    <div className="flex justify-center my-4">
      <button
        className="bg-green-500 text-white w-24 h-24 rounded-full border-4 border-darkGreen flex items-center justify-center transition-transform transform animate-spin"
        onClick={incrementCount}
        onMouseEnter={(e) => e.currentTarget.classList.add("animate-scaleUp")}
        onMouseLeave={(e) =>
          e.currentTarget.classList.remove("animate-scaleUp")
        }
      >
        Click
      </button>
    </div>
  );
}

export default ClickButton;
