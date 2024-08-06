// src/utils/checker.js

const axios = require('axios');
const Site = require('../models/Site');
const Proxy = require('../models/Proxy');
const { createOutputDir, saveProxyToFile, saveProxyToAllSites } = require('./io');
const { HttpsProxyAgent } = require('https-proxy-agent');
const { HttpProxyAgent } = require('http-proxy-agent');

/**
 * Checks if a proxy can connect to a site.
 * 
 * @param {Site} site - The site to connect to.
 * @param {Proxy} proxy - The proxy to use for the connection.
 * @return {Promise<Proxy|null>} A promise that resolves to the proxy if the connection is successful, or null if it fails.
 * 
 * The function performs the following steps:
 * 1. Constructs the proxy configuration with the provided proxy details.
 * 2. Constructs the axios configuration with the provided site URL, timeout, and proxy configuration.
 * 3. Sends a GET request to the site using axios.
 * 4. If the response status is 200, returns the proxy; otherwise, returns null.
 * 5. Catches any errors during the request and returns null.
 */
async function checkProxyConnection(site, proxy) {
	try {
		// Construct the proxy URL
		const proxyUrl = `http://${proxy.getIp()}:${proxy.getPort()}`;
		const auth = proxy.getUsername() && proxy.getPassword() ? `${proxy.getUsername()}:${proxy.getPassword()}@` : '';
		const proxyFullUrl = auth ? `http://${auth}${proxy.getIp()}:${proxy.getPort()}` : proxyUrl;

		// Determine if the site URL uses HTTP or HTTPS
		const isHttps = site.getUrl().startsWith('https://');

		// Choose the correct agent based on the site URL protocol
		const agent = isHttps ? new HttpsProxyAgent(proxyFullUrl) : new HttpProxyAgent(proxyFullUrl);

		// Construct the axios configuration with the provided site URL, timeout, and proxy agent
		const axiosConfig = {
			method: 'get',
			url: site.getUrl(),
			timeout: site.getTimeout() || 0, // If no timeout is set, use 0 (no timeout)
			httpAgent: isHttps ? undefined : agent,
			httpsAgent: isHttps ? agent : undefined,
		};

		// Send a GET request to the site using axios
		const response = await axios(axiosConfig);

		// If the response status is 200, return the proxy; otherwise, return null
		if (response.status === 200) {
			return proxy;
		}
		
		return null;
	} 
	catch (error) {
		// Catch any errors during the request and return null
		return null;
	}
}

/**
 * Checks proxies for a list of sites and saves the results.
 * 
 * @param {Site|Site[]} sites - The site or list of sites to check.
 * @param {Proxy|Proxy[]} proxies - The proxy or list of proxies to use.
 * @return {Promise<void>} A promise that resolves when all proxies have been checked for all sites.
 * 
 * The function performs the following steps:
 * 1. Ensures the inputs are arrays.
 * 2. Creates the output directory and initializes files for each site.
 * 3. Logs the start of the proxy checking process.
 * 4. Creates a list of asynchronous tasks to check each proxy for all sites.
 * 5. For each proxy, checks its connection to each site:
 *    - If the proxy successfully connects to a site, saves the proxy for that site and adds it to the site's working proxies list.
 *    - If the proxy fails to connect to a site, marks it as not working for all sites.
 * 6. If the proxy works for all sites, saves the proxy to the "all sites" list.
 * 7. Waits for all proxy checking tasks to complete.
 * 8. Logs the completion of the proxy checking process.
 */
async function checkProxiesAndSave(sites, proxies) {
	// Ensure the inputs are arrays
	if (!Array.isArray(sites)) {
		sites = [sites];
	}
	if (!Array.isArray(proxies)) {
		proxies = [proxies];
	}

	// Create the output directory and initialize files for each site
	createOutputDir(sites);

	// Log the start of the proxy checking process
	console.log('Checking proxies...');

	// Create a list of asynchronous tasks to check each proxy for all sites
	const checkProxyTasks = proxies.map(async (proxy) => {
		let isProxyWorkingForAllSites = true;

		// For each proxy, check its connection to each site
		for (const site of sites) {
			const result = await checkProxyConnection(site, proxy);

			if (result) {
				// If the proxy successfully connects to a site, save the proxy for that site and add it to the site's working proxies list
				saveProxyToFile(site, proxy);
				site.addWorkingProxy(proxy);
			} 
			else {
				// If the proxy fails to connect to a site, mark it as not working for all sites
				isProxyWorkingForAllSites = false;
			}
		}

		// If the proxy works for all sites, save the proxy to the "all sites" list
		if (isProxyWorkingForAllSites) {
			saveProxyToAllSites(proxy);
		}
	});

	// Wait for all proxy checking tasks to complete
	await Promise.all(checkProxyTasks);

	// Log the completion of the proxy checking process
	console.log('Proxy checking complete.');
}

/**
 * Checks proxies for a list of sites without saving the results or creating directories.
 * 
 * @param {Site|Site[]} sites - The site or list of sites to check.
 * @param {Proxy|Proxy[]} proxies - The proxy or list of proxies to use.
 * @return {Promise<void>} A promise that resolves when all proxies have been checked for all sites.
 * 
 * The function performs the following steps:
 * 1. Ensures the inputs are arrays.
 * 2. Logs the start of the proxy checking process.
 * 3. Creates a list of asynchronous tasks to check each proxy for all sites.
 * 4. For each proxy, checks its connection to each site:
 *    - If the proxy successfully connects to a site, adds it to the site's working proxies list.
 * 5. Waits for all proxy checking tasks to complete.
 * 6. Logs the completion of the proxy checking process.
 */
async function checkProxies(sites, proxies) {
	// Ensure the inputs are arrays
	if (!Array.isArray(sites)) {
		sites = [sites];
	}
	if (!Array.isArray(proxies)) {
		proxies = [proxies];
	}

	// Log the start of the proxy checking process
	console.log('Checking proxies...');

	// Create a list of asynchronous tasks to check each proxy for all sites
	const checkProxyTasks = proxies.map(async (proxy) => {
		// For each proxy, check its connection to each site
		for (const site of sites) {
			const result = await checkProxyConnection(site, proxy);

			if (result) {
				// If the proxy successfully connects to a site, add it to the site's working proxies list
				site.addWorkingProxy(proxy);
			} 
		}
	});

	// Wait for all proxy checking tasks to complete
	await Promise.all(checkProxyTasks);

	// Log the completion of the proxy checking process
	console.log('Proxy checking complete.');
}

module.exports = {
	checkProxyConnection,
	checkProxiesAndSave,
	checkProxies
};
