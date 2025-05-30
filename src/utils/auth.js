import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

export function hasAuthorization(allowedRoles = []) {
  const token = localStorage.getItem("token");
  if (!token) return false;
  try {
    const { role } = jwtDecode(token);
    return allowedRoles.includes(role?.toLowerCase());
  } catch {
    toast.error("User is not authorized to access this page");
    return false;
  }
}