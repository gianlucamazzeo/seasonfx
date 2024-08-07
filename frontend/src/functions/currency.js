import axios from "axios";

export const getCurrencies = async () =>
  await axios.get(`${process.env.REACT_APP_API}/currencies`);


export const getDataCurrency = async (slug) => 
// http://localhost:8000/api/oanda/instruments/EUR_USD/2022-06-01/2022-06-30/D
  await axios.get(`${process.env.REACT_APP_API}/oanda/update`);


export const getLocalDataCurrency = async ({id,fromData,toData,granularity}, authtoken) => 
  await axios.get(`${process.env.REACT_APP_API}/currency-local/${id}/${fromData}/${toData}/${granularity}`,{
    headers: {
      authtoken,
    },
  });

  export const getLocalCurrentDataCurrency = async ({id,fromData,toData,granularity}, authtoken) => 
  await axios.get(`${process.env.REACT_APP_API}/currency-current-local/${id}/${fromData}/${toData}/${granularity}`,{
    headers: {
      authtoken,
    },
  });

  /*
export const getMostRecentDate = async (authtoken) =>
await axios.get(`${process.env.REACT_APP_API}/mostRecentDate`, {
  headers: {
    authtoken
  }
});
*/



export const getCurrency = async (slug) =>
  await axios.get(`${process.env.REACT_APP_API}/currency/${slug}`);



export const removeCurrency = async (slug, authtoken) =>
  await axios.delete(`${process.env.REACT_APP_API}/currency/${slug}`, {
    headers: {
      authtoken,
    },
  });

export const updateCurrency = async (slug, currency, authtoken) =>
  await axios.put(`${process.env.REACT_APP_API}/currency/${slug}`, {
    headers: {
      authtoken,
    },
  });


  export const updateDataCurrency = async (pairPeriod, authtoken) =>
  await axios.post(`${process.env.REACT_APP_API}/currencyData`, pairPeriod, {
    headers: {
      authtoken,
    },

  });

  export const updateDataCurrencyH4 = async (pairPeriod, authtoken) =>
  await axios.post(`${process.env.REACT_APP_API}/currencyDataH4`, pairPeriod, {
    headers: {
      authtoken,
    },

  });



export const createCurrency = async (currency, authtoken) =>
  await axios.post(`${process.env.REACT_APP_API}/currency`, currency, {
    headers: {
      authtoken,
    },
  });
  



