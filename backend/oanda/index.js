const fetch = require("node-fetch");
const apiOandaUrl = process.env.API_OANDA_URL;
const apiOandaKey = process.env.API_OANDA_KEY;

exports.getDataByOanda = async (params) => {
  const { endpoint, pair, fromData, toData, granularity, price, ...other } =
    params;

    console.log("params", params)
  const myURL = new URL(
    `${apiOandaUrl}/${endpoint}/${pair}/candles?price=A&from=${fromData}&to=${toData}&granularity=${granularity}`
  );
  const newUrl = endpoint && endpoint === "instruments" ? myURL : `${apiOandaUrl}/${endpoint}`;

  
  
  try {
    const responseData = await fetch(`${newUrl}`, {
      method: "GET",
      //  body: JSON.stringify(dataParams),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${apiOandaKey}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(
            "Sorry something went wrong" + JSON.stringify(response)
          );
        }
      })
      .then(async (data) => {
        const oandaData = data;
        return JSON.stringify(oandaData);
      })
      .catch((error) => {
        console.log(error.message);
      });
    return responseData;
  } catch (error) {
    return "erre" + error;
  }
};


exports.updateDataByOanda = async(arg) => {
    
}
