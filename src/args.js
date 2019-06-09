const string = require('./string');
const network = require('./network');

function completeHost(args) {
    if (args.host)
        return;

    console.warn('No host is specifed');
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

function completePort(args) {
    if (args.port)
        return;

    console.warn('No port specified');
    const port = network.getRandomPort();
    console.log(`Random used port : ${port}`);
    args.port = port;
}

function completeFolder(args) {
    if (args.folder)
        return;

    console.warn('No specified folder');
    console.log('Current folder used as folder');
    args.folder = process.cwd();
}

function isValidName(name) {
    return [
        'host',
        'port',
        'folder'
    ].includes(name.toLowerCase());
}

function summarizeArgs(args){
    console.log('Summarized args :');
    const names = Object.keys(args);
    names.forEach(name => console.log(` > ${name} : ${args[name]}`));
}   

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