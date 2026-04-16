module.exports = function(forbidden_day) { 
    var days = ['Sunday', 'Monday', 'Tueday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']; 
    return function(req, res, next) { 
        // get the current day 
        var day = new Date().getDay(); 
        // check if the current day is the forbidden day  
        if (days[day] === forbidden_day) { 
            res.send('No visitors allowed on ' + forbidden_day + 's!'); } 
                // call the next middleware 
            else { 
            next();  
        } 
    }
}