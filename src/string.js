/**
* Substring text before first/last occurence of search
* 
* @param {String} text
* @param {String} search
* @param {boolean} isLast
* @returns {String} substring value
*/
module.exports.substringBefore = (text, search, isLast) => {
    const position = isLast ?
        text.lastIndexOf(search) :
        text.indexOf(search);

    return position < 0 ?
        text :
        text.substr(0, position);
};

/**
* Substring text after first/last occurence of search
* 
* @param {String} text
* @param {String} search
* @returns {String} substring value
*/
module.exports.substringAfter = (text, search, isLast) => {
    const position = isLast ?
        text.lastIndexOf(search) :
        text.indexOf(search);

    return position < 0 ?
        '' :
        text.substring(position + search.length);
}