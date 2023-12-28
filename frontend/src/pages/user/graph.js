import React, { useState, useEffect, memo, useMemo, useCallback } from "react";
import UserNav from "../../components/nav/UserNav";
import { Button, message, Space, Select, DatePicker } from "antd";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import moment from "moment";
import { rimuoviDuplicatiPerData, formatDate } from "../utils/util";
import LineChart from "./LineChart";

const Graph = (props) => {
  const { user } = useSelector((state) => ({ ...state }));
  const {
    dataCurId,
    selectedPair,
    fromDate,
    toDate,
    setDataCandles,
    dataCandles,
    setDataCurrentCandles,
    dataCurrentCandles,
    selectedNamePair,
  } = props;
  const [getUser, setGetUser] = useState(user);
  const [x0, setX0] = useState([]);
  const [y0, setY0] = useState([]);
  const [x3, setX3] = useState([]);
  const [y3, setY3] = useState([]);
  const [x2, setX2] = useState([]);
  const [y2, setY2] = useState([]);
  const [x5, setX5] = useState([]);
  const [y5, setY5] = useState([]);
  const [x7, setX7] = useState([]);
  const [y7, setY7] = useState([]);
  const [high, setHigh] = useState([]);
  const [low, setLow] = useState([]);
  const [percentageChange, setPercentageChange] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false); // Aggiungi questa variabile di stato

  function getWeekNumber(d) {
    // Copia la data per non modificare l'originale
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // Imposta al Giovedì della settimana corrente
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    // Ottieni il primo giorno dell'anno
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    // Calcola la differenza in settimane tra la data corrente e il primo giorno dell'anno
    var weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return weekNo;
  }



  // Funzione per determinare la tendenza e calcolare la percentuale di variazione
const evaluateTrend = useCallback((currentDay, previousDay) => {
  const percentageChangeHigh = calculatePercentageChange(currentDay.ask.h.$numberDecimal, previousDay.ask.h.$numberDecimal);
  const percentageChangeLow = calculatePercentageChange(currentDay.ask.l.$numberDecimal, previousDay.ask.l.$numberDecimal);

  return { 
      trend: { 
          high: percentageChangeHigh, 
          low: percentageChangeLow 
      } 
  };
}, []);

  const mediaTotal = useCallback(
    (fromDate, toDate, dataCandles) => {
      // La tua logica per calcolare la data di inizio per gli ultimi 3 anni// ...

      const dataBegin = new Date(fromDate);
      const dataEnd = new Date(toDate);
      const currentPrices = [];
      const media2anni = [];
      const media3anni = [];
      const media5anni = [];
      const media7anni = [];
      // La tua logica per calcolare la data di fine per gli ultimi 3 anni// ...
      // creo un array contenente un indice giornomese per tutto il periodo che viene passato
      // creo un arrauy
      // poi creo
      // Itera su ciascun giorno all'interno del periodo specificato.
      for (
        let currentDate = dataBegin;
        currentDate <= dataEnd;
        currentDate.setDate(currentDate.getDate() + 1)
      ) {
        const day = currentDate.getDate().toString().padStart(2, "0");
        const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
        const year = currentDate.getFullYear();
        const dateKey = `${month}-${day}`;
        media2anni.push(dateKey);
        media3anni.push(dateKey);
        media5anni.push(dateKey);
        media7anni.push(dateKey);
        currentPrices.push(dateKey);
      }

      // console.log(media3anni);

      // Creo un oggetto per tenere traccia delle somme temporanee per ogni giorno.
      const sums = {};
      const sums2 = {};
      const sums3 = {};
      const sums5 = {};
      const sums7 = {};
      const totSum = [];
      const totSum2 = [];
      const totSum3 = [];
      const totSum5 = [];
      const totSum7 = [];
      const totDate = [];

      currentPrices.forEach((dateKey, i) => {
        let currentDate = dataBegin;
        currentDate.setDate(currentDate.getDate() + 1);
        const year = currentDate.getFullYear();

        sums[dateKey] = {
          sum: 0,
          count: 0,
          day: dateKey,
        };
        totDate.push(i + 1);
      });

      media2anni.forEach((dateKey, i) => {
        let currentDate = dataBegin;
        currentDate.setDate(currentDate.getDate() + 1);
        const year = currentDate.getFullYear();
        sums2[dateKey] = {
          sum: 0,
          count: 0,
          day: dateKey,
        };
        totDate.push(i + 1);
      });

      media3anni.forEach((dateKey, i) => {
        let currentDate = dataBegin;
        currentDate.setDate(currentDate.getDate() + 1);
        const year = currentDate.getFullYear();
        sums3[dateKey] = {
          sum: 0,
          count: 0,
          day: dateKey,
        };
        totDate.push(i + 1);
      });

      media5anni.forEach((dateKey, i) => {
        let currentDate = dataBegin;
        currentDate.setDate(currentDate.getDate() + 1);
        const year = currentDate.getFullYear();
        sums5[dateKey] = {
          sum: 0,
          count: 0,
          day: dateKey,
        };
        totDate.push(i + 1);
      });

      media7anni.forEach((dateKey, i) => {
        let currentDate = dataBegin;
        currentDate.setDate(currentDate.getDate() + 1);
        const year = currentDate.getFullYear();
        sums7[dateKey] = {
          sum: 0,
          count: 0,
          day: dateKey,
        };
        totDate.push(i + 1);
      });

      dataCandles?.media5?.forEach((item5) => {
        const time5 = item5.time.split("T")[0];
        const dateKey5 = time5.substr(5, 5); // Estrai MM-DD dalla data
        if (sums5[dateKey5]) {
          const closePrice5 = parseFloat(item5.ask.c["$numberDecimal"]);
          sums5[dateKey5].sum += closePrice5;
          sums5[dateKey5].count++;
          sums5[dateKey5].day = dateKey5;
        }
      });

      dataCandles?.media7?.forEach((item7) => {
        const time7 = item7.time.split("T")[0];
        const dateKey7 = time7.substr(5, 5); // Estrai MM-DD dalla data
        if (sums5[dateKey7]) {
          const closePrice7 = parseFloat(item7.ask.c["$numberDecimal"]);
          sums7[dateKey7].sum += closePrice7;
          sums7[dateKey7].count++;
          sums7[dateKey7].day = dateKey7;
        }
      });

      dataCandles?.media3?.forEach((item) => {
        const time = item.time.split("T")[0];
        const dateKey = time.substr(5, 5); // Estrai MM-DD dalla data
        if (sums3[dateKey]) {
          const closePrice = parseFloat(item.ask.c["$numberDecimal"]);
          sums3[dateKey].sum += closePrice;
          sums3[dateKey].count++;
          sums3[dateKey].day = dateKey;
        }
      });

      dataCandles?.media2?.forEach((item) => {
        const time = item.time.split("T")[0];
        const dateKey = time.substr(5, 5); // Estrai MM-DD dalla data
        if (sums2[dateKey]) {
          const closePrice = parseFloat(item.ask.c["$numberDecimal"]);
          sums2[dateKey].sum += closePrice;
          sums2[dateKey].count++;
          sums2[dateKey].day = dateKey;
        }
      });

      dataCurrentCandles?.media?.forEach((item) => {
        const time = item.time.split("T")[0];
        const dateKey = time.substr(5, 5); // Estrai MM-DD dalla data
        if (sums[dateKey]) {
          const closePrice = parseFloat(item.ask.c["$numberDecimal"]);
          sums[dateKey].sum += closePrice;
          sums[dateKey].count++;
          sums[dateKey].day = dateKey;
        }
      });

      //////////////////////////////////////////////////////////////

      for (const dateKey in sums) {
        if (sums[dateKey].count > 0) {
          sums[dateKey].average = parseFloat(
            sums[dateKey].sum / sums[dateKey].count
          );
          sums[dateKey].average = parseFloat(sums[dateKey].average.toFixed(5));
          totSum.push(sums[dateKey].average);
        }
      }

      for (const dateKey in sums2) {
        if (sums2[dateKey].count > 0) {
          sums2[dateKey].average = parseFloat(
            sums2[dateKey].sum / sums2[dateKey].count
          );
          sums2[dateKey].average = parseFloat(
            sums2[dateKey].average.toFixed(5)
          );
          totSum2.push(sums2[dateKey].average);
        }
      }

      for (const dateKey in sums3) {
        if (sums3[dateKey].count > 0) {
          sums3[dateKey].average = parseFloat(
            sums3[dateKey].sum / sums3[dateKey].count
          );
          sums3[dateKey].average = parseFloat(
            sums3[dateKey].average.toFixed(5)
          );
          totSum3.push(sums3[dateKey].average);
        }
      }
      for (const dateKey5 in sums5) {
        if (sums5[dateKey5].count > 0) {
          sums5[dateKey5].average = parseFloat(
            sums5[dateKey5].sum / sums5[dateKey5].count
          );
          sums5[dateKey5].average = parseFloat(
            sums5[dateKey5].average.toFixed(5)
          );
          totSum5.push(sums5[dateKey5].average);
        }
      }

      for (const dateKey7 in sums7) {
        if (sums7[dateKey7].count > 0) {
          sums7[dateKey7].average = parseFloat(
            sums7[dateKey7].sum / sums7[dateKey7].count
          );
          sums7[dateKey7].average = parseFloat(
            sums7[dateKey7].average.toFixed(5)
          );
          totSum7.push(sums7[dateKey7].average);
        }
      }

      
      const data = dataCurrentCandles?.media;
      const mappedData = data?.map((item) => {
        const low = parseFloat(item.ask.l.$numberDecimal);
        const high = parseFloat(item.ask.h.$numberDecimal);
        const percentageChange = ((high - low) / high) * 100;

        return {
          week: getWeekNumber(new Date(item.time)),
          day: {
            dayOfWeek: new Date(item.time).getDay(),
            low: low,
            high: high,
            percentageChange: percentageChange,
          },
        };
      });

      
      //  console.log(mappedData);
      // Poi, riduciamo i dati raggruppandoli per settimana
      const reducedData = mappedData?.reduce((acc, item) => {
        // Se la settimana non esiste ancora nell'accumulatore, la creiamo
        if (!acc[item.week]) {
          acc[item.week] = {
            weekNumber: item.week,
            days: [item.day],
          };
        } else {
          // Altrimenti, aggiungiamo il giorno
          acc[item.week].days.push(item.day);
        }

        return acc;
      }, {});
      // Infine, convertiamo l'oggetto ridotto in un array
      if (reducedData) {
        const result = Object.values(reducedData);

        const percentageChanges = data.map((item) => {
          const low = parseFloat(item.ask.l.$numberDecimal);
          const high = parseFloat(item.ask.h.$numberDecimal);
          const percentageChange = ((high - low) / high) * 100;

          return {
            time: item.time,
            percentageChange: percentageChange,
          };
        });

        // Aggiungi le percentuali di variazione a dataCurrentCandles?.media
        const updatedDataCurrenCandles = dataCurrentCandles?.media?.map(
          (item) => {
            const matchingChange = percentageChanges.find(
              (change) => change.time === item.time
            );
            return {
              ...item,
              percentageChange: matchingChange
                ? matchingChange.percentageChange
                : null,
            };
          }
        );
        const percentageChangesData = updatedDataCurrenCandles.map(
          (item) => item.percentageChange
        );
        setPercentageChange(percentageChangesData);
      }
      const min = Math.min(...totSum);
      const max = Math.max(...totSum);
      // Calcola il logaritmo dei valori minimo e massimo
      const logMin = Math.log10(min);
      const logMax = Math.log10(max);

      // Mappa percentageChange in proporzione alla scala logaritmica
      const scaledPercentageChange = percentageChange.map((value) => {
        // Calcola il logaritmo del valore
        const logValue = Math.log10(value);

        // Calcola il rapporto del logaritmo del valore rispetto al range dei logaritmi
        const ratio = (logValue - logMin) / (logMax - logMin);

        // Ritorna il valore scalato
        return ratio * (max - min) + min;
      });
      
     
      ///////////////////////////////////////////////////////////////////
      //const xValues = sums3[dateKey].map((item) => item);
      // console.log(xValues);
      //const keysArray = Object.keys(sums3);
      setX0(totDate);
      setY0(totSum);
      setX3(totDate);
      setY3(totSum3);
      setX2(totDate);
      setY2(totSum2);
      setX5(totDate);
      setY5(totSum5);
      setX7(totDate);
      setY7(totSum7);
      setHigh(scaledPercentageChange)
      
    },
    [dataCurrentCandles?.media]
  );



  useEffect(() => {
    // Chiama mediaTotal con le date appropriate
    //  if (!dataLoaded) { // Esegui solo se i dati non sono ancora stati caricati
    // Chiama mediaTotal con le date appropriate

    mediaTotal(fromDate, toDate, dataCandles);

    // Estrai i valori di x da result
    // const xValues = result.map((item) => item[0].day);

    // Estrai i valori di y da result
    //  const yValues = result.map((item) => item[0].average);

    // Imposta x e y solo una volta
    //  setX(xValues);
    //  setY(yValues);
    // Imposta dataLoaded a true per evitare loop
    //   }
  }, [mediaTotal, dataCandles, fromDate, toDate, dataLoaded]);

  function calculatePercentageChange(currentValue, previousValue) {
    return ((currentValue - previousValue) / Math.abs(previousValue)) * 100;
}



/*
setHigh(currentDataTrend?.map(item => item.trend.high));
setLow(currentDataTrend?.map(item => item.trend.low));

*/

  // Funzione per aggiungere giorni a una data
  function aggiungiGiorni(data, giorni) {
    const copiaData = new Date(data);
    copiaData.setDate(copiaData.getDate() + giorni);
    return copiaData;
  }

  // Creazione di un oggetto con chiave (data) e valore (prezzo)
  function creaPrezziPerData(prezzi, dataIniziale) {
    return prezzi.reduce((obj, prezzo, index) => {
      const dataCorrente = aggiungiGiorni(dataIniziale, index);
      const dataChiave = dataCorrente.toISOString().split("T")[0]; // Formato YYYY-MM-DD
      obj[dataChiave] = prezzo;
      return obj;
    }, {});
  }

  function creaPrezziPerDataTrend(prezzi, dataIniziale) {
    return prezzi.reduce((obj, prezzo, index) => {
      const dataCorrente = aggiungiGiorni(dataIniziale, index);
      const dataChiave = dataCorrente.toISOString().split("T")[0]; // Formato YYYY-MM-DD
      obj[dataChiave] = prezzo;
      return obj;
    }, {});
  }

  

  const dataIniziale = new Date(fromDate); // Modifica questa data in base alle tue esigenze

  const prezziPerData0 = creaPrezziPerData(y0, dataIniziale);
  const dateArray0 = Object.keys(prezziPerData0);
  const prezziArray0 = Object.values(prezziPerData0);

  const prezziPerData2 = creaPrezziPerData(y2, dataIniziale);
  const dateArray2 = Object.keys(prezziPerData2);
  const prezziArray2 = Object.values(prezziPerData2);

  const prezziPerData3 = creaPrezziPerData(y3, dataIniziale);
  const dateArray3 = Object.keys(prezziPerData3);
  const prezziArray3 = Object.values(prezziPerData3);

  const prezziPerData5 = creaPrezziPerData(y5, dataIniziale);
  const dateArray5 = Object.keys(prezziPerData5);
  const prezziArray5 = Object.values(prezziPerData5);

  const prezziPerData7 = creaPrezziPerData(y7, dataIniziale);
  const dateArray7 = Object.keys(prezziPerData7);
  const prezziArray7 = Object.values(prezziPerData7);

  const prezziPerDataTrendLow = creaPrezziPerDataTrend(low, dataIniziale);
  const dateArrayTrendLow = Object.keys(prezziPerDataTrendLow);
  const prezziArrayLow = Object.values(prezziPerDataTrendLow);

  const prezziPerDataTrendHigh = creaPrezziPerDataTrend(high, dataIniziale);
  const dateArrayTrendHigh = Object.keys(prezziPerDataTrendHigh);
  const prezziArrayHigh = Object.values(prezziPerDataTrendHigh);





  const chartLayout = {
    title: selectedNamePair,
    xaxis: {
      title: "Days",
    },
    yaxis: {
      title: "Price.close",
    },
  };

  const data = [
    {
      x: dateArray0,
      y: prezziArray0,
      type: "scatter",
      mode: "lines+markers",
      marker: { color: "red" },
      name: "current",
    },

    {
      x: dateArray2,
      y: prezziArray2,
      type: "scatter",
      mode: "lines+markers",
      marker: { color: "yellow" },
      name: "2 years",
    },
    {
      x: dateArray3,
      y: prezziArray3,
      type: "scatter",
      mode: "lines+markers",
      marker: { color: "blue" },
      name: "3 years",
    },

    {
      x: dateArray5,
      y: prezziArray5,
      type: "scatter",
      mode: "lines+markers",
      marker: { color: "orange" },
      name: "5 years",
    },
    {
      x: dateArray7,
      y: prezziArray7,
      type: "scatter",
      mode: "lines+markers",
      marker: { color: "violet" },
      name: "7 years",
    },
  ];

  

  const chartLayoutTrend = {
    title: 'Trend: Buy or Sell',
    xaxis: {
      title: "Days",
    },
    yaxis: {
      title: "Trend",
    },
  };


  const dataTrend = [
    {
      x: dateArrayTrendHigh,
      y: prezziArrayHigh,
      type: "scatter",
      mode: "lines+markers",
      marker: { color: "blue" },
      name: "current",
    },
  ];
  
  //console.log(x3,y3);

  const collection = dateArray2.map((data) => ({
    data,
    media2Anni: prezziPerData2[data] || null,
    media3Anni: prezziPerData3[data] || null,
    media5Anni: prezziPerData5[data] || null,
    media7Anni: prezziPerData7[data] || null,
    prezzoMedioCorrente: prezziPerData0[data] || null,
  }));

  return (
    <div>
      <LineChart layout={chartLayout} data={data} />
    </div>
  );
};

export default memo(Graph);
