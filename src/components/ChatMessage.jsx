import TextTransformer from "./TextTransformer";

const ChatMessage = ({ role, text }) => {
  return (
    <div className={role === "user" ? "user-message" : "bot-message"}>
      <TextTransformer text={text} />
    </div>
  );
};

export default ChatMessage;
