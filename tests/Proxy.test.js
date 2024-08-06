// tests/Proxy.test.js

const Proxy = require('../src/models/Proxy');

describe('Proxy class', () => {
	test('should create a Proxy instance with valid IP and port', () => {
		const proxy = new Proxy('192.168.1.1', 8080);

		expect(proxy.getIp()).toBe('192.168.1.1');
		expect(proxy.getPort()).toBe(8080);
		expect(proxy.getUsername()).toBeNull();
		expect(proxy.getPassword()).toBeNull();
	});

	test('should set IP to null for an invalid IP', () => {
		const proxy = new Proxy('256.256.256.256', 8080);

		expect(proxy.getIp()).toBeNull();
	});

	test('should set port to null for an invalid port', () => {
		const proxy = new Proxy('192.168.1.1', 70000);
		expect(proxy.getPort()).toBeNull();
	});

	test('should set and get username and password', () => {
		const proxy = new Proxy('192.168.1.1', 8080, 'user', 'pass');
		
		expect(proxy.getUsername()).toBe('user');
		expect(proxy.getPassword()).toBe('pass');
	});

	test('should return the correct string representation', () => {
		const proxy = new Proxy('192.168.1.1', 8080, 'user', 'pass');

		expect(proxy.toString()).toBe('Proxy { ip: 192.168.1.1, port: 8080, username: user, password: pass }');
	});

	test('should correctly compare two equal proxies', () => {
		const proxy1 = new Proxy('192.168.1.1', 8080, 'user', 'pass');
		const proxy2 = new Proxy('192.168.1.1', 8080, 'user', 'pass');

		expect(proxy1.equals(proxy2)).toBe(true);
	});

	test('should correctly compare two different proxies', () => {
		const proxy1 = new Proxy('192.168.1.1', 8080, 'user', 'pass');
		const proxy2 = new Proxy('192.168.1.2', 8080, 'user', 'pass');

		expect(proxy1.equals(proxy2)).toBe(false);
	});

	test('should correctly compare with a non-proxy object', () => {
		const proxy1 = new Proxy('192.168.1.1', 8080, 'user', 'pass');
		const nonProxyObject = {};
		
		expect(proxy1.equals(nonProxyObject)).toBe(false);
	});
});
