import { ListBox } from "primereact/listbox";
import { Panel } from "primereact/panel";
import { useEffect, useState } from "react";
import ChatWindow from "./ChatWindow";

const fakeContacts = [{ userName: "Alice" }, { userName: "Bob" }];

export default function ContactsWindows() {
  const [contacts, setContacts] = useState(fakeContacts);
  const [selectedContact, setSelectedContact] = useState(null);
  useEffect(() => {
    getcontacts();
  }, []);

  const getcontacts = async () => {
    const response = await fetch(
      "https://whatsapp-clone-tzf0.onrender.com/user/getContacts",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "6845c202e591e981ba359726",
        }),
      }
    );
    if (response.ok) {
      const data = await response.json();
      setContacts(data);
    } else {
      console.error("Failed to fetch contacts");
    }
  };

  return (
    <>
      <div style={{ display: "flex", height: "100vh" }}>
        {/* ContactsWindow */}
        <div
          style={{
            width: "250px",
            borderRight: "1px solid #ccc",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Panel header="Contacts" style={{ flex: "1 1 auto", margin: 0 }}>
            {/* Scrollable Area */}
            <div style={{ height: "calc(100vh - 100px)", overflowY: "auto" }}>
              <ListBox
                value={selectedContact}
                options={contacts}
                onChange={(e) => setSelectedContact(e.value)}
                optionLabel="userName"
                style={{ width: "100%" }}
              />
            </div>
          </Panel>
        </div>

        <ChatWindow selectedContact={selectedContact} />
      </div>
    </>
  );
}
