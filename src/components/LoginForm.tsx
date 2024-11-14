import React from "react";
import Router from "next/router";

interface FormElements extends HTMLFormControlsCollection {
  username: HTMLInputElement;
  password: HTMLInputElement;
}
interface LoginFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

const LoginForm = () => {
  const handleSubmit = async (event: React.FormEvent<LoginFormElement>) => {
    event.preventDefault();
    const data = JSON.stringify({
      username: event.currentTarget.username.value,
      password: event.currentTarget.password.value,
    });
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: data,
    });
    const result = await response.json();
    if (response.status == 200) {
      Router.push("/home");
    } else {
      // surface error the real way
      alert("Incorrect username or password");
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input id="username" placeholder="Username" type="text" />
      </div>
      <div>
        <input id="password" placeholder="Password" type="password" />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
