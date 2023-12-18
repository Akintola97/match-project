import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  height: "80vh",
  overflowY: "hidden",
  bgcolor: "white",
  borderRadius: "16px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  display: "flex",
  flexDirection: "column",
};

const ChatModal = ({ open, handleClose, selectedUser, userName, chatMessages, onSendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      onSendMessage(message, selectedUser);
      setMessage("");
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          style={{
            borderBottom: "1px solid #ccc",
            padding: "16px",
            textAlign: "center",
          }}
        >
           <h1 className="capitalize">{userName}</h1>
      
        </Typography>
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Display the chat messages here */}
          {chatMessages &&
            chatMessages.map((msg, index) => (
              <div
                key={index}
                style={{
                  alignSelf: msg.from === selectedUser ? "flex-start" : "flex-end",
                  maxWidth: "70%",
                  marginBottom: "8px",
                }}
              >
                <div
                  style={{
                    background: msg.from === selectedUser ? "#f0f0f0" : "#2196f3",
                    color: msg.from === selectedUser ? "#000" : "#fff",
                    padding: "8px",
                    borderRadius: "8px",
                    wordWrap: "break-word",
                  }}
                >
                  {msg.from === selectedUser
                    ? msg.content
                    : `${msg.content}`}
                </div>
              </div>
            ))}
        </div>
        <div style={{ display: "flex", padding: "16px" }}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{
              flex: 1,
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              marginRight: "8px",
            }}
            placeholder="Type your message..."
          />
          <button
            onClick={handleSendMessage}
            style={{
              background: "#4caf50",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              cursor: "pointer",
              borderRadius: "8px",
            }}
          >
            Send
          </button>
        </div>
      </Box>
    </Modal>
  );
};

export default ChatModal;
