import { ListBox } from "primereact/listbox";
import { useEffect, useState } from "react";

export default function ContactsWindows() {
  const [contacts, setContacts] = useState([]);
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
      <ListBox
        value={selectedContact}
        options={contacts}
        onChange={(e) => setSelectedContact(e.value)}
        optionLabel="userName"
        style={{ width: "15rem" }}
      />
    </>
  );
}
