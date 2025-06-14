import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import { useRef, useState } from "react";

export default function Login() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const toast = useRef<Toast>(null);

  const showSuccess = () => {
    if (toast.current === null) return;
    toast.current.show({
      severity: "success",
      summary: "Login Successful",
      detail: "You have successfully logged in!",
      life: 3000,
    });
  };

  const showError = () => {
    if (toast.current === null) return;
    toast.current.show({
      severity: "error",
      summary: "Login Failed",
      detail: "Invalid email or password.",
      life: 3000,
    });
  };

  const handleLogin = async () => {
    // Handle login logic here
    console.log("Logging in with email:", email, "and password:", password);
    // You can add API calls or authentication logic here

    const response = await fetch(
      "https://whatsapp-clone-tzf0.onrender.com/user/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userEmail: email, userPassword: password }),
      }
    ).then((res) => {
      if (res.ok) {
        showSuccess();
      } else {
        showError();
      }
    });
  };

  return (
    <>
      <h1>Login</h1>
      <div className="p-inputgroup flex-1">
        <span className="p-inputgroup-addon">
          <i className="pi pi-at"></i>
        </span>
        <InputText
          placeholder="Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="p-inputgroup flex-1">
        <span className="p-inputgroup-addon">
          <i className="pi pi-key"></i>
        </span>
        <Password
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          feedback={false}
          tabIndex={1}
        />
      </div>
      <Toast ref={toast} />
      <Button label="Submit" onClick={handleLogin} />
    </>
  );
}
