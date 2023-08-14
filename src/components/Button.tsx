import React from "react";

export default function Button(props) {
  return (
    <button {...props}
      className={`font-bold p-2 bg-sky-400 rounded ${props.className}`}
    >
      {props.children}
    </button>
  );
}
