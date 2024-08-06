// src/models/Site.js

const Proxy = require('./Proxy');

/**
 * Class representing a site to be checked by proxies.
 * 
 * @class
 */
class Site {
	#url;
	#timeout;
	#workingProxies;
	#name;

	/**
	 * Create a Site.
	 * @param {string} url - The URL of the site.
	 * @param {number} [timeout=null] - The maximum time in milliseconds, or null for no timeout.
	 */
	constructor(url, timeout = 0) {
		this.#setUrl(url);
		this.#setTimeout(timeout);
		this.#setName();
		this.#workingProxies = [];
	}

	/**
	 * Set the URL of the site. (Private method)
	 * @param {string} url - The URL to set.
	 * @private
	 */
	#setUrl(url) {
		if (this.#isValidUrl(url)) {
			this.#url = url;
		}
		else {
			throw new Error('Invalid URL.');
		}
	}

	/**
	 * Get the URL of the site.
	 * @returns {string} The URL of the site.
	 */
	getUrl() {
		return this.#url;
	}

	/**
	 * Set the timeout of the site. (Private method)
	 * @param {number} timeout - The timeout in milliseconds to set, or null for no timeout.
	 * @private
	 */
	#setTimeout(timeout) {
		if (this.#isValidTimeout(timeout)) {
			this.#timeout = timeout;
		}
		else {
			throw new Error('Invalid timeout.');
		}
	}

	/**
	 * Get the timeout of the site.
	 * @returns {number|null} The timeout in milliseconds of the site, or null for no timeout.
	 */
	getTimeout() {
		return this.#timeout;
	}

	/**
	 * Set the name of the site based on its URL. (Private method)
	 * Sets the name only if the extracted name is not empty.
	 * @private
	 */
	#setName() {
		const name = this.#extractNameFromUrl(this.#url);

		if (name) {
			this.#name = name;
		}
	}

	/**
	 * Get the name of the site.
	 * @returns {string} The name of the site.
	 */
	getName() {
		return this.#name;
	}

	/**
	 * Add a working proxy to the list.
	 * @param {Proxy} proxy - The proxy to add.
	 */
	addWorkingProxy(proxy) {
		if (!(proxy instanceof Proxy)) {
			throw new Error('Invalid proxy. Must be an instance of Proxy.');
		}

		this.#workingProxies.push(proxy);
	}

	/**
	 * Get the list of working proxies.
	 * @returns {Proxy[]} The list of working proxies.
	 */
	getWorkingProxies() {
		return this.#workingProxies;
	}

	/**
	 * Return a string representation of the site.
	 * @returns {string} A string representing the site.
	 */
	toString() {
		return `Site { url: ${this.#url}, timeout: ${this.#timeout}, name: ${this.#name}, workingProxies: ${this.#workingProxies.length} }`;
	}

	/**
	 * Check if another site is equal to this one.
	 * @param {Site} otherSite - The other site to compare.
	 * @returns {boolean} True if the sites are equal, false otherwise.
	 */
	equals(otherSite) {
		if (!(otherSite instanceof Site)) {
			return false;
		}

		return this.#url === otherSite.getUrl() &&
			   this.#timeout === otherSite.getTimeout() &&
			   this.#workingProxies.length === otherSite.getWorkingProxies().length &&
			   this.#workingProxies.every((proxy, index) => proxy.equals(otherSite.getWorkingProxies()[index]));
	}

	/**
	 * Validate a URL.
	 * @param {string} url - The URL to validate.
	 * @returns {boolean} True if the URL is valid, false otherwise.
	 * @private
	 */
	#isValidUrl(url) {
		try {
			new URL(url);

			return true;
		} 
		catch (_) {
			return false;
		}
	}

	/**
	 * Validate a timeout.
	 * @param {number} timeout - The timeout to validate.
	 * @returns {boolean} True if the timeout is a positive integer, false otherwise.
	 * @private
	 */
	#isValidTimeout(timeout) {
		return Number.isInteger(timeout) && timeout >= 0;
	}

	/**
	 * Extract the name of the site from its URL. (Private method)
	 * @param {string} url - The URL to extract the name from.
	 * @returns {string} The name of the site.
	 * @private
	 */
	#extractNameFromUrl(url) {
		const { hostname } = new URL(url);
		
		const parts = hostname.split('.');
		const name = parts.slice(-2, -1)[0];

		return name.replace('www.', '');
	}
}

module.exports = Site;
