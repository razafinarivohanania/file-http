module.exports.addSpaceByThousand = number => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

module.exports.getRandomInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
}   