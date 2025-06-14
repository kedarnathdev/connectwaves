import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import { useRef, useState } from "react";

export default function Register() {
  const [value, setValue] = useState("");

  const toast = useRef<Toast>(null);

  const showSuccess = () => {
    if (toast.current === null) return;
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: "Message Content",
      life: 3000,
    });
  };

  const showError = () => {
    if (toast.current === null) return;
    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: "Message Content",
      life: 3000,
    });
  };

  const handleSubmit = () => {
    // Handle form submission logic here
    console.log("Form submitted with value:", value);
  };

  return (
    <>
      <h1>Register</h1>
      <div className="p-inputgroup flex-1">
        <span className="p-inputgroup-addon">
          <i className="pi pi-user"></i>
        </span>
        <InputText placeholder="Username" />
      </div>
      <div className="p-inputgroup flex-1">
        <span className="p-inputgroup-addon">
          <i className="pi pi-envelope"></i>
        </span>
        <InputText placeholder="Email Address" />
      </div>

      <div className="p-inputgroup flex-1 ">
        <span className="p-inputgroup-addon">
          <i className="pi pi-key"></i>
        </span>

        <Password
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Password"
        />
      </div>
      <Button label="Submit" onClick={handleSubmit} />

      <Toast ref={toast} />
      <Button label="Success" severity="success" onClick={showSuccess} />
      <Button label="Error" severity="danger" onClick={showError} />
    </>
  );
}
