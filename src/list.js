const file = require('./file');
const path = require('path');
const number = require('./number');
const queryString = require('query-string');
const string = require('./string');

/**
 * Get information of content
 * - is file or not
 * - size
 * - url
 * - name
 * and concat result as object
 * 
 * @param {String} content 
 * @param {String} absoluteFolder 
 * @param {String} subFolder 
 * @returns {Promise<Object>} adapted content
 */
async function adaptContent(content, absoluteFolder, subFolder) {
    const adaptedContent = {};
    const absolutePath = `${absoluteFolder}/${content}`;
    let value = await file.exists(absolutePath);
    if (!value) return;

    value = await file.isFile(absolutePath);
    if (adaptedContent.isFile = value) {
        const size = await file.getSize(absolutePath);
        adaptedContent.size = `${number.addSpaceByThousand(size)} o`;
    } else
        adaptedContent.size = '--- o';

    let currentPath = subFolder ?
        `${subFolder}/${content}` :
        content;
    const getParameter = queryString.stringify({ path: currentPath });
    adaptedContent.url = `/?${getParameter}`;
    adaptedContent.name = content;
    return adaptedContent;
}

/**
 * Get information of each content
 * 
 * @param {Array<String>} contents 
 * @param {String} absoluteFolder 
 * @param {String} subFolder 
 * @returns {Array<Object>} adapted contents
 */
async function adaptContents(contents, absoluteFolder, subFolder) {
    const folderContents = [];
    const fileContents = [];

    for (const content of contents) {
        const adaptedContent = await adaptContent(content, absoluteFolder, subFolder);
        if (!adaptedContent) continue;

        if (adaptedContent.isFile)
            fileContents.push(adaptedContent);
        else
            folderContents.push(adaptedContent);
    }

    folderContents.sort((content1, content2) => content1.name.localeCompare(content2.name));
    fileContents.sort((content1, content2) => content1.name.localeCompare(content2.name));
    return folderContents.concat(fileContents);
}

/**
 * List contents of folder like tree
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {Array<String>} args 
 */
async function listContents(req, res, args) {
    const subFolder = file.normalizePath(req.query.path);
    if (subFolder.startsWith('..')) {
        res.redirect('/empty');
        return;
    }

    const absoluteFolder = path.resolve(args.folder, subFolder);
    let value = await file.exists(absoluteFolder);
    if (!value) {
        res.redirect('/empty');
        return;
    }

    value = await file.isFile(absoluteFolder);
    if (value) {
        res.download(absoluteFolder);
        return;
    }

    value = await file.isFolder(absoluteFolder);
    if (!value) {
        res.redirect('/empty');
        return;
    }

    let contents = await file.getContentsFolder(absoluteFolder);
    if (!contents || !contents.length) {
        res.redirect('/empty');
        return;
    }

    contents = await adaptContents(contents, absoluteFolder, subFolder);
    if (contents.length)
        res.render('list', {
            parent: buildParent(subFolder),
            contents: contents
        });
    else
        res.redirect('/empty');
}

/**
 * Build parent folder based on sub folder
 * 
 * @param {String} subFolder
 * @return {Object} parent folder
 */
function buildParent(subFolder) {
    if (subFolder && !subFolder.includes('/'))
        return {
            exists: true,
            url: '/'
        };

    let urlParameter = string.substringBefore(subFolder, '/', true);
    const parent = { exists: !!urlParameter };
    
    if (parent.exists) {
        urlParameter = queryString.stringify({ path: urlParameter });
        parent.url = `/?${urlParameter}`;
    }
    
    return parent;
}

/**
 * List contents of folder like tree
 * 
 * @param {Request} req
 * @param {Response} res
 * @param {Array<String>} args
 */
module.exports = async (req, res, args) => {
    try {
        await listContents(req, res, args);
    } catch (error) {
        res.send(`Error occured : ${error}`);
    }
}