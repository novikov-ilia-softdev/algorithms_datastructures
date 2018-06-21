module.exports = {};

var utils = require( './utils/utils')

module.exports.sort = sort

function sort(array) {
    if (array.length <= 1) {
        return array;
    }

    var pivot = array[0];

    var left = [];
    var right = [];

    for (var i = 1; i < array.length; i++) {
        array[i] < pivot ? left.push(array[i]) : right.push(array[i]);
    }

    return sort(left).concat(pivot, sort(right));
};