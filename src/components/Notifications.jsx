import { useEffect, useRef, useState } from "react";
import { fetchData } from "../utils/fetch";
import "../styles/notifications.css";
import { toast } from "react-toastify";

const Notifications = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [messages, setMessages] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
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
      const data = await fetchData(`/notification`, "GET", null, token);
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
      `/notification/hide/${currentMessage.id}`,
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
      `/notification/read/${currentMessage.id}`,
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
        className={`fa-${!showNotifications ? "solid" : "regular"} fa-bell mx-4 my-2`}
        style={{
          backgroundColor: "transparent",
          fontSize: "25px",
          border: "none",
          background: "none",
          color: "white",
          position: "relative",
        }}
        aria-label="Toggle Notifications"
      >
        {hasUnreadMessages && (
          <span
            style={{
              position: "absolute",
              top: "0",
              right: "0",
              width: "10px",
              height: "10px",
              backgroundColor: "red",
              borderRadius: "50%",
            }}
          ></span>
        )}
      </button>
      {showNotifications && (
        <div
          className="notifications-popup my-3 bg-dark"
          style={{
            borderRadius: "12px",
            backgroundColor: "white",
          }}
        >
          {messages.length === 0 ? (
            <div
              style={{
                color: "white",
                textAlign: "center",
                padding: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "250px"
              }}
            >
              Empty, for now
            </div>
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
                        className="fa-solid fa-check"
                        style={{
                          cursor: "pointer",
                          color: "white",
                          background: "none",
                          border: "none",
                        }}
                        aria-label="Mark as read"
                        onClick={() => handleReadNotification(message)}
                      ></button>
                      <button
                        className="fa-solid fa-xmark"
                        style={{
                          cursor: "pointer",
                          color: "white",
                          background: "none",
                          border: "none",
                        }}
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
