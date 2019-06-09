const file = require('./file');
const path = require('path');
const number = require('./number');
const queryString = require('query-string');

async function adaptContent(content, absoluteFolder, subFolder) {
    const adaptedContent = {};
    const absolutePath = `${absoluteFolder}/${content}`;
    const value = await file.isFile(absolutePath);

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

async function adaptContents(contents, absoluteFolder, subFolder) {
    const folderContents = [];
    const fileContents = [];

    for (const content of contents) {
        const adaptedContent = await adaptContent(content, absoluteFolder, subFolder);
        if (adaptedContent.isFile)
            fileContents.push(adaptedContent);
        else
            folderContents.push(adaptedContent);
    }

    folderContents.sort((content1, content2) => content1.name.localeCompare(content2.name));
    fileContents.sort((content1, content2) => content1.name.localeCompare(content2.name));
    return folderContents.concat(fileContents);
}

function getSubFolder(req) {
    let subFolder = req.query.path;
    if (!subFolder)
        subFolder = '';

    return subFolder
        .replace(/^[\\\//]+/g, '')
        .replace(/\\+/g, '\/');;
}

async function listContents(req, res, args){
    const subFolder = getSubFolder(req);
    if (subFolder.startsWith('..')){
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
    res.render('list', { contents: contents });
}

module.exports = async (req, res, args) => {
    try {
        await listContents(req, res, args);
    } catch (error) {
        res.send(`Error occured : ${error}`);
    }
}