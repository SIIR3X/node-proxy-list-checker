// tests/checker.test.js

const axios = require('axios');
const Site = require('../src/models/Site');
const Proxy = require('../src/models/Proxy');
const { checkProxyConnection } = require('../src/utils/checker');
const { HttpsProxyAgent } = require('https-proxy-agent');
const { HttpProxyAgent } = require('http-proxy-agent');

jest.mock('axios');
jest.mock('http-proxy-agent');
jest.mock('https-proxy-agent');

describe('Checker Utils', () => {
	describe('checkProxyConnection', () => {
		let site;
		let proxy;
	
		beforeEach(() => {
			site = new Site('http://example.com', 5000);
			proxy = new Proxy('192.168.1.1', 8080);
		});
	
		test('should return the proxy if the connection is successful with HTTP', async () => {
			axios.mockResolvedValueOnce({ status: 200 });
	
			const result = await checkProxyConnection(site, proxy);
	
			expect(result).toBe(proxy);
			expect(axios).toHaveBeenCalledWith(expect.objectContaining({
				method: 'get',
				url: 'http://example.com',
				timeout: 5000,
				httpAgent: expect.any(HttpProxyAgent),
				httpsAgent: undefined
			}));
		});
	
		test('should return the proxy if the connection is successful with HTTPS', async () => {
			site = new Site('https://example.com', 5000);
			axios.mockResolvedValueOnce({ status: 200 });
	
			const result = await checkProxyConnection(site, proxy);
	
			expect(result).toBe(proxy);
			expect(axios).toHaveBeenCalledWith(expect.objectContaining({
				method: 'get',
				url: 'https://example.com',
				timeout: 5000,
				httpAgent: undefined,
				httpsAgent: expect.any(HttpsProxyAgent)
			}));
		});
	
		test('should return null if the connection fails', async () => {
			axios.mockRejectedValueOnce(new Error('Network error'));
	
			const result = await checkProxyConnection(site, proxy);
	
			expect(result).toBeNull();
		});
	
		test('should handle proxy authentication', async () => {
			proxy = new Proxy('192.168.1.1', 8080, 'user', 'pass');
			axios.mockResolvedValueOnce({ status: 200 });
	
			const result = await checkProxyConnection(site, proxy);
	
			expect(result).toBe(proxy);
			expect(axios).toHaveBeenCalledWith(expect.objectContaining({
				method: 'get',
				url: 'http://example.com',
				timeout: 5000,
				httpAgent: expect.any(HttpProxyAgent),
				httpsAgent: undefined
			}));
		});
	
		test('should correctly configure axios for an HTTP request', async () => {
			axios.mockResolvedValueOnce({ status: 200 });
	
			await checkProxyConnection(site, proxy);
	
			expect(axios).toHaveBeenCalledWith(expect.objectContaining({
				method: 'get',
				url: 'http://example.com',
				timeout: 5000,
				httpAgent: expect.any(HttpProxyAgent),
				httpsAgent: undefined
			}));
		});
	
		test('should correctly configure axios for an HTTPS request', async () => {
			site = new Site('https://example.com', 5000);
			axios.mockResolvedValueOnce({ status: 200 });
	
			await checkProxyConnection(site, proxy);
	
			expect(axios).toHaveBeenCalledWith(expect.objectContaining({
				method: 'get',
				url: 'https://example.com',
				timeout: 5000,
				httpAgent: undefined,
				httpsAgent: expect.any(HttpsProxyAgent)
			}));
		});
	});
});
