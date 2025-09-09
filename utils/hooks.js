function stringCommasToArray(stringWithCommas) {
    let array = [];

    if (stringWithCommas) {
        if (!stringWithCommas.includes(',')) {
            array = [stringWithCommas];
        } else {
            array = stringWithCommas
                .split(',')
                .map((id) => parseInt(id.trim(), 10));
        }
    }

    return array;
}

module.exports = { stringCommasToArray };
