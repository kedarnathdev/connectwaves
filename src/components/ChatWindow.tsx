import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useState } from "react";

const fakeContact = { userName: "Alice" };

export default function ChatWindow() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello!" },
    { id: 2, text: "Hi there! How can I help you today?" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (newMessage.trim() !== "") {
      setMessages([...messages, { id: messages.length + 1, text: newMessage }]);
      setNewMessage("");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 border rounded-2xl shadow bg-white flex flex-col h-[500px]">
      <div className="flex-1 overflow-y-auto space-y-2 p-2 mb-4 border rounded-md">
        {messages.map((msg) => (
          <div key={msg.id} className="bg-gray-100 p-2 rounded-xl max-w-xs">
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2 items-center">
        <InputText
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button label="Send" icon="pi pi-send" onClick={handleSend} />
      </div>
    </div>
  );
}
