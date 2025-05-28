const BASE_URL = import.meta.env.VITE_BASE_URL;

export const fetchData = async (
  endpoint,
  method = "GET",
  body = null,
  token = null,
  contentType = "application/json"
) => {
  const headers = {};
  if (body && !(body instanceof FormData) && contentType) {
    headers["Content-Type"] = contentType;
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body =
      contentType === "application/json" && !(body instanceof FormData)
        ? JSON.stringify(body)
        : body;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (response.status === 401) {
    localStorage.removeItem("token"); 
    window.location.href = "/unauthorized";
    return;
  }

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `HTTP error! Status: ${response.status}`;

    try {
      const errorJson = JSON.parse(errorText);
      if (errorJson.message) {
        errorMessage = errorJson.message;
      }
    } catch (jsonError) {
      console.error("Failed to parse error response JSON:", jsonError);
    }

    throw new Error(errorMessage);
  }

  const responseContentType = response.headers.get("content-type");

  if (responseContentType && responseContentType.includes("application/json")) {
    return await response.json();
  } else {
    return await response.text();
  }
};
