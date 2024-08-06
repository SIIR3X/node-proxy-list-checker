const checker = require('../src/index');

/**
 * Example 1: Manually create a list of proxies and sites, check the proxies for the sites, and print the working proxies for the first site.
 */
async function example1() {
	// Manually create a list of proxies
	const proxies = [
		new checker.Proxy('138.204.20.160', 8080),
		new checker.Proxy('104.207.44.29', 3128)
	];

	// Manually create a list of sites
	const sites = [
		new checker.Site('http://example.com', 3000),
		new checker.Site('http://anotherexample.com', 5000)
	];
	
	// Check the proxies for the sites
	await checker.checkProxies(sites, proxies);

	// Print the working proxies for the first site
	checker.printWorkingProxies(sites[0]);
}

/**
 * Example 2: Read proxies and sites from files, check the proxies for the sites, and save the results.
 */
async function example2() {
	// Read the list of proxies from a file
	const proxies = await checker.readProxiesFromFile('examples/inputProxies.txt');

	// Read the list of sites from a file
	const sites = await checker.readSitesFromFile('examples/inputSites.txt');

	// Check the proxies for the sites and save the results
	await checker.checkProxiesAndSave(sites, proxies);
}

// Execute the example functions
(async () => {
	await example1();
	await example2();
})();