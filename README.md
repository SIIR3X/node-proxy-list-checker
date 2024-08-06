# Proxy List Checker - NodeJS

[![npm version](https://img.shields.io/npm/v/proxy-list-checker.svg)](https://www.npmjs.com/package/proxy-list-checker)
[![license](https://img.shields.io/npm/l/proxy-list-checker.svg)](https://github.com/SIIR3X/node-proxy-list-checker/blob/main/LICENSE)

A module to check the validity of proxies on various websites.


## Description

Proxy List Checker is a Node.js module that allows you to validate the availability and functionality of proxies by 
checking their ability to connect to different websites. It supports HTTP and HTTPS proxy protocols and provides 
detailed results on the connectivity and performance of each proxy. This tool is essential for maintaining a reliable 
list of working proxies for tasks such as web scraping, automation, and accessing geo-restricted content.


## Installation

You can install this module via npm:

```bash
npm install proxy-list-checker
```


## Dependencies

This project uses the following dependencies:

* `Node.js`: >= 20.11.1
* `axios`: ^1.7.3
* `http-proxy-agent`: ^7.0.2
* `https-proxy-agent`: ^7.0.5
* `jest`: (dev dependency): ^29.7.0
* `jsdoc`: (dev dependency): ^4.0.3


## Usage

### Manually creating variables

```js
// Single proxy and site
async function example() {
    const proxy = new Proxy('1.1.1.1', 8080);
    
    const site = new Site('https://example.com', 5000);
    
    await checkProxies(site, proxy);
    
    printWorkingProxies(site);
}

// Multiple proxies and sites
async function example() {
    const proxies = [
        new Proxy('1.1.1.1', 8080),
        new Proxy('2.2.2.2')
    ];
    
    const sites = [
        new Site('https://example.com', 5000),
        new Site('https://anotherexample.com')
    ];
    
    await checkProxies(sites, proxys);

    printWorkingProxies(site);
}
```

### Reading and saving variables from a file

```js
// Single proxy and site
async function example() {
    const proxy = await readProxiesFromFile('inputProxyFile.txt');
    
    const site = await readSitesFromFile('inputSiteFile.txt');
    
    await checkProxiesAndSave(site, proxy);
}

// Multiple proxies and sites
async function example() {
    const proxies = await readProxiesFromFile('inputProxyFile.txt');

    const sites = await readSitesFromFile('inputSiteFile.txt');

    await checkProxiesAndSave(sites, proxies);
}
```


## Methods

***readProxiesFromFile(filePath)***

Reads proxies from a file.

**Parameters:**

* `filePath` (string) - The path to the file containing proxies.

**Returns:**

* `Promise<Proxy[]>` - A promise that resolves to an array of `Proxy` instances.

**Notes:**

* The input file should follow the format `ip:port:username:password`.
* Each line represents a proxy with its ip and port, while the username and password are optional.

***readSitesFromFile(filePath)***

Reads sites from a file.

**Parameters:**

* `filePath` (string) - The path to the file containing sites.

**Returns:**

* `Promise<Site[]>` - A promise that resolves to an array of `Site` instances.

**Note:**

* The input file should follow the format `url tiemout`.
* Each line represents a site with its url, while the timeout (in ms) is optional.


***printWorkingProxies(site)***

Prints working proxies of a site to the console.

**Parameters:**

* `site` (Site) - The site whose list of proxies we want to display is valid.

**Returns:**

* `void` - This function does not return a value. It prints the proxies to the console.

***checkProxiesAndSave***

Verify the validity of the proxy list on the site list and register the results in the files.

**Parameters:**

* `sites` (Site | Site[]) - The site or list of sites to check.
* `proxies` (Proxy | Proxy[]) - The proxy or list of proxies to check.

**Returns:**

* `Promise<void>` - A promise that resolves when all proxies have been checked.

**Notes:**

* This function will create a `working proxies` folder in which it will create an `all_site.txt` file to store the 
proxies valid on all sites, as well as a file per site containing the list of proxies valid on that site.

***checkProxies***

Verify the validity of the proxy list on the site list.

**Parameters:**

* `sites` (Site | Site[]) - The site or list of sites to check.
* `proxies` (Proxy | Proxy[]) - The proxy or list of proxies to check.

**Returns:**

* `Promise<void>` - A promise that resolves when all proxies have been checked.

**Note:**

* This function will only check the validity of the proxies without displaying or saving anything, valid proxies 
* will be stored in the `workingProxies` array of each site.


## Scripts

**test**

```bash
npm test
```

**docs**

```bash
npm run docs
```

**example**

```bash
npm run example
```


## License

This project is licensed under the MIT License. See the `LICENSE` file for details.