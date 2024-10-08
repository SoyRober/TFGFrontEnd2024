import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import Homepage from "./routes/Homepage.jsx";
import Navbar from "./routes/Navbar.jsx";
import Login from "./routes/Login.jsx";
import Register from "./routes/Register.jsx";
import ViewBook from "./routes/ViewBook.jsx";
import Loans from "./routes/Loans.jsx";
import Settings from "./routes/Settings.jsx";
import UsersList from "./routes/UsersList.jsx";
import ViewProfile from "./routes/ViewProfile.jsx";
import UserBooksDetails from "./routes/UserBooksDetails.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navbar />,
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
        path: "/user/settings",
        element: <Settings />,
      },
      {
        path: "/user/loans",
        element: <Loans />,
      },
      {
        path: "/viewBook/:title",
        element: <ViewBook />,
      },
      {
        path: "/usersList",
        element: <UsersList />,
      },
      {
        path: "/profile/:email",
        element: <ViewProfile />,
      },
      {
        path: "/userBookDetails",
        element: <UserBooksDetails />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>
);
