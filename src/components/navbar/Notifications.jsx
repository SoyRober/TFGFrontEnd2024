import { useEffect, useRef, useState } from "react";
import { fetchData } from "../../utils/fetch";
import "../../styles/notifications.css";
import { toast } from "react-toastify";

const Notifications = () => {
	const [showNotifications, setShowNotifications] = useState(false);
	const [messages, setMessages] = useState([]);
	const [token] = useState(localStorage.getItem("token") || "");
	const notificationsRef = useRef(null);

	useEffect(() => {
		if (token) {
			getUserMessages(token);
			const intervalId = setInterval(() => {
				getUserMessages(token);
			}, 20000);

			return () => clearInterval(intervalId);
		}
	}, [token]);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				notificationsRef.current &&
				!notificationsRef.current.contains(event.target)
			) {
				setShowNotifications(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [notificationsRef]);

	const getUserMessages = async (token) => {
		try {
			const data = await fetchData(`/user/notification`, "GET", null, token);
			setMessages(data);
		} catch (error) {
			toast.error(error.message);
		}
	};

	const toggleNotifications = () => {
		setShowNotifications(!showNotifications);
	};

	const handleHideNotification = async (currentMessage) => {
		await fetchData(
			`/user/notification/hide/${currentMessage.id}`,
			"PUT",
			null,
			token
		);
		setMessages((prevMessages) =>
			prevMessages.filter((message) => message.id !== currentMessage.id)
		);
	};

	const handleReadNotification = async (currentMessage) => {
		if (currentMessage.isRead) return;
		await fetchData(
			`/user/notification/read/${currentMessage.id}`,
			"PUT",
			null,
			token
		);
		setMessages((prevMessages) =>
			prevMessages.map((message) =>
				message.id === currentMessage.id
					? { ...message, isRead: true }
					: message
			)
		);
	};

	const hasUnreadMessages = messages.some((message) => !message.isRead);

	return (
		<div className="notifications" ref={notificationsRef}>
			<button
				onClick={() => {
					toggleNotifications();
				}}
				className={`fa-${
					!showNotifications ? "solid" : "regular"
				} fa-bell mx-4 my-2 bell-button`}
				aria-label="Toggle Notifications"
			>
				{hasUnreadMessages && <span className="notification-unread"></span>}
			</button>
			{showNotifications && (
				<div className="notifications-popup my-3 bg-dark" style={{}}>
					{messages.length === 0 ? (
						<div className="empty-message-container">Empty, for now</div>
					) : (
						<ul style={{ color: "white" }}>
							{messages
								.filter((message) => !message.isHidden)
								.map((message) => (
									<li
										key={message.id}
										className={`notification-item ${
											message.isRead ? "read" : "unread"
										}`}
									>
										<div className="notification-content">
											<p>{message.message}</p>
											<p className="notification-date">
												{new Date(message.createdAt).toLocaleString()}
											</p>
										</div>
										<div className="notification-icons">
											<button
												className="fa-solid fa-check message-button"
												aria-label="Mark as read"
												onClick={() => handleReadNotification(message)}
											></button>
											<button
												className="fa-solid fa-xmark message-button"
												aria-label="Hide notification"
												onClick={() => handleHideNotification(message)}
											></button>
										</div>
									</li>
								))}
						</ul>
					)}
				</div>
			)}
		</div>
	);
};

export default Notifications;
