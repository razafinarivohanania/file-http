const os = require('os');
const ifaces = os.networkInterfaces();
const { getRandomInteger } = require('./number');

function getState(iface) {
    return 'IPv4' !== iface.family || iface.internal !== false;
}

module.exports.getIps = () => {
    const ips = [];

    Object.keys(ifaces).forEach(ifname => {

        ifaces[ifname].forEach(iface => ips.push({
            ip: iface.address,
            isLocal: getState(iface)
        }));
    });

    return ips.filter(ip => !ip.ip.includes(':'));
}

module.exports.getRandomPort = () => {
    return getRandomInteger(10000, 65535);
}  