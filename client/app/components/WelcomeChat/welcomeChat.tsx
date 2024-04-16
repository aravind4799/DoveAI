import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDove } from "@fortawesome/free-solid-svg-icons";

const welcomeChat = () => {
  return (
    <div className="grid sm:grid-rows-2">
      <div className="grid sm:grid-cols-3 justify-items-center items-center">
        <div>
          <span className="loading loading-bars loading-lg"></span>
          <span className="loading loading-bars loading-lg"></span>
          <span className="loading loading-bars loading-lg"></span>
          <span className="loading loading-bars loading-lg"></span>
          <span className="loading loading-bars loading-lg"></span>
          <span className="loading loading-bars loading-lg"></span>
        </div>

        <div className="p-5 dance">
          <FontAwesomeIcon icon={faDove} className="fa-solid" size="10x" />
        </div>

        <div>
          <span className="loading loading-bars loading-lg"></span>
          <span className="loading loading-bars loading-lg"></span>
          <span className="loading loading-bars loading-lg"></span>
          <span className="loading loading-bars loading-lg"></span>
          <span className="loading loading-bars loading-lg"></span>
          <span className="loading loading-bars loading-lg"></span>
        </div>
      </div>
      <div className="text-center m-10">
        <span className="p-4 text-2xl italic font-medium ">
          Ask Me Anything !
        </span>
      </div>
    </div>
  );
};

export default welcomeChat;
