const axios = require('axios');
const BASE_URL = `https://community-open-weather-map.p.rapidapi.com`;

module.exports = {
    GET: (city, count, units) => axios({
        method: "GET",
        url: BASE_URL + `/forecast/daily`,
        headers: {
            'x-rapidapi-host': 'community-open-weather-map.p.rapidapi.com',
            'x-rapidapi-key': '92f91eef38mshc7e78513deee828p13e659jsn5b7b8fadb899',
            'useQueryString': true
        },
        params: {
            q: city,
            cnt: count,
            units: units
        }
    })
}