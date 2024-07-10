import React, { useEffect, useState } from 'react';

function App() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('http://localhost:8080/test', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: 'Hello from React' }),
        })
            .then(response => response.text())
            .then(data => setMessage(data))
            .catch(error => console.error('Error:', error));
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <p>{message}</p>
            </header>
        </div>
    );
}

export default App;
