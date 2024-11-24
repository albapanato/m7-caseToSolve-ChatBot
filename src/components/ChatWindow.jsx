import React, { useState } from "react";
import "../styles/index.css";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage.jsx";

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [isAssistantResponding, setIsAssistantResponding] = useState(false);

  const handleNewMessage = async (newMessage) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    if (newMessage.role === "user") {
      setIsAssistantResponding(true);
      try {
        const response = await fetch(
          "https://api.mistral.ai/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messages: [{ role: "user", content: newMessage.text }],
              model: "mistral-tiny",
            }),
          }
        );

        const data = await response.json();
        // Imprimir el contenido completo (si no es demasiado largo)
        console.log("Respuesta completa de la API:", data.content);
        if (response.ok && data) {
          const assistantMessage = {
            role: "assistant",
            text: data.choices[0].message.content,
          };
          setMessages((prevMessages) => [...prevMessages, assistantMessage]);
        } else {
          console.error("Error en la respuesta de la API:", data.message);
        }
      } catch (error) {
        console.error("Error en la API:", error);
      } finally {
        setIsAssistantResponding(false); // Respuesta finalizada
      }
    }
  };
  const renderNoMessages = () => {
    return (
      <div className="no-messages">
        <h1> Bienvenid@ a ChatBot</h1>
        <img
          className="no-messages-img"
          src="/icons8-robot-mensaje-48.png"
          alt=""
        />
        <h2>¿En que puedo ayudarte hoy?</h2>
      </div>
    );
  };

  console.log("Mensajes actuales:", messages);
  console.log(messages);

  return (
    <div className="container">
      <div className="chat-window">
        <div className="messages">
          {messages.length === 0
            ? renderNoMessages()
            : messages.map((msg, idx) => (
                <div key={idx} className={`message-container ${msg.role}`}>
                  {msg.role === "assistant" && (
                    <img
                      src="/icons8-robot-mensaje-48.png" // Ruta del ícono del bot
                      alt="Bot Icon"
                      className="icons"
                    />
                  )}
                  {msg.role === "user" && (
                    <img
                      src="/icons8-usuario48.png" // Ruta del ícono del usuario
                      alt="User Icon"
                      className="icons"
                    />
                  )}
                  <ChatMessage role={msg.role} text={msg.text} />
                </div>
              ))}
        </div>
        <ChatInput
          onSend={handleNewMessage}
          isAssistantResponding={isAssistantResponding}
        />
      </div>
    </div>
  );
};

export default ChatWindow;
