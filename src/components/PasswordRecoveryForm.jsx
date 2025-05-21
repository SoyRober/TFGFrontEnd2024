import { useState } from "react";
import { fetchData } from "../utils/fetch";
import { toast } from "react-toastify";

const PasswordRecoveryForm = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetchData("/public/recover-password", "POST", email, null, "text/plain");

      if (response.success) {
        toast.success(response.message || "Recovery email sent if the email exists.");
        onClose();
      } else {
        toast.error(response.message || "Could not send recovery email.");
      }
    } catch (err) {
      toast.error(err.message || "Unexpected error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p>Enter your email to receive a password reset link.</p>
      <input
        type="email"
        className="form-control mb-3"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        aria-label="Email for password recovery"
        required
      />
      <button
        className="btn btn-primary w-100"
        onClick={handleSend}
        disabled={loading}
        aria-label="Send password recovery email"
      >
        {loading ? "Sending..." : "Send recovery email"}
      </button>
    </div>
  );
};

export default PasswordRecoveryForm;
