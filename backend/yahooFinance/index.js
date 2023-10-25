const yahooFinance = require('yahoo-finance2').default;
const fetch = require("node-fetch");

// Crea una funzione asincrona che esegue la query su Yahoo Finance con parametri personalizzati
async function getHistoricalData(symbol, queryOptions) {
    const results = await yahooFinance.historical(symbol, queryOptions);
    return results;
  }
  
  module.exports = { getHistoricalData };

/*
(async function() {
    
  //  const results = await yahooFinance.search('AAPL');
  const queryOptions = {
    period1: '2023-10-16',
    period2: '2023-10-18',
    interval: '1d',
    events: 'history'
  }
  const results = await yahooFinance.historical('EURUSD=X', queryOptions);
    console.log(results)
})();
*/

// Esegui la richiesta per ottenere la quotazione di ieri



