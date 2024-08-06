// src/models/Proxy.js

/**
 * Class representing a proxy used to connect to sites.
 * 
 * @class
 */
class Proxy {
	#ip;
	#port;
	#username;
	#password;

	/**
	 * Create a Proxy.
	 * @param {string} ip - The IP address of the proxy.
	 * @param {number} port - The port number of the proxy.
	 * @param {string} [username=null] - The username for the proxy (default is null).
	 * @param {string} [password=null] - The password for the proxy (default is null).
	 */
	constructor(ip, port, username = null, password = null) {
		this.#setIp(ip);
		this.#setPort(port);
		this.#setUsername(username);
		this.#setPassword(password);
	}

	/**
	 * Set the IP address of the proxy. (Private method)
	 * @param {string} ip - The IP address to set.
	 * @private
	 */
	#setIp(ip) {
		if (this.#isValidIp(ip)) {
			this.#ip = ip;
		}
		else {
			this.#ip = null;
		}
	}

	/**
	 * Get the IP address of the proxy.
	 * @returns {string} The IP address of the proxy.
	 */
	getIp() {
		return this.#ip;
	}

	/**
	 * Set the port number of the proxy. (Private method)
	 * @param {number} port - The port number to set.
	 * @private
	 */
	#setPort(port) {
		if (this.#isValidPort(port)) {
			this.#port = port;
		}
		else {
			this.#port = null;
		}
	}

	/**
	 * Get the port number of the proxy.
	 * @returns {number} The port number of the proxy.
	 */
	getPort() {
		return this.#port;
	}

	/**
	 * Set the username for the proxy. (Private method)
	 * @param {string} username - The username to set.
	 * @private
	 */
	#setUsername(username) {
		this.#username = username;
	}

	/**
	 * Get the username for the proxy.
	 * @returns {string} The username for the proxy.
	 */
	getUsername() {
		return this.#username;
	}

	/**
	 * Set the password for the proxy. (Private method)
	 * @param {string} password - The password to set.
	 * @private
	 */
	#setPassword(password) {
		this.#password = password;
	}

	/**
	 * Get the password for the proxy.
	 * @returns {string} The password for the proxy.
	 */
	getPassword() {
		return this.#password;
	}

	/**
	 * Return a string representation of the proxy.
	 * @returns {string} A string representing the proxy.
	 */
	toString() {
		return `Proxy { ip: ${this.#ip}, port: ${this.#port}, username: ${this.#username}, password: ${this.#password} }`; 
	}

	/**
	 * Check if another proxy is equal to this one.
	 * @param {Proxy} otherProxy - The other proxy to compare.
	 * @returns {boolean} True if the proxies are equal, false otherwise.
	 */
	equals(otherProxy) {
		if (!(otherProxy instanceof Proxy)) {
			return false;
		}

		return this.#ip === otherProxy.getIp() &&
			   this.#port === otherProxy.getPort() &&
			   this.#username === otherProxy.getUsername() &&
			   this.#password === otherProxy.getPassword();
	}

	/**
	 * Validate an IP address.
	 * @param {string} ip - The IP address to validate.
	 * @returns {boolean} True if the IP address is valid, false otherwise.
	 * @private
	 */
	#isValidIp(ip) {
		const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

		const ipv6Regex = /^(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}$/;

		return ipv4Regex.test(ip) || ipv6Regex.test(ip);
	}

	/**
	 * Validate a port number.
	 * @param {number} port - The port number to validate.
	 * @returns {boolean} True if the port number is valid, false otherwise.
	 * @private
	 */
	#isValidPort(port) {
		const portNumber = Number(port);

		return Number.isInteger(portNumber) && portNumber > 0 && portNumber <= 65535;
	}
}

module.exports = Proxy;
