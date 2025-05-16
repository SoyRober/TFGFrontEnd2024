import { createHashRouter, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { Suspense, lazy } from "react";

const Search = lazy(() => import("./routes/Search.jsx"));
const Presentation = lazy(() => import("./routes/Presentation.jsx"));
const Navbar = lazy(() => import("./components/navbar/Navbar.jsx"));
const Login = lazy(() => import("./routes/Login.jsx"));
const Register = lazy(() => import("./routes/Register.jsx"));
const ViewBook = lazy(() => import("./routes/ViewBook.jsx"));
const Loans = lazy(() => import("./routes/Loans.jsx"));
const UserSettings = lazy(() => import("./routes/UserSettings.jsx"));
const UsersList = lazy(() => import("./routes/UsersList.jsx"));
const ViewProfile = lazy(() => import("./routes/ViewProfile.jsx"));
const UserBooksDetails = lazy(() => import("./routes/UserBooksDetails.jsx"));
const Attributes = lazy(() => import("./routes/Attributes.jsx"));
const Genres = lazy(() => import("./routes/Genres.jsx"));
const Authors = lazy(() => import("./routes/Authors.jsx"));
const PendingBooks = lazy(() => import("./routes/PendingBooks.jsx"));
const BookCopies = lazy(() => import("./routes/BookCopies.jsx"));
const Libraries = lazy(() => import("./routes/Libraries.jsx"));
const ManagedLibraries = lazy(() => import("./routes/ManagedLibraries.jsx"));
const Loading = lazy(() => import("./components/Loading.jsx"));

const withSuspense = (Component) => (
	<Suspense fallback={<Loading />}>
		<Component />
	</Suspense>
);

const router = createHashRouter([
	{
		path: "/",
		element: withSuspense(Navbar),
		children: [
			{ index: true, element: withSuspense(Presentation) },
			{ path: "search", element: withSuspense(Search) },
			{ path: "login", element: withSuspense(Login) },
			{ path: "register", element: withSuspense(Register) },
			{ path: "user/userSettings", element: withSuspense(UserSettings) },
			{ path: "user/loans", element: withSuspense(Loans) },
			{ path: "viewBook/:title", element: withSuspense(ViewBook) },
			{ path: "usersList", element: withSuspense(UsersList) },
			{ path: "profile/:email", element: withSuspense(ViewProfile) },
			{ path: "userBookDetails", element: withSuspense(UserBooksDetails) },
			{ path: "attributes", element: withSuspense(Attributes) },
			{ path: "genres", element: withSuspense(Genres) },
			{ path: "authors", element: withSuspense(Authors) },
			{ path: "pendingBooks", element: withSuspense(PendingBooks) },
			{ path: "bookCopies/:title", element: withSuspense(BookCopies) },
			{ path: "libraries", element: withSuspense(Libraries) },
			{ path: "managedLibraries", element: withSuspense(ManagedLibraries) },
		],
	},
]);

createRoot(document.getElementById("root")).render(
	<RouterProvider router={router} />
);
