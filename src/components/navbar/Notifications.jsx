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
  }, []);

  const getUserMessages = async (token) => {
    try {
      const data = await fetchData(`/user/notification`, "GET", null, token);
      setMessages(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  const handleHideNotification = async (currentMessage) => {
    await fetchData(
      `/user/notification/hide/${currentMessage.id}`,
      "PUT",
      null,
      token
    );
    setMessages((prev) =>
      prev.filter((message) => message.id !== currentMessage.id)
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
    setMessages((prev) =>
      prev.map((message) =>
        message.id === currentMessage.id ? { ...message, isRead: true } : message
      )
    );
  };

  const hasUnreadMessages =
    Array.isArray(messages) && messages.some((message) => !message.isRead);

  return (
    <div className="notifications" ref={notificationsRef}>
      <button
        type="button"
        onClick={toggleNotifications}
        className={`fa-${!showNotifications ? "solid" : "regular"} fa-bell mx-4 my-2 bell-button`}
        aria-label={`${showNotifications ? "Close notifications" : "Open notifications"}`}
        aria-haspopup="dialog"
        aria-expanded={showNotifications}
      >
        {hasUnreadMessages && (
          <span
            className="notification-unread"
            aria-live="polite"
            aria-atomic="true"
            role="status"
            style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)" }}
          >
            You have unread notifications
          </span>
        )}
      </button>

      {showNotifications && (
        <div
          className="notifications-popup my-3 bg-dark"
          role="region"
          aria-label="User notifications"
          tabIndex={-1}
        >
          {messages.length === 0 ? (
            <div className="empty-message-container" aria-live="polite">
              Empty, for now
            </div>
          ) : (
            <ul style={{ color: "white" }} aria-label="Notifications list">
              {messages
                .filter((message) => !message.isHidden)
                .map((message) => (
                  <li
                    key={message.id}
                    className={`notification-item ${
                      message.isRead ? "read" : "unread"
                    }`}
                    aria-label={`Notification: ${message.message}. ${
                      message.isRead ? "Read" : "Unread"
                    }`}
                    role="listitem"
                  >
                    <div className="notification-content">
                      <p>{message.message}</p>
                      <p className="notification-date">
                        {new Date(message.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="notification-icons">
                      <button
                        type="button"
                        className="fa-solid fa-check message-button"
                        aria-label={
                          message.isRead
                            ? "Already marked as read"
                            : "Mark notification as read"
                        }
                        onClick={() => handleReadNotification(message)}
                        disabled={message.isRead}
                      ></button>
                      <button
                        type="button"
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
