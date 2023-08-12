import React from 'react';

export default function Page(props) {
  return (
    <div 
      className={`
        p-4 
        rounded 
        border border-amber-400 
        min-h-[calc(100vh-56px)]
        text-amber-600
        ${props?.className}
      `}
      {...props}
    >
      {props.children}
    </div>
  );
}