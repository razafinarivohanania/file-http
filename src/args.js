const string = require('./string');
const network = require('./network');
const file = require('./file');

/**
 * Check if host is found on args
 * If not :
 * - use intranet host if found
 * If not :
 * - use localhost
 * 
 * @param {Array<String>} args 
 */
function completeHost(args) {
    if (args.host)
        return;

    console.warn('No host is specified');
    console.log('Checking all available hosts ...');
    const ips = network.getIps();
    if (!ips || !ips.length)
        throw new Error('No available host found');

    ips.forEach(ip => console.log(` > ${ip.ip}`));
    console.log('Choosing one of host ...');
    let ipToUsed;
    for (const ip of ips) {
        if (!ip.isLocal) {
            ipToUsed = ip.ip;
            break;
        }
    }

    if (!ipToUsed)
        ipToUsed = ips[0].ip;

    console.log(`Choosen host : ${ipToUsed}`);

    args.host = ipToUsed;
}

/**
 * Check if port is found on args
 * If not : use random port
 * 
 * @param {Array<String>} args 
 */
function completePort(args) {
    if (args.port)
        return;

    console.warn('No port specified');
    const port = network.getRandomPort();
    console.log(`Random used port : ${port}`);
    args.port = port;
}

/**
 * Check if folder is found on args
 * If not : use current opening folder
 * 
 * @param {Array<String>} args 
 */
function completeFolder(args) {
    args.folder = file.normalizePath(args.folder);

    if (args.folder)
        return;
        
    console.warn('No specified folder');
    console.log('Current folder used as folder');
    args.folder = file.normalizePath(process.cwd());
}

/**
 * Verify if unknown argument is present
 * 
 * @param {String} name
 * @returns {boolean}
 */
function isValidName(name) {
    return [
        'host',
        'port',
        'folder'
    ].includes(name.toLowerCase());
}

/**
 * Print all args on console
 * 
 * @param {Array<String>} args 
 */
function summarizeArgs(args){
    console.log('Summarized args :');
    const names = Object.keys(args);
    names.forEach(name => console.log(` > ${name} : ${args[name]}`));
}   

/**
 * Parse args as JSON
 * 
 * It accepts :
 *      folder=[path of folder] (eg: /home/)
 *      host=[value of host] (eg : 127.0.0.1)
 *      port=[value of port] (eg: 4000)
 * 
 * These parameters are not mandatory :
 *      folder absent => using current folder
 *      host absent => use intranet host or localhost
 *      port absent => use random port
 * 
 * @returns {Object} args
 */
module.exports = () => {
    const nativeArgs = process.argv.slice(2);
    const args = {};
    nativeArgs.forEach(nativeArg => {
        const name = string.substringBefore(nativeArg, '=');
        if (!isValidName(name))
            throw new Error(`Invalid argument name [${name}]`);

        const value = string.substringAfter(nativeArg, '=');
        args[name] = value;
    });

    completeHost(args);
    completePort(args);
    completeFolder(args);
    summarizeArgs(args);

    return args;
}