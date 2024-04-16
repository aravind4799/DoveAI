import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faComments } from "@fortawesome/free-solid-svg-icons";

const sideBar = ({ sendDataToParent, sendNewChat, chats }) => {
  return (
    <div className="flex flex-col justify-items-center h-full items-center ">
      <button
        onClick={() => sendNewChat("yes")}
        className=" hover:bg-gray-700 rounded-md p-3 mt-5 w-60 hover:shakeCrazy"
      >
        <div className="flex px-5">
          <FontAwesomeIcon
            icon={faCirclePlus}
            className="fas fa-check mx-3"
            style={{ color: "white" }}
            size="2x"
          />
          <span className="font-bold text-white text-xl ">New Chat</span>
        </div>
      </button>

      {chats.map((item) => (
        <div className="flex flex-col justify-items-center items-center hover:shakeCrazy">
          <button
            key={item.id}
            onClick={() => sendDataToParent(item.id)}
            className="bg-gray-600 rounded-md p-3 mt-5 w-60 hover:bg-gray-700"
          >
            <div className="flex px-3">
              <FontAwesomeIcon
                icon={faComments}
                className="fa-check px-2"
                style={{ color: "white" }}
              />
              <span className="font-bold text-white truncate">
                {item.title}
              </span>
            </div>
          </button>
        </div>
      ))}
    </div>
  );
};

export default sideBar;
