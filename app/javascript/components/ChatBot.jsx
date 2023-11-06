// src/components/Chatbot.js

import React, { useState } from "react";
import axios from "axios";

const chatContainerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
};

const chatMessageStyle = {
  padding: "8px",
  margin: "8px",
  borderRadius: "4px",
};

const userMessageStyle = {
  backgroundColor: "#007bff",
  color: "#fff",
  alignSelf: "flex-end",
};

const botMessageStyle = {
  backgroundColor: "#eee",
  color: "#000",
  alignSelf: "flex-start",
};

const Chatbot = () => {
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState([]);
  const [error, setError] = useState("");

  const handleQueryChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleAsk = () => {
    if (question.trim() === "") {
      setError("No query provided");
    } else {
      setError("");
      setChat([...chat, { text: question, user: true }]);
      axios
        .post("/chatbot", { question })
        .then((response) => {
          setChat([...chat, { text: response.data.answer, user: false }]);
        })
        .catch((error) => {
          setError("Error fetching data from the server");
        });
      setQuestion("");
    }
  };

  return (
    <div className="container">
      <h1>Chatbot</h1>
      <div style={chatContainerStyle}>
        {chat.map((message, index) => (
          <div
            key={index}
            style={
              message.user
                ? { ...chatMessageStyle, ...userMessageStyle }
                : { ...chatMessageStyle, ...botMessageStyle }
            }
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          placeholder="Ask a question"
          value={question}
          onChange={handleQueryChange}
        />
      </div>
      <button className="btn btn-primary" onClick={handleAsk}>
        Ask
      </button>
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default Chatbot;
