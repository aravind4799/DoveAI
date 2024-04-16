"use client";
import React, { useState, useEffect } from "react";

// import all required components
import UserInput from "./components/UserInput/userInput";
import SideBar from "./components/SideBar/sideBar";
import Message from "./components/Message/message";
import WelcomeChat from "./components/WelcomeChat/welcomeChat";

// for using fontawesome icons
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

export default function Home() {
  //STATES

  const [userQuery, SetUserQuery] = useState("");
  // to get all the chatMessages from the database to display in message component.
  const [chatMessages, SetChatMessages] = useState([]);
  // to get all the titles from the document to populate the sidebar with history of chats.
  const [title, SetTitle] = useState([]);
  // initial id is the welcome document that is available in the mongodb database.
  // which just has initial welcome message later when user navigates to newChat this id changes accordingly
  const [chatId, SetChatId] = useState("6618b8b355c4f534fe1ff335");

  const [isAlert, SetAlert] = useState(false);

  //USE EFFECT HOOKS

  // TO FETCH THE SIDE BAR DATA WHEN THE COMPONENT LOADS AND RESET THE CHATID
  // TO THE WELCOME DOCUMENT
  useEffect(() => {
    fetchSideBarData();
    resetChatId();
  }, []);

  // WHEN THE CHATID CHANGES, FETCH ALL PREVIOUS CONVERSATIONS
  // AND ADD A NEW CHAT ENTRY IN THE SIDEBAR AT THE TOP FOR THIS CURRENT CHAT WITH THE CONTENTS AS THE :USER FIRST QUESTION!
  useEffect(() => {
    fetchData();
    fetchSideBarData();
  }, [chatId]);

  // API CALLS

  // TO GET ALL PREVIOUS CHAT WITH A CORRESPONDING ID
  const fetchData = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8080/api/chatsById", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: chatId }),
      });
      const data = await res.json();
      console.log("data from chatID: ", data);
      SetChatMessages(data);
    } catch (e) {
      console.error("error fetching data", e);
    }
  };

  // TO GET ALL THE TITLES , i.e TO DISPLAY HISTORY OF CHATS
  const fetchSideBarData = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8080/api/getAllChats");
      const data = await res.json();
      console.log(data);
      SetTitle(data);
    } catch (e) {
      console.error("error fetching data", e);
    }
  };

  // API CALL TO RESET THE CHATID TO THE INITIAL WELCOME DOCUMENT,
  const resetChatId = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8080/api/resetId");
      const data = await res.json();
      console.log(data);
    } catch (e) {
      console.error("error resetting ID", e);
    }
  };

  // API CALL TO POST THE USER TYPED QUERY TO THE BACKEND FLASK SERVER
  // THE RESPONSE GOT IS A CHATID
  // AND AFTER POSTING THE DATA WE ARE FETCHING ALL THE PREVIOUS CHATS FOR THIS CHATID
  const postData = async (res) => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8080/api/openAPIresponse",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: res }),
        }
      );

      const data = await response.json();
      console.log("DATA FROM THE SERVER:" + data);
      SetChatId(data);
      fetchData();
    } catch (e) {
      console.log("GOT AN ERROR WHILE POSTING THE DATA:", e);
    }
  };

  //UPDATE THE CHATID WHICH ALLOWS USER TO ACCESS HIS PREVIOUS CHAT HISTORY
  const updateID = async (data) => {
    try {
      const res = await fetch("http://127.0.0.1:8080/api/updateChatID", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: data }),
      });
    } catch (e) {
      console.error("error fetching data", e);
    }
  };

  //LET THE SERVER ENDPOINT KNOW THAT THIS IS A BRAND NEW CHAT, MEANING IT HAS TO CREATE
  // A NEW DOCUMENT IN THE DATABASE.
  const receiveNewChat = () => {
    const newChat = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8080/api/newChat");
        // const data = await res.json();
        // console.log(data);
      } catch (e) {
        console.error("error fetching data", e);
      }
    };

    newChat();
    // RESET THE CHATMESSAGES TO AN EMPTY ARRAY SO THAT THE WELCOME CHAT COMPONENT GETS LOADED AND USER GETS A NEW CHAT WINDOW.
    SetChatMessages([]);
  };

  // HANDLING CHANGES FROM CHILD COMPONENTS AND REFLECTING IN PARENT COMPONENT
  const handleQueryChange = async (res) => {
    SetUserQuery(res);
    // if (res.length == 0) {
    //   // alert("QUERY CANNOT BE EMPTY");
    //   console.log("i was hit");
    //   SetAlert(true);
    // } else {
    //   SetAlert(false);
    postData(res);
    // }
  };

  const receiveDataFromChild = (data) => {
    console.log("data from the client", data);
    SetChatId(data);
    // also i need to update the id in the server, so the upcoming req will be added to correct chat
    updateID(data);
  };

  return (
    <>
      <title>DoveAI</title>
      {/* for smaller and above screens I need 2 columns */}
      {/* for smaller screen everything will be displayed as a block one after the another */}

      <div className="grid sm:grid-cols-12">
        <div data-theme="dark" className="h-screen sm:col-span-2 overflow-auto">
          <div>
            <SideBar
              sendDataToParent={receiveDataFromChild}
              sendNewChat={receiveNewChat}
              chats={title}
            />
          </div>
        </div>

        <div className="h-screen sm:col-span-10">
          <div data-theme="dim" className="sm:h-5/6 h-3/4 overflow-auto">
            {/* RENDERING ALL THE PREVIOUS CHATS IF THE LENGTH OF IT IS > 0  */}
            <div>
              {chatMessages.length > 0 ? (
                <>
                  {chatMessages.map((msg) => (
                    <Message
                      key={msg._id}
                      role={msg.role}
                      content={msg.content}
                    />
                  ))}
                </>
              ) : (
                // ELSE RENDERING THE WELCOMECHAT COMPONENT FOR A NEW CONVERSATION
                <>
                  <div>
                    <WelcomeChat />
                  </div>
                </>
              )}
            </div>
          </div>
          {/* {`console.log(${isAlert})`} */}

          <div className="bg-gray-700 sm:h-1/6 h-1/4 p-5">
            <UserInput getQuery={handleQueryChange} />
          </div>
        </div>
      </div>
    </>
  );
}
