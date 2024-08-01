import React from "react";

function ClickButton({ incrementCount }) {
  return (
    <div className="flex justify-center my-4">
      <button className="btn btn-primary" onClick={incrementCount}>
        Click Me!
      </button>
    </div>
  );
}

export default ClickButton;
