const os = require('os');
const ifaces = os.networkInterfaces();
const { getRandomInteger } = require('./number');

/**
 * Check if IP is local or not
 * 
 * @param {Object} iface 
 * @returns {boolean} value
 */
function getState(iface) {
    return 'IPv4' !== iface.family || iface.internal !== false;
}

/**
 * Get available IP on machine
 * 
 * @returns {Array<Object>} list of IPs
 */
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

/**
 * Get random port between 10 000 and 65 535 value
 * 
 * @return {int} port
 */
module.exports.getRandomPort = () => {
    return getRandomInteger(10000, 65535);
}  