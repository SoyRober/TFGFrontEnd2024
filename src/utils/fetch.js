const BASE_URL = "http://localhost:8080";

export const fetchData = async (
  endpoint,
  method = "GET",
  body = null,
  token = null,
  contentType = "application/json"
) => {
  const headers = {};

  // Debugging: Log the received parameters
  //console.log("fetchData called with:", { endpoint, method, body, token, contentType });

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

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    // Debugging: Log the raw response
    //console.log("Raw response:", response);

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `HTTP error! Status: ${response.status}`;

      // Debugging: Log the error text received from the server
      //console.log("Error text from response:", errorText);

      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.message) {
          errorMessage = errorJson.message;
        }
      } catch (jsonError) {
        //console.error("Failed to parse error response JSON:", jsonError);
      }

      throw new Error(errorMessage);
    }

    const responseContentType = response.headers.get("content-type");

    if (
      responseContentType &&
      responseContentType.includes("application/json")
    ) {
      const jsonResponse = await response.json();

      // Debugging: Log the parsed JSON response
      //console.log("JSON response:", jsonResponse);

      return jsonResponse;
    } else {
      const textResponse = await response.text();

      // Debugging: Log the plain text response
      //console.log("Text response:", textResponse);

      return textResponse;
    }
  } catch (error) {
    // Debugging: Log any error that occurred during fetch
    console.error("Failed to fetch data:", error);
    throw error;
  }
};
