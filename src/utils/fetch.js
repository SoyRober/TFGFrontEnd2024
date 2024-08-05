const BASE_URL = 'http://localhost:8080';

export const fetchData = async (endpoint, method = 'GET', body = null, token = null, contentType = 'application/json') => {
    
    const headers = {
        'Content-Type': contentType,
    };

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
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response text:', errorText);
            throw new Error(`HTTP error! Status: ${response.status}, Response: ${errorText}`);
        }

        const responseContentType = response.headers.get('content-type');

        if (responseContentType && responseContentType.includes('application/json')) {
            const jsonResponse = await response.json();
            console.log(jsonResponse)
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
