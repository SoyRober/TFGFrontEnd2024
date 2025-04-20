import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import Homepage from "./routes/Homepage.jsx";
import Navbar from "./routes/Navbar.jsx";
import Login from "./routes/Login.jsx";
import Register from "./routes/Register.jsx";
import ViewBook from "./routes/ViewBook.jsx";
import Loans from "./routes/Loans.jsx";
import UserSettings from "./routes/UserSettings.jsx";
import UsersList from "./routes/UsersList.jsx";
import ViewProfile from "./routes/ViewProfile.jsx";
import UserBooksDetails from "./routes/UserBooksDetails.jsx";
import Attributes from "./routes/Attributes.jsx";
import Genres from "./routes/Genres.jsx";
import Authors from "./routes/Authors.jsx";
import PendingBooks from "./routes/PendingBooks.jsx";
import BookCopies from "./routes/BookCopies.jsx";
import Libraries from "./routes/Libraries.jsx";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Navbar />,
		children: [
			{
				path: "/",
				element: <Homepage />,
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
				path: "/user/userSettings",
				element: <UserSettings />,
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
			{
				path: "/attributes",
				element: <Attributes />,
			},
			{
				path: "/genres",
				element: <Genres />,
			},
			{
				path: "/authors",
				element: <Authors />,
			},
			{
				path: "/pendingBooks",
				element: <PendingBooks />,
			},
			{
				path: "/bookCopies/:title",
				element: <BookCopies />,
			},
			{
				path: "/libraries",
				element: <Libraries />,
			},
		],
	},
]);

createRoot(document.getElementById("root")).render(
	<RouterProvider router={router}></RouterProvider>
);
