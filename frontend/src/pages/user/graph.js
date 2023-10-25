import React, { useState, useEffect, memo, useMemo, useCallback } from "react";
import UserNav from "../../components/nav/UserNav";
import { Button, message, Space, Select, DatePicker } from "antd";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import moment from "moment";
import { rimuoviDuplicatiPerData, formatDate } from "../utils/util";

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
  console.log(dataCandles)

  const mediaTotal = useCallback(
    (fromDate, toDate) => {
      // La tua logica per calcolare la data di inizio per gli ultimi 3 anni// ...

      const dataBegin = new Date(fromDate);
      const dataEnd = new Date(toDate);
      const dateArray = [];
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
        const dateKey = `${day}-${month}`;
        dateArray.push(dateKey);
      }

      console.log(dateArray);

      // Aggiorna il dato del grafico quando necessario
      setDataCandles([]);
    },
    [setDataCandles]
  );

  useEffect(() => {
    // Chiama mediaTotal con le date appropriate
    mediaTotal(fromDate, toDate);
  }, [mediaTotal, fromDate, toDate]);

  return <div>{/*JSON.stringify(dataCandles)*/}</div>;
};

export default memo(Graph);
