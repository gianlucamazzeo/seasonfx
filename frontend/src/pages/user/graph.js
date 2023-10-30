import React, { useState, useEffect, memo, useMemo, useCallback } from "react";
import UserNav from "../../components/nav/UserNav";
import { Button, message, Space, Select, DatePicker } from "antd";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import moment from "moment";
import { rimuoviDuplicatiPerData, formatDate } from "../utils/util";
import LineChart from './LineChart';

const Graph = (props) => {
  const { user } = useSelector((state) => ({ ...state }));
  const {
    dataCurId,
    selectedPair,
    fromDate,
    toDate,
    setDataCandles,
    dataCandles,
  } = props;
  const [getUser, setGetUser] = useState(user);
  const [x, setX] = useState([]);
  const [y, setY] = useState([]);
  const [x5, setX5] = useState([]);
  const [y5, setY5] = useState([]);
  const [x7, setX7] = useState([]);
  const [y7, setY7] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false); // Aggiungi questa variabile di stato

  const mediaTotal = useCallback((fromDate, toDate, dataCandles) => {
    // La tua logica per calcolare la data di inizio per gli ultimi 3 anni// ...

    const dataBegin = new Date(fromDate);
    const dataEnd = new Date(toDate);
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
      const dateKey = `${month}-${day}`;
      media3anni.push(dateKey);
      media5anni.push(dateKey);
      media7anni.push(dateKey);
    }

     // console.log(media3anni);

    // Creo un oggetto per tenere traccia delle somme temporanee per ogni giorno.
    const sums3 = {};
    const sums5 = {};
    const sums7 = {};
    const totSum3 = [];
    const totSum5 = [];
    const totSum7 = [];
    const totDate = [];

   
    media3anni.forEach((dateKey,i) => {
      sums3[dateKey] = {
        sum: 0,
        count: 0,
        day: dateKey,
      };
      totDate.push(i+1);
    });

    media5anni.forEach((dateKey,i) => {
      sums5[dateKey] = {
        sum: 0,
        count: 0,
        day: dateKey,
      };
      totDate.push(i+1);
    });

    media7anni.forEach((dateKey,i) => {
      sums7[dateKey] = {
        sum: 0,
        count: 0,
        day: dateKey,
      };
      totDate.push(i+1);
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

    for (const dateKey in sums3) {
      if (sums3[dateKey].count > 0) {
        sums3[dateKey].average = parseFloat(sums3[dateKey].sum / sums3[dateKey].count);
        sums3[dateKey].average = parseFloat(sums3[dateKey].average.toFixed(5));
        totSum3.push(sums3[dateKey].average);
      }
    }
    for (const dateKey5 in sums5) {
      if (sums5[dateKey5].count > 0) {
        sums5[dateKey5].average = parseFloat(sums5[dateKey5].sum / sums5[dateKey5].count);
        sums5[dateKey5].average = parseFloat(sums5[dateKey5].average.toFixed(5));
        totSum5.push(sums5[dateKey5].average);
      }
    }

    for (const dateKey7 in sums7) {
      if (sums7[dateKey7].count > 0) {
        sums7[dateKey7].average = parseFloat(sums7[dateKey7].sum / sums7[dateKey7].count);
        sums7[dateKey7].average = parseFloat(sums7[dateKey7].average.toFixed(5));
        totSum7.push(sums7[dateKey7].average);
      }
    }
    //const xValues = sums3[dateKey].map((item) => item);
   // console.log(xValues);
   //const keysArray = Object.keys(sums3);
    setX(totDate);
    setY(totSum3);
    setX5(totDate);
    setY5(totSum5);
    setX7(totDate);
    setY7(totSum7);
    
  },[]);



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

  const chartLayout = {
    title: selectedPair,
    xaxis: {
      title: 'Days',
    },
    yaxis: {
      title: 'Price.close',
    },
  };
  
  
  const data = [
    {
      x: x,
      y: y,
      type: 'scatter',
      mode: 'lines+markers',
      marker: { color: 'blue' },
      name: '3 years'
    },
    {
      x: x5,
      y: y5,
      type: 'scatter',
      mode: 'lines+markers',
      marker: { color: 'orange' },
      name: '5 years'
    },
    {
      x: x7,
      y: y7,
      type: 'scatter',
      mode: 'lines+markers',
      marker: { color: 'violet' },
      name: '7 years'
    }
  ];
  

  return <div><LineChart  layout={chartLayout} data={data} /></div>;
};

export default memo(Graph);
