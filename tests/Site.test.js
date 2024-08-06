// tests/Site.test.js

const Site = require('../src/models/Site');
const Proxy = require('../src/models/Proxy');

describe('Site class', () => {
	test('should create a Site instance with valid URL and default timeout', () => {
		const site = new Site('https://example.com');

		expect(site.getUrl()).toBe('https://example.com');
		expect(site.getTimeout()).toBe(0);
		expect(site.getWorkingProxies()).toHaveLength(0);
		expect(site.getName()).toBe('example');
	});

	test('should create a Site instance with valid URL and specified timeout', () => {
		const site = new Site('https://example.com', 3000);

		expect(site.getUrl()).toBe('https://example.com');
		expect(site.getTimeout()).toBe(3000);
		expect(site.getWorkingProxies()).toHaveLength(0);
		expect(site.getName()).toBe('example');
	});

	test('should throw an error for an invalid URL', () => {
		expect(() => {
			new Site('invalid-url');
		}).toThrow('Invalid URL.');
	});

	test('should throw an error for an invalid timeout', () => {
		expect(() => {
			new Site('https://example.com', -1000);
		}).toThrow('Invalid timeout.');
	});

	test('should add a valid working proxy to the site', () => {
		const site = new Site('https://example.com');
		const proxy = new Proxy('192.168.1.1', 8080);

		site.addWorkingProxy(proxy);

		const workingProxies = site.getWorkingProxies();

		expect(workingProxies).toHaveLength(1);
		expect(workingProxies[0].getIp()).toBe('192.168.1.1');
		expect(workingProxies[0].getPort()).toBe(8080);
	});

	test('should throw an error when adding an invalid proxy', () => {
		const site = new Site('https://example.com');

		expect(() => {
			site.addWorkingProxy({});
		}).toThrow('Invalid proxy. Must be an instance of Proxy.');
	});

	test('should return the correct string representation', () => {
		const site = new Site('https://example.com', 3000);
		const proxy = new Proxy('192.168.1.1', 8080);

		site.addWorkingProxy(proxy);

		expect(site.toString()).toBe('Site { url: https://example.com, timeout: 3000, name: example, workingProxies: 1 }');
	});

	test('should correctly compare two equal sites', () => {
		const site1 = new Site('https://example.com', 3000);
		const site2 = new Site('https://example.com', 3000);
		
		expect(site1.equals(site2)).toBe(true);

		const proxy = new Proxy('192.168.1.1', 8080);

		site1.addWorkingProxy(proxy);
		site2.addWorkingProxy(proxy);

		expect(site1.equals(site2)).toBe(true);
	});

	test('should correctly compare two different sites', () => {
		const site1 = new Site('https://example.com', 3000);
		const site2 = new Site('https://example.com', 5000);

		expect(site1.equals(site2)).toBe(false);

		const proxy1 = new Proxy('192.168.1.1', 8080);
		const proxy2 = new Proxy('192.168.1.2', 8081);

		site1.addWorkingProxy(proxy1);
		site2.addWorkingProxy(proxy2);

		expect(site1.equals(site2)).toBe(false);
	});

	test('should correctly compare with a non-site object', () => {
		const site = new Site('https://example.com', 3000);
		const nonSiteObject = {};

		expect(site.equals(nonSiteObject)).toBe(false);
	});
});
