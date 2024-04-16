import React from "react";
import ReactMarkdown from "react-markdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faDove } from "@fortawesome/free-solid-svg-icons";

const message = ({ role, content }) => {
  return (
    <div className="flex justify-items-center items-center">
      {role === "user" ? (
        <>
          <FontAwesomeIcon icon={faUser} className="p-5 fa-solid" size="2x" />

          <div className="bg-gray-700 flex w-full rounded-2xl">
            <div className="prose prose-invert font-bold px-2">
              <ReactMarkdown className="font-medium">{content}</ReactMarkdown>
            </div>
          </div>
        </>
      ) : (
        <>
          <FontAwesomeIcon icon={faDove} className="fa-solid p-5" size="2x" />
          <div className="prose prose-invert font-bold px-2">
            <ReactMarkdown className="font-medium">{content}</ReactMarkdown>
          </div>
        </>
      )}
    </div>
  );
};

export default message;
