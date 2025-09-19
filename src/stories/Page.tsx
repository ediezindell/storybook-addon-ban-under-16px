import React from "react";
export const Page: React.FC = () => {
  return (
    <>
      <input
        type="text"
        placeholder="Enter text here"
        style={{ fontSize: "15.9px" }}
      />
      <input
        type="text"
        placeholder="Enter text here"
        style={{ fontSize: "16px" }}
      />
      <input
        type="text"
        placeholder="Enter text here"
        style={{ fontSize: "16.1px" }}
      />
      <textarea placeholder="Enter text here" style={{ fontSize: "15.9px" }} />
      <textarea placeholder="Enter text here" style={{ fontSize: "16px" }} />
      <textarea placeholder="Enter text here" style={{ fontSize: "16.1px" }} />
    </>
  );
};
