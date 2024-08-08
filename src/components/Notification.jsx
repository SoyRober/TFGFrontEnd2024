import "../styles/notification.css"

const Notification = ({ message }) => {
    if (!message) return null;

    return (
        <div className="rectangle" style={{ marginTop: '5%',
            display: 'flex',
            alignItems: 'center', 
            justifyContent: 'center', 
         }} >
            <div className="notification-text">
                <i className="material-icons">info</i>
                <span>&nbsp;&nbsp;{message}</span>
            </div>
        </div>
    );
};

export default Notification;
