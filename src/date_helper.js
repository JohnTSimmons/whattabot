require('dotenv').config();

function get_date(){
    const date = new Date();
    const year = date.toLocaleString("en-US", { timeZone: process.env.TIME_ZONE, year: "2-digit" });
    const month =  date.toLocaleString("en-US", { timeZone: process.env.TIME_ZONE, month: "2-digit" });
    const day = date.toLocaleString("en-US", { timeZone: process.env.TIME_ZONE, day: "2-digit" });
    const date_formatted = year + '-' + month + '-' + day;
    return date_formatted;
}

module.exports = {
    get_date
}