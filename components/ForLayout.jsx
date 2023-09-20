"use client";
import React from "react";
import Nav from "./Nav";
import Brand from "./Brand";
import { useState } from "react";

export default function ForLayout({ children }) {
  const [stylingHam, setStylingHam] = useState("md:hidden");
  const [stylingCross, setStylingCross] = useState("hidden");
  const [childrenStyle, setChildrenStyle] = useState("  flex-grow  p-4");
  const [navigationStyle, setNavigationStyle] = useState(
    "text-gray-500 p-4 hidden md:block md:w-auto transition-all"
  );

  function expand() {
    setStylingHam("hidden");
    setStylingCross("md:hidden");
    setNavigationStyle("text-gray-500 p-4 w-full transition-all");
    setChildrenStyle("hidden");
  }

  function collapse() {
    setStylingHam("md:hidden");
    setStylingCross("hidden");
    setNavigationStyle(
      "text-gray-500 p-4 hidden md:block md:w-auto transition-all"
    );
    setChildrenStyle(" flex-grow  p-4");
  }
  return (
    <div className=" bg-bgGray min-h-screen">
      <div className="bg-bgGray flex justify-between m-2">
        <button type="button" className={stylingHam} onClick={() => expand()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
        <button
          type="button"
          className={stylingCross}
          onClick={() => collapse()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <Brand styling="flex gap-1 m-2 text-gray-500 md:hidden" />
      </div>

      <div className=" flex">
        <Nav navStyle={navigationStyle} />
        <div className={childrenStyle}>{children}</div>
      </div>
    </div>
  );
}
