const BASE_URL = 'http://localhost:8080';

export const fetchData = async (endpoint, method = 'GET', body = null, token = null, contentType = 'application/json') => {
    const headers = {};

    if (!(body instanceof FormData) && contentType) {
        headers['Content-Type'] = contentType;
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method,
        headers,
    };

    if (body) {
        if (contentType === 'application/json' && !(body instanceof FormData)) {
            config.body = JSON.stringify(body);
        } else {
            config.body = body;
        }
    }

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, config);
        console.log(response)

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

        const responseContentType = response.headers.get('content-type');

        if (responseContentType && responseContentType.includes('application/json')) {
            const jsonResponse = await response.json();
            return jsonResponse;
        } else {
            const textResponse = await response.text();
            return textResponse;
        }
    } catch (error) {
        console.error("Failed to fetch data:", error);
        throw error;
    }
};
