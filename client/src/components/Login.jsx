import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";

const Login = () => {
  const { setShowUserLogin } = useAppContext();

  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = (e) => {
    e.preventDefault();
    console.log({ name, email, password });
  };

  return (
    <div
      onClick={() => setShowUserLogin(false)}
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/50"
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-4 p-8 py-10 w-80 sm:w-96 text-gray-600 rounded-lg shadow-xl border border-gray-200 bg-white"
      >
        <p className="text-2xl font-medium text-center">
          <span className="text-indigo-500">User</span>{" "}
          {state === "login" ? "Login" : "Sign Up"}
        </p>

        {state === "register" && (
          <div>
            <p>Name</p>
            <input
              type="text"
              placeholder="Type here"
              className="border border-gray-200 rounded w-full p-2 mt-1 focus:outline-indigo-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}

        <div>
          <p>Email</p>
          <input
            type="email"
            placeholder="Type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 focus:outline-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <p>Password</p>
          <input
            type="password"
            placeholder="Type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 focus:outline-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {state === "register" ? (
          <p className="text-sm">
            Already have an account?{" "}
            <span
              onClick={() => setState("login")}
              className="text-indigo-500 cursor-pointer"
            >
              Click here
            </span>
          </p>
        ) : (
          <p className="text-sm">
            Create an account?{" "}
            <span
              onClick={() => setState("register")}
              className="text-indigo-500 cursor-pointer"
            >
              Click here
            </span>
          </p>
        )}

        <button className="bg-indigo-500 hover:bg-indigo-600 transition text-white w-full py-2 rounded-md">
          {state === "register" ? "Create Account" : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;