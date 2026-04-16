module.exports = function (word) {
    var reversed = '';
    var i = word.length - 1;
    
    while (i > -1) {
        var letter = word[i];
        reversed += letter;
        i--;
    }
    
    return reversed;
};