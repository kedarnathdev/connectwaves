import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Panel } from "primereact/panel";

const fakeContacts = [{ userName: "Alice" }, { userName: "Bob" }];

const contact = fakeContacts[0]; // Simulating a selected contact

export default function ChatWindow({ selectedContact }: any) {
  return (
    <>
      {/* ChatWindow */}
      <Panel
        header={contact ? `Chat with ${contact.userName}` : "Chat Window"}
        style={{ height: "100%", display: "flex", flexDirection: "column" }}
      ></Panel>
    </>
  );
}
