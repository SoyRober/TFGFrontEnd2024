import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import Homepage from "./routes/Homepage.jsx";
import Root from "./routes/Root.jsx";
import Login from "./routes/Login.jsx";
import Register from "./routes/Register.jsx";
import ViewBook from "./routes/ViewBook.jsx";
import Loans from "./routes/Loans.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Homepage />
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/user/loans",
        element: <Loans />,
      },
      {
        path: "/viewBook/:title",
        element: <ViewBook />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>
);
