// src/utils/io.js

const fs = require('fs');
const path = require('path');
const Site = require('../models/Site');
const Proxy = require('../models/Proxy');

/**
 * Reads a file and creates an array of Proxy instances.
 * The input file should follow the convention:
 * 
 * ip:port:username:password
 * 
 * or
 * 
 * ip:port
 *
 * Each line represents a proxy with its IP address, corresponding port, and optional username and password separated by colons.
 * If the username and password are not provided, they default to null.
 * 
 * @param {string} filePath - The path to the file.
 * @return {Promise<Proxy[]>} A promise that resolves to an array of Proxy instances.
 */
function readProxiesFromFile(filePath) {
	return new Promise((resolve, reject) => {
		console.log('Starting to load proxies from file...');

		fs.readFile(filePath, 'utf8', (err, data) => {
			if (err) {
				return reject(err);
			}

			const lines = data.split('\n').filter(line => line.trim() !== '');

			const proxies = lines.map(line => {
				const [ip, port, username, password] = line.split(':');
				
				return new Proxy(ip, Number(port), username || null, password || null);
			});

			console.log('Finished loading proxies from file.');

			resolve(proxies);
		});
	});
}

/**
 * Reads a file and creates an array of Site instances.
 * The input file should follow the convention:
 * 
 * url timeout
 * 
 * or
 * 
 * url
 *
 * Each line represents a site with its URL and an optional timeout value separated by a space.
 * If the timeout is not provided, it defaults to 0 (no timeout).
 * 
 * @param {string} filePath - The path to the file.
 * @return {Promise<Site[]>} A promise that resolves to an array of Site instances.
 */
function readSitesFromFile(filePath) {
	return new Promise((resolve, reject) => {
		console.log('Starting to load sites from file...');

		fs.readFile(filePath, 'utf8', (err, data) => {
			if (err) {
				return reject(err);
			}

			const lines = data.split('\n').filter(line => line.trim() !== '');

			const sites = lines.map(line => {
				const [url, timeout] = line.split(' ');

				return new Site(url, timeout ? Number(timeout) : 0);
			});

			console.log('Finished loading sites from file.');

			resolve(sites);
		});
	});
}

/**
 * Prints the working proxies for a given site.
 * 
 * @param {Site} site - The site whose working proxies are to be printed.
 * 
 * The function performs the following steps:
 * 1. Retrieves the list of working proxies from the site.
 * 2. Iterates over the list of working proxies.
 * 3. Prints the string representation of each working proxy to the console.
 */
function printWorkingProxies(site) {
	// Retrieve the list of working proxies from the site
	const workingProxies = site.getWorkingProxies();

	// Iterate over the list of working proxies
	for (const proxy of workingProxies) {
		// Print the string representation of each working proxy to the console
		console.log(proxy.toString());
	}
}

/**
 * Creates the output directory and initializes files for each site.
 * 
 * @param {Site|Site[]} sites - The site or list of sites for which to create files.
 * 
 * The function performs the following steps:
 * 1. Ensures the input is an array of sites.
 * 2. Removes the old "working_proxies" directory if it exists.
 * 3. Creates a new "working_proxies" directory.
 * 4. Creates a file "all_sites.txt" listing the URLs of all sites.
 * 5. Creates an empty file for each site.
 */
function createOutputDir(sites) {
	console.log('Creating output directory...');

	// Ensure the input is an array of sites
	if (!Array.isArray(sites)) {
		sites = [sites];
	}

	const dir = 'working_proxies';

	// Remove the old directory if it exists
	if (fs.existsSync(dir)) {
		if (fs.rmSync) {
			fs.rmSync(dir, { recursive: true, force: true });
		} 
		else {
			fs.rmdirSync(dir, { recursive: true });
		}
	}

	// Create the new directory
	fs.mkdirSync(dir);

	// Create the "all_sites.txt" file
	const allSitesPath = path.join(dir, 'all_sites.txt');
	fs.writeFileSync(allSitesPath, '', 'utf8');

	// Create a file for each site
	sites.forEach(site => {
		const siteFilename = `${site.getName()}.txt`;
		const siteFilePath = path.join(dir, siteFilename);

		// Create an empty file for each site
		fs.writeFileSync(siteFilePath, '', 'utf8');
	});

	console.log('Finished creating output directory.');
}

/**
 * Saves a proxy to the file corresponding to the site.
 * 
 * @param {Site} site - The site for which the proxy should be saved.
 * @param {Proxy} proxy - The proxy to save.
 * 
 * The function performs the following steps:
 * 1. Constructs the path to the site's file in the "working_proxies" directory.
 * 2. Constructs the proxy string in the format "ip:port:username:password".
 *    - If the username and password are not provided, they are omitted from the string.
 * 3. Appends the proxy string to the site's file.
 */
function saveProxyToFile(site, proxy) {
	const dir = 'working_proxies';
	const siteFilename = `${site.getName()}.txt`;
	const siteFilePath = path.join(dir, siteFilename);

	// Construct the proxy string
	let proxyString = `${proxy.getIp()}:${proxy.getPort()}`;
	
	if (proxy.getUsername() || proxy.getPassword()) {
		proxyString += `:${proxy.getUsername() || ''}:${proxy.getPassword() || ''}`;
	}

	// Append the proxy string to the site's file
	fs.appendFileSync(siteFilePath, `${proxyString}\n`, 'utf8');
}

/**
 * Saves a proxy to the "all_sites.txt" file.
 * 
 * @param {Proxy} proxy - The proxy to save.
 * 
 * The function performs the following steps:
 * 1. Constructs the path to the "all_sites.txt" file in the "working_proxies" directory.
 * 2. Constructs the proxy string in the format "ip:port:username:password".
 *    - If the username and password are not provided, they are omitted from the string.
 * 3. Appends the proxy string to the "all_sites.txt" file.
 */
function saveProxyToAllSites(proxy) {
	const allSitesPath = path.join('working_proxies', 'all_sites.txt');

	// Construct the proxy string
	let proxyString = `${proxy.getIp()}:${proxy.getPort()}`;
	
	if (proxy.getUsername() || proxy.getPassword()) {
		proxyString += `:${proxy.getUsername() || ''}:${proxy.getPassword() || ''}`;
	}

	// Append the proxy string to the "all_sites.txt" file
	fs.appendFileSync(allSitesPath, `${proxyString}\n`, 'utf8');
}

module.exports = {
	readProxiesFromFile,
	readSitesFromFile,
	printWorkingProxies,
	createOutputDir,
	saveProxyToFile,
	saveProxyToAllSites
};