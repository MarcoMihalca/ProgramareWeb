function add(a,b){
    console.log(arguments);
    return a+b;
}
function adunare (a, callback){
    a++;
    return callback(a,3);
}
add(3,4); // de fapt, aici nu se intampla nimic cu valoarea returnata
// doar se afiseaza parametrii receptionati din functia apelanta
console.log('res:' + adunare(1, add));