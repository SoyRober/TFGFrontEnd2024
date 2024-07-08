import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ReactDOM from "react-dom/client";
import Root from "./routes/Root.jsx";
import Login from "./routes/Login.jsx";
import Register from "./routes/Register.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,  
    children: [
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    }
  ],
}
]);


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>
);
