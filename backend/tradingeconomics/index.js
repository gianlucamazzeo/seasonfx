const axios = require('axios');
(async () => {
    const api_key = '5d246e81b173476:2wex3wben8nmnr5'
    const response = await axios.get(`https://api.tradingeconomics.com/forecast/country/usa/indicator/gdp,population?c=${api_key}`)
    console.log(response.data)
})()
