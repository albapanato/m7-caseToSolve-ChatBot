import React, { useState } from "react";

const ChatInput = ({ onSend, isAssistantResponding }) => {
  const [inputText, setInputText] = useState("");

  const handleSend = () => {
    if (inputText.trim() !== "") {
      onSend({ role: "user", text: inputText }); // Enviar mensaje
      setInputText(""); // Limpiar el input
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="input-bar">
      <input
        autoFocus
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Escribe tu mensaje..."
        disabled={isAssistantResponding} // Deshabilitar mientras responde el asistente
      />
      <button
        onClick={handleSend}
        disabled={isAssistantResponding} // Botón inhabilitado mientras responde
        style={{
          border: "none",
          background: "none",
          padding: "0",
          cursor: isAssistantResponding ? "not-allowed" : "pointer",
        }}
      >
        <img
          src={
            isAssistantResponding
              ? "icons8-círculo-de-carga.svg" // Icono de deshabilitado
              : "icons8-enviado-60.png" // Icono de enviar
          }
          alt={isAssistantResponding ? "Esperando respuesta" : "Enviar mensaje"}
          style={{ width: "24px", height: "24px" }}
        />
      </button>
    </div>
  );
};

export default ChatInput;
