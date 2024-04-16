"use client";
import React, { useState } from "react";

export default function userInput({ getQuery }) {
  const [query, setQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAlert, SetShowAlert] = useState({
    true: 1,
    false: 1,
  });

  const handleSubmit = async (e) => {
    if (query.length == 0) {
      alert("User query cannot be empty");
      return;
    }

    setIsProcessing(true);
    e.preventDefault();
    console.log(query);
    getQuery(query);
    setQuery("");
    setIsProcessing(false);
  };

  return (
    <>
      <textarea
        placeholder="Type your question and hit ENTER ...."
        className="textarea text-xl textarea-bordered textarea-lg flex-grow w-full disabled:bg-gray-900 resize-none focus:outline focus:bg-gray-800 focus:outline-white"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e); // Calls the submit handler when Enter is pressed
          }
        }}
        disabled={isProcessing}
      ></textarea>
    </>
  );
}
