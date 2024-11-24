import React, { useEffect } from "react";
import { marked } from "marked";
import hljs from "highlight.js"; // npm install marked highlight.js
import "highlight.js/styles/nord.css"; // Cambia el tema si lo deseas.

const TextTransformer = ({ text }) => {
  // Configurar `marked` para el formato de Markdown.
  marked.setOptions({
    highlight: function (code, lang) {
      if (hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang }).value;
      }
      return hljs.highlightAuto(code).value;
    },
  });

  // Convertir el texto a HTML.
  const transformedHTML = marked(text);

  useEffect(() => {
    // Asegurar que Highlight.js procese todos los bloques de código.
    document.querySelectorAll("pre code").forEach((block) => {
      hljs.highlightElement(block);
    });
  }, [transformedHTML]); // Ejecutar siempre que el contenido cambie.

  // Función para copiar el contenido de un bloque de código.
  const handleCopy = (code) => {
    navigator.clipboard
      .writeText(code)
      .then()
      .catch((err) => console.error("Error al copiar:", err));
  };

  return (
    <div
      style={{
        position: "relative",
      }}
    >
      {/* Renderizado del contenido procesado */}
      <div
        className="text-transformer"
        dangerouslySetInnerHTML={{ __html: transformedHTML }}
      />

      {/* Insertar botones en los bloques de código */}
      {useEffect(() => {
        const blocks = document.querySelectorAll("pre code");
        blocks.forEach((block) => {
          // Verificar si ya tiene el botón para evitar duplicados.
          if (block.parentElement.querySelector(".top-bar")) return;
          const classes = Array.from(block.classList);
          console.log(classes);
          const language = classes
            .filter((className) => className !== "hljs")
            .find(() => "language-");
          const languageString = language?.replace("language-", "");
          const topBar = document.createElement("div");
          topBar.style.cssText = `
            display: flex;
            background: rgb(44, 49, 60);
            padding: 3px;
            color: white;
            justify-content: space-between;
            align-items: center;
            font-size: 0.7rem;
          `;
          topBar.className = "top-bar";
          const languageBlock = document.createElement("div");
          languageBlock.textContent = languageString;
          languageBlock.style.cssText = `
            margin-left: 5px;
          `;

          const button = document.createElement("button");
          button.textContent = "Copiar";
          button.style.cssText = `
              background: #23272E;
              color: white;
              border: none;
              padding: 0.3rem;
              border-radius: 5px;
              cursor: pointer;
              font-size: 0.7rem;
            `;
          button.onclick = () => handleCopy(block.innerText);
          topBar.appendChild(languageBlock);
          topBar.appendChild(button);
          block.parentElement.insertBefore(
            topBar,
            block.parentElement.firstChild
          );
        });
      }, [transformedHTML])}
    </div>
  );
};

export default TextTransformer;
