const http = require('http');
const { describe, it, expect } = require('@jest/globals');

describe('Backend Connection', () => {
    it('should connect to the backend successfully', (done) => {
        const options = {
            hostname: 'localhost', // Cambia esto si tu backend usa un dominio diferente
            port: 8080, // Cambia esto si tu backend usa un puerto diferente
            path: '/getUsers?page=0',
            method: 'GET'
        };

        const req = http.request(options, (res) => {
            expect(res.statusCode).toBe(200);
            done();
        });

        req.on('error', (e) => {
            done.fail(e);
        });

        req.end();
    });
});