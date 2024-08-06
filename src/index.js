// src/index.js

const { checkProxiesAndSave, checkProxies } = require('./utils/checker');
const { readProxiesFromFile, readSitesFromFile, printWorkingProxies } = require('./utils/io');
const Site = require('./models/Site');
const Proxy = require('./models/Proxy');

module.exports = {
	checkProxiesAndSave,
	checkProxies,
	readProxiesFromFile,
	readSitesFromFile,
	printWorkingProxies,
	Site,
	Proxy
};
