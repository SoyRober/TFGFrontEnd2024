const BASE_URL = 'http://localhost:8080';

export const fetchData = async (endpoint, method = 'GET', body = null, token = null, contentType = 'application/json') => {
    console.log(`Requesting ${BASE_URL}${endpoint} with method ${method}`);
    
    const headers = {
        'Content-Type': contentType,
    };
    console.log('Initial headers:', headers);

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('Added Authorization header:', headers['Authorization']);
    }

    const config = {
        method,
        headers,
    };
    console.log('Initial config:', config);

    if (body) {
        console.log('Body provided:', body);
        if (contentType === 'application/json' && !(body instanceof FormData)) {
            config.body = JSON.stringify(body);
            console.log('Serialized JSON body:', config.body);
        } else {
            config.body = body; 
            console.log('Non-JSON or FormData body:', config.body);
        }
    }

    try {
        console.log('Making fetch request with config:', config);
        const response = await fetch(`${BASE_URL}${endpoint}`, config);
        
        console.log('Received response:', response);
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response text:', errorText);
            throw new Error(`HTTP error! Status: ${response.status}, Response: ${errorText}`);
        }

        const responseContentType = response.headers.get('content-type');
        console.log('Response Content-Type:', responseContentType);

        if (responseContentType && responseContentType.includes('application/json')) {
            const jsonResponse = await response.json();
            console.log('Parsed JSON response:', jsonResponse);
            return jsonResponse;
        } else {
            const textResponse = await response.text();
            console.log('Parsed text response:', textResponse);
            return textResponse;
        }
    } catch (error) {
        console.error("Failed to fetch data:", error);
        throw error;
    }
};
