// tests/io.test.js

const fs = require('fs');
const path = require('path');
const { readProxiesFromFile, readSitesFromFile, printWorkingProxies, createOutputDir, saveProxyToFile, saveProxyToAllSites } = require('../src/utils/io');
const Site = require('../src/models/Site');
const Proxy = require('../src/models/Proxy');

// Mock the fs.readFile and fs.writeFile functions
jest.mock('fs');

describe('IO Utils', () => {
	describe('readProxiesFromFile', () => {
		beforeEach(() => {
			jest.resetAllMocks();
			console.log = jest.fn(); // Mock console.log
		});
	
		afterEach(() => {
			jest.resetAllMocks();
		});
	
		test('should read proxies from a file and return a list of Proxy instances', async () => {
			const fileContent = `192.168.1.1:8080:user1:pass1\n192.168.1.2:8081:user2:pass2\n`;
	
			fs.readFile.mockImplementation((filePath, encoding, callback) => {
				callback(null, fileContent);
			});
	
			const proxies = await readProxiesFromFile('proxies.txt');
	
			expect(proxies).toHaveLength(2);
			expect(proxies[0].getIp()).toBe('192.168.1.1');
			expect(proxies[0].getPort()).toBe(8080);
			expect(proxies[0].getUsername()).toBe('user1');
			expect(proxies[0].getPassword()).toBe('pass1');
			expect(proxies[1].getIp()).toBe('192.168.1.2');
			expect(proxies[1].getPort()).toBe(8081);
			expect(proxies[1].getUsername()).toBe('user2');
			expect(proxies[1].getPassword()).toBe('pass2');
		});
	
		test('should handle files with empty lines', async () => {
			const fileContent = `192.168.1.1:8080:user1:pass1\n\n192.168.1.2:8081:user2:pass2\n`;
	
			fs.readFile.mockImplementation((filePath, encoding, callback) => {
				callback(null, fileContent);
			});
	
			const proxies = await readProxiesFromFile('proxies.txt');
	
			expect(proxies).toHaveLength(2);
			expect(proxies[0].getIp()).toBe('192.168.1.1');
			expect(proxies[0].getPort()).toBe(8080);
			expect(proxies[0].getUsername()).toBe('user1');
			expect(proxies[0].getPassword()).toBe('pass1');
			expect(proxies[1].getIp()).toBe('192.168.1.2');
			expect(proxies[1].getPort()).toBe(8081);
			expect(proxies[1].getUsername()).toBe('user2');
			expect(proxies[1].getPassword()).toBe('pass2');
		});
	
		test('should handle files with missing username and password', async () => {
			const fileContent = `192.168.1.1:8080\n192.168.1.2:8081\n`;
	
			fs.readFile.mockImplementation((filePath, encoding, callback) => {
				callback(null, fileContent);
			});
	
			const proxies = await readProxiesFromFile('proxies.txt');
	
			expect(proxies).toHaveLength(2);
			expect(proxies[0].getIp()).toBe('192.168.1.1');
			expect(proxies[0].getPort()).toBe(8080);
			expect(proxies[0].getUsername()).toBeNull();
			expect(proxies[0].getPassword()).toBeNull();
			expect(proxies[1].getIp()).toBe('192.168.1.2');
			expect(proxies[1].getPort()).toBe(8081);
			expect(proxies[1].getUsername()).toBeNull();
			expect(proxies[1].getPassword()).toBeNull();
		});
	
		test('should handle file read errors', async () => {
			const errorMessage = 'File not found';
	
			fs.readFile.mockImplementation((filePath, encoding, callback) => {
				callback(new Error(errorMessage), null);
			});
	
			await expect(readProxiesFromFile('nonexistent.txt')).rejects.toThrow(errorMessage);
		});
	});

	describe('readSitesFromFile', () => {
		beforeEach(() => {
			jest.resetAllMocks();
			console.log = jest.fn(); // Mock console.log
		});

		afterEach(() => {
			jest.resetAllMocks();
		});

		test('should read sites from a file and return a list of Site instances', async () => {
			const fileContent = `https://example.com 5000\nhttps://anotherexample.com 3000\n`;

			fs.readFile.mockImplementation((filePath, encoding, callback) => {
				callback(null, fileContent);
			});

			const sites = await readSitesFromFile('sites.txt');

			expect(console.log).toHaveBeenCalledWith('Starting to load sites from file...');
			expect(console.log).toHaveBeenCalledWith('Finished loading sites from file.');

			expect(sites).toHaveLength(2);
			expect(sites[0].getUrl()).toBe('https://example.com');
			expect(sites[0].getTimeout()).toBe(5000);
			expect(sites[1].getUrl()).toBe('https://anotherexample.com');
			expect(sites[1].getTimeout()).toBe(3000);
		});

		test('should handle files with empty lines', async () => {
			const fileContent = `https://example.com 5000\n\nhttps://anotherexample.com 3000\n`;

			fs.readFile.mockImplementation((filePath, encoding, callback) => {
				callback(null, fileContent);
			});

			const sites = await readSitesFromFile('sites.txt');

			expect(console.log).toHaveBeenCalledWith('Starting to load sites from file...');
			expect(console.log).toHaveBeenCalledWith('Finished loading sites from file.');

			expect(sites).toHaveLength(2);
			expect(sites[0].getUrl()).toBe('https://example.com');
			expect(sites[0].getTimeout()).toBe(5000);
			expect(sites[1].getUrl()).toBe('https://anotherexample.com');
			expect(sites[1].getTimeout()).toBe(3000);
		});

		test('should handle files with missing timeout', async () => {
			const fileContent = `https://example.com\nhttps://anotherexample.com 3000\n`;

			fs.readFile.mockImplementation((filePath, encoding, callback) => {
				callback(null, fileContent);
			});

			const sites = await readSitesFromFile('sites.txt');

			expect(console.log).toHaveBeenCalledWith('Starting to load sites from file...');
			expect(console.log).toHaveBeenCalledWith('Finished loading sites from file.');

			expect(sites).toHaveLength(2);
			expect(sites[0].getUrl()).toBe('https://example.com');
			expect(sites[0].getTimeout()).toBe(0); // Default timeout
			expect(sites[1].getUrl()).toBe('https://anotherexample.com');
			expect(sites[1].getTimeout()).toBe(3000);
		});

		test('should handle file read errors', async () => {
			const errorMessage = 'File not found';

			fs.readFile.mockImplementation((filePath, encoding, callback) => {
				callback(new Error(errorMessage), null);
			});

			await expect(readSitesFromFile('nonexistent.txt')).rejects.toThrow(errorMessage);

			expect(console.log).toHaveBeenCalledWith('Starting to load sites from file...');
		});
	});

	describe('printWorkingProxies', () => {
		let site;
		let proxy1, proxy2;
	
		beforeEach(() => {
			site = new Site('http://example.com');
			proxy1 = new Proxy('192.168.1.1', 8080, 'user1', 'pass1');
			proxy2 = new Proxy('192.168.1.2', 8081, 'user2', 'pass2');
			site.addWorkingProxy(proxy1);
			site.addWorkingProxy(proxy2);
	
			// Mock console.log
			jest.spyOn(console, 'log').mockImplementation(() => {});
		});
	
		afterEach(() => {
			// Restore console.log
			console.log.mockRestore();
		});
	
		test('should print all working proxies for the site', () => {
			printWorkingProxies(site);
	
			expect(console.log).toHaveBeenCalledWith(proxy1.toString());
			expect(console.log).toHaveBeenCalledWith(proxy2.toString());
			expect(console.log).toHaveBeenCalledTimes(2);
		});
	
		test('should not print anything if there are no working proxies', () => {
			const emptySite = new Site('http://example.org');
	
			printWorkingProxies(emptySite);
	
			expect(console.log).not.toHaveBeenCalled();
		});
	});

	describe('createOutputDir', () => {
		beforeEach(() => {
			jest.resetAllMocks();
			console.log = jest.fn(); // Mock console.log
		});
	
		afterEach(() => {
			jest.resetAllMocks();
		});
	
		test('should create the working_proxies directory', () => {
			fs.existsSync.mockReturnValue(false);
			fs.mkdirSync.mockImplementation(() => {});
			
			const sites = [
				new Site('https://example1.com', 5000),
				new Site('https://example2.com', 3000)
			];
	
			createOutputDir(sites);
	
			expect(console.log).toHaveBeenCalledWith('Creating output directory...');
			expect(console.log).toHaveBeenCalledWith('Finished creating output directory.');
			expect(fs.mkdirSync).toHaveBeenCalledWith('working_proxies');
		});
	
		test('should create the all_sites.txt file', () => {
			fs.existsSync.mockReturnValue(false);
			fs.mkdirSync.mockImplementation(() => {});
			fs.writeFileSync.mockImplementation(() => {});
	
			const sites = [
				new Site('https://example1.com', 5000),
				new Site('https://example2.com', 3000)
			];
	
			createOutputDir(sites);
	
			expect(console.log).toHaveBeenCalledWith('Creating output directory...');
			expect(console.log).toHaveBeenCalledWith('Finished creating output directory.');
			const allSitesPath = path.join('working_proxies', 'all_sites.txt');
			expect(fs.writeFileSync).toHaveBeenCalledWith(allSitesPath, '', 'utf8');
		});
	
		test('should create a file for each site', () => {
			fs.existsSync.mockReturnValue(false);
			fs.mkdirSync.mockImplementation(() => {});
			fs.writeFileSync.mockImplementation(() => {});
	
			const sites = [
				new Site('https://example1.com', 5000),
				new Site('https://example2.com', 3000)
			];
	
			createOutputDir(sites);
	
			expect(console.log).toHaveBeenCalledWith('Creating output directory...');
			expect(console.log).toHaveBeenCalledWith('Finished creating output directory.');
	
			sites.forEach(site => {
				const siteFilename = `${site.getName()}.txt`;
				const siteFilePath = path.join('working_proxies', siteFilename);
				expect(fs.writeFileSync).toHaveBeenCalledWith(siteFilePath, '', 'utf8');
			});
		});
	
		test('should remove the old working_proxies directory if it exists', () => {
			fs.existsSync.mockReturnValue(true);
			fs.rmSync.mockImplementation(() => {});
			fs.mkdirSync.mockImplementation(() => {});
			fs.writeFileSync.mockImplementation(() => {});
	
			const oldFilePath = path.join('working_proxies', 'old_file.txt');
	
			const sites = [
				new Site('https://example1.com', 5000),
				new Site('https://example2.com', 3000)
			];
	
			createOutputDir(sites);
	
			expect(console.log).toHaveBeenCalledWith('Creating output directory...');
			expect(console.log).toHaveBeenCalledWith('Finished creating output directory.');
			expect(fs.rmSync).toHaveBeenCalledWith('working_proxies', { recursive: true, force: true });
			const newFilePath = path.join('working_proxies', 'example1.txt');
			expect(fs.writeFileSync).toHaveBeenCalledWith(newFilePath, '', 'utf8');
		});
	
		test('should handle creating output directory with a single site', () => {
			fs.existsSync.mockReturnValue(false);
			fs.mkdirSync.mockImplementation(() => {});
			fs.writeFileSync.mockImplementation(() => {});
	
			const site = new Site('https://single-site.com', 1000);
	
			createOutputDir(site);
	
			expect(console.log).toHaveBeenCalledWith('Creating output directory...');
			expect(console.log).toHaveBeenCalledWith('Finished creating output directory.');
	
			expect(fs.mkdirSync).toHaveBeenCalledWith('working_proxies');
			const siteFilePath = path.join('working_proxies', 'single-site.txt');
			expect(fs.writeFileSync).toHaveBeenCalledWith(siteFilePath, '', 'utf8');
		});
	
		test('should handle creating output directory with empty site list', () => {
			fs.existsSync.mockReturnValue(false);
			fs.mkdirSync.mockImplementation(() => {});
			fs.writeFileSync.mockImplementation(() => {});
	
			createOutputDir([]);
	
			expect(console.log).toHaveBeenCalledWith('Creating output directory...');
			expect(console.log).toHaveBeenCalledWith('Finished creating output directory.');
	
			expect(fs.mkdirSync).toHaveBeenCalledWith('working_proxies');
			const allSitesPath = path.join('working_proxies', 'all_sites.txt');
			expect(fs.writeFileSync).toHaveBeenCalledWith(allSitesPath, '', 'utf8');
		});
	});

	describe('saveProxyToFile', () => {
		beforeEach(() => {
			jest.resetAllMocks();
			console.log = jest.fn(); // Mock console.log
		});
	
		afterEach(() => {
			jest.resetAllMocks();
		});
	
		test('should append a proxy to the site file with username and password', () => {
			const site = new Site('https://example.com', 5000);
			const proxy = new Proxy('192.168.1.1', 8080, 'user1', 'pass1');
			saveProxyToFile(site, proxy);
	
			const siteFilePath = path.join('working_proxies', `${site.getName()}.txt`);
			const proxyString = '192.168.1.1:8080:user1:pass1\n';
			
			expect(fs.appendFileSync).toHaveBeenCalledWith(siteFilePath, proxyString, 'utf8');
		});
	
		test('should append a proxy to the site file without username and password', () => {
			const site = new Site('https://example.com', 5000);
			const proxy = new Proxy('192.168.1.2', 8081);
			saveProxyToFile(site, proxy);
	
			const siteFilePath = path.join('working_proxies', `${site.getName()}.txt`);
			const proxyString = '192.168.1.2:8081\n';
			
			expect(fs.appendFileSync).toHaveBeenCalledWith(siteFilePath, proxyString, 'utf8');
		});
	
		test('should append a proxy to the site file with only username', () => {
			const site = new Site('https://example.com', 5000);
			const proxy = new Proxy('192.168.1.3', 8082, 'user2');
			saveProxyToFile(site, proxy);
	
			const siteFilePath = path.join('working_proxies', `${site.getName()}.txt`);
			const proxyString = '192.168.1.3:8082:user2:\n';
			
			expect(fs.appendFileSync).toHaveBeenCalledWith(siteFilePath, proxyString, 'utf8');
		});
	
		test('should append a proxy to the site file with only password', () => {
			const site = new Site('https://example.com', 5000);
			const proxy = new Proxy('192.168.1.4', 8083, null, 'pass3');
			saveProxyToFile(site, proxy);
	
			const siteFilePath = path.join('working_proxies', `${site.getName()}.txt`);
			const proxyString = '192.168.1.4:8083::pass3\n';
			
			expect(fs.appendFileSync).toHaveBeenCalledWith(siteFilePath, proxyString, 'utf8');
		});
	
		test('should handle file append errors', () => {
			const site = new Site('https://example.com', 5000);
			const proxy = new Proxy('192.168.1.5', 8084, 'user4', 'pass4');
			const errorMessage = 'File append error';
			
			fs.appendFileSync.mockImplementation(() => {
				throw new Error(errorMessage);
			});
	
			expect(() => saveProxyToFile(site, proxy)).toThrow(errorMessage);
		});
	});

	describe('saveProxyToAllSites', () => {
		beforeEach(() => {
			jest.resetAllMocks();
			console.log = jest.fn(); // Mock console.log
		});
	
		afterEach(() => {
			jest.resetAllMocks();
		});
	
		test('should append a proxy to the all_sites.txt file with username and password', () => {
			const proxy = new Proxy('192.168.1.1', 8080, 'user1', 'pass1');
			saveProxyToAllSites(proxy);
	
			const allSitesPath = path.join('working_proxies', 'all_sites.txt');
			const proxyString = '192.168.1.1:8080:user1:pass1\n';
			
			expect(fs.appendFileSync).toHaveBeenCalledWith(allSitesPath, proxyString, 'utf8');
		});
	
		test('should append a proxy to the all_sites.txt file without username and password', () => {
			const proxy = new Proxy('192.168.1.2', 8081);
			saveProxyToAllSites(proxy);
	
			const allSitesPath = path.join('working_proxies', 'all_sites.txt');
			const proxyString = '192.168.1.2:8081\n';
			
			expect(fs.appendFileSync).toHaveBeenCalledWith(allSitesPath, proxyString, 'utf8');
		});
	
		test('should append a proxy to the all_sites.txt file with only username', () => {
			const proxy = new Proxy('192.168.1.3', 8082, 'user2');
			saveProxyToAllSites(proxy);
	
			const allSitesPath = path.join('working_proxies', 'all_sites.txt');
			const proxyString = '192.168.1.3:8082:user2:\n';
			
			expect(fs.appendFileSync).toHaveBeenCalledWith(allSitesPath, proxyString, 'utf8');
		});
	
		test('should append a proxy to the all_sites.txt file with only password', () => {
			const proxy = new Proxy('192.168.1.4', 8083, null, 'pass3');
			saveProxyToAllSites(proxy);
	
			const allSitesPath = path.join('working_proxies', 'all_sites.txt');
			const proxyString = '192.168.1.4:8083::pass3\n';
			
			expect(fs.appendFileSync).toHaveBeenCalledWith(allSitesPath, proxyString, 'utf8');
		});
	
		test('should handle file append errors', () => {
			const proxy = new Proxy('192.168.1.5', 8084, 'user4', 'pass4');
			const errorMessage = 'File append error';
			
			fs.appendFileSync.mockImplementation(() => {
				throw new Error(errorMessage);
			});
	
			expect(() => saveProxyToAllSites(proxy)).toThrow(errorMessage);
		});
	});
});
