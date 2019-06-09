const fs = require('fs');

module.exports.exists = path => {
    return new Promise((resolve, reject) => {
        fs.stat(path, error => {
            if (error) {
                if (error.code == 'ENOENT')
                    resolve(false);
                else
                    reject(error);
            } else
                resolve(true);
        });
    });
}

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

module.exports.isFile = async path => {
    const value = await getPathType(path, true);
    return value;
}

module.exports.isFolder = async path => {
    const value = await getPathType(path, false);
    return value;
}

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

function addSpaceByThousand(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}