const fs = require('fs');

/**
 * Check if path exists
 * Note : access denied path will be considered as absent
 * 
 * @param {String} path
 * @returns {Promise<boolean>} value
 */
module.exports.exists = path => {
    return new Promise((resolve, reject) => {
        fs.stat(path, error => {
            if (error) {
                if (error.code == 'ENOENT' || error.code == 'EPERM')
                    resolve(false);
                else
                    reject(error);
            } else
                resolve(true);
        });
    });
}

/**
 * Check if path is a file or a folder
 * 
 * @param {String} path 
 * @param {boolean} isFileTest 
 * @returns {Promise<boolean>} value
 */
function getPathType(path, isFileTest) {
    return new Promise((resolve, reject) => {
        fs.stat(path, (error, stats) => {
            if (error) {
                reject(error);
                return;
            }

            if (isFileTest)
                resolve(stats.isFile());
            else
                resolve(stats.isDirectory());
        });
    });
}

/**
 * Check if path is a file
 * 
 * @param {String} path
 * @returns {Promise<boolean>} value
 */
module.exports.isFile = async path => {
    const value = await getPathType(path, true);
    return value;
}

/**
 * Check if path is a boolean
 * 
 * @param {String} path
 * @returns {Promise<boolean>} value
 */
module.exports.isFolder = async path => {
    const value = await getPathType(path, false);
    return value;
}

/**
 * Get list of containing folder as String array
 * 
 * @param {String} path
 * @returns {Array<String>} contents
 */
module.exports.getContentsFolder = path => {
    return new Promise((resolve, reject) => {
        fs.readdir(path, (error, files) => {
            if (error)
                reject(error);
            else
                resolve(files);
        });
    });
}

/**
 * Get size of file or folder
 * Note : deprecated for folder
 * 
 * @param {String} path
 * @returns {int} size
 */
module.exports.getSize = path => {
    return new Promise((resolve, reject) => {
        fs.stat(path, (error, stats) => {
            if (error)
                reject(error);
            else
                resolve(stats.size);
        });
    });
}

/**
 * Convert path like linux format
 * 
 * @param {String} path
 * @return {String} converted path
 */
module.exports.normalizePath = path => {
    if (!path)
        return '';

    return path
        .replace(/^[\\\//]+/g, '')
        .replace(/\\+/g, '\/');
}