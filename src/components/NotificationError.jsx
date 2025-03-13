import "../styles/notificationError.css";

const NotificationError = ({ message }) => {
    if (!message) return null;

    return (
        <div className="notification-container">
            <div className="rectangle">
                <div className="notification-text">
                    <i className="material-icons">info</i>
                    <span>&nbsp;&nbsp;{message}</span>
                </div>
            </div>
        </div>
    );
};

export default NotificationError;
