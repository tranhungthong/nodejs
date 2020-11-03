const axios = require('axios');

module.exports.Get10Day = (city, count, units) => {
    return axios({
        method: "GET",
        url: `https://community-open-weather-map.p.rapidapi.com/forecast/daily`,
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

module.exports.GetCurrent = (city, units) => {
    return axios({
        method: "GET",
        url: `https://rapidapi.p.rapidapi.com/weather`,
        headers: {
            'x-rapidapi-host': 'community-open-weather-map.p.rapidapi.com',
            'x-rapidapi-key': '92f91eef38mshc7e78513deee828p13e659jsn5b7b8fadb899',
            'useQueryString': true
        },
        params: {
            q: city,
            units: units
        }
    })
}


// api key: ecfd14db5fmsha285bd7ce1ddfc0p1fa9bbjsn63b0f1ed45fe