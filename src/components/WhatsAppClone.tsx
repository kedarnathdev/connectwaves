import React, { useState, useRef, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { ScrollPanel } from "primereact/scrollpanel";
import "primereact/resources/themes/lara-light-green/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./WhatsAppClone.css";

const colors = {
  background: "#ece5dd",
  header: "#075e54",
  messageSent: "#dcf8c6",
  messageReceived: "#fff",
};

export default function WhatsAppClone() {
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contacts, setContacts] = useState<any[]>([]);
  const [activeContact, setActiveContact] = useState<string>("");
  const [messages, setMessages] = useState<Record<string, any[]>>({});
  const [input, setInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const chatIdRef = useRef<string>("");

  const handleLogin = async () => {
    setLoginError("");
    try {
      const response = await fetch(
        "https://whatsapp-clone-tzf0.onrender.com/user/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userEmail: email, userPassword: password }),
        }
      );
      if (!response.ok) throw new Error("Invalid login credentials");
      const userData = await response.json();
      setLoggedInUser(userData);
      localStorage.setItem("userId", userData.userId);
      localStorage.setItem("userName", userData.userName);
      fetchContacts(userData.userId);
    } catch (error) {
      console.error("Login failed:", error);
      setLoginError("Invalid email or password. Please try again.");
    }
  };

  const fetchContacts = async (userId: string) => {
    try {
      const response = await fetch(
        "https://whatsapp-clone-tzf0.onrender.com/user/getContacts",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );
      const contactsList = await response.json();
      setContacts(contactsList);
      if (contactsList.length > 0) {
        setActiveContact(contactsList[0].userId);
        fetchMessages(contactsList[0].userId, userId);
      }
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
    }
  };

  const fetchMessages = async (contactId: string, userId: string) => {
    const sortedChatId = [userId, contactId].sort().join("");
    chatIdRef.current = sortedChatId;
    localStorage.setItem("receiverId", contactId);
    try {
      const response = await fetch(
        "https://whatsapp-clone-tzf0.onrender.com/chat/getAllMessages",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chatId: sortedChatId }),
        }
      );
      const rawMessages = await response.json();
      const formattedMessages = rawMessages.map((msg: any) => ({
        fromMe: msg.senderId === userId,
        text: msg.messageValue,
        timestamp: new Date(msg.timeStamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));
      setMessages((prev) => ({ ...prev, [contactId]: formattedMessages }));
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const handleContactClick = (contactId: string) => {
    setActiveContact(contactId);
    if (!messages[contactId] && loggedInUser) {
      fetchMessages(contactId, loggedInUser.userId);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !chatIdRef.current) return;
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");
    const receiverId = localStorage.getItem("receiverId");

    const msg = {
      chatId: chatIdRef.current,
      senderName: userName,
      senderId: userId,
      receiverId: receiverId,
      messageValue: input.trim(),
    };

    try {
      await fetch("https://whatsapp-clone-tzf0.onrender.com/chat/sendMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msg),
      });
    } catch (error) {
      console.error("Message send failed:", error);
    }

    const formattedMsg = {
      fromMe: true,
      text: input.trim(),
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => ({
      ...prev,
      [receiverId!]: [...(prev[receiverId!] || []), formattedMsg],
    }));
    setInput("");
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeContact]);

  if (!loggedInUser) {
    return (
      <div className="wa-login-container">
        <div className="wa-login-box">
          <h2>WhatsApp Login</h2>
          <InputText
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="wa-text-input"
          />
          <div className="wa-password-container">
            <InputText
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="wa-text-input"
            />
            <Button
              icon={showPassword ? "pi pi-eye-slash" : "pi pi-eye"}
              className="wa-password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
              tooltip={showPassword ? "Hide password" : "Show password"}
            />
          </div>
          {loginError && <div className="wa-error-message">{loginError}</div>}
          <Button
            label="Login"
            onClick={handleLogin}
            className="wa-login-button"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="wa-container">
      {/* Contact List */}
      <div className="wa-contacts">
        <div className="wa-header">Chats</div>
        <div className="wa-contacts-scroll">
          {contacts.map((contact) => (
            <div
              key={contact.userId}
              className={`wa-contact-item ${
                activeContact === contact.userId ? "active" : ""
              }`}
              onClick={() => handleContactClick(contact.userId)}
            >
              {contact.userName}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="wa-chat">
        <div className="wa-header">
          {contacts.find((c) => c.userId === activeContact)?.userName}
        </div>
        <div className="wa-messages">
          {messages[activeContact]?.map((msg, idx) => (
            <div
              key={idx}
              className={`wa-message ${msg.fromMe ? "sent" : "received"}`}
            >
              <div>{msg.text}</div>
              <div className="wa-timestamp">{msg.timestamp}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="wa-input">
          <InputText
            placeholder="Type a message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="wa-text-input"
          />
          <Button label="Send" onClick={handleSend} />
        </div>
      </div>
    </div>
  );
}
