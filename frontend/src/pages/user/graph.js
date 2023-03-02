import React, { useState, useEffect, memo } from "react";
import UserNav from "../../components/nav/UserNav";
import { Button, message, Space, Select, DatePicker } from "antd";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import moment from "moment";
import { rimuoviDuplicatiPerData } from "../utils/util";

const Graph = (props) => {
  const { dataCandles, dataIndex } = props;

  let media3 = dataCandles.media3;
  let media5 = dataCandles.media5;
  console.log(media5);

  if (dataIndex) {
    if ((media3 && media3.length) || (media5 && media5.length)) {
      const datiMedia3SenzaDuplicati = rimuoviDuplicatiPerData(media3);
      const datiMedia5SenzaDuplicati = rimuoviDuplicatiPerData(media5);
      const result = dataIndex[0]?.map((dateObj) => {
        let sum3 = datiMedia3SenzaDuplicati.reduce((acc, curr) => {
          const date = new Date(curr.time).toISOString().slice(0, 10);

          const numDay = new Date(dateObj.firstY).getDay();
          const dateFormatFriday = new Date(dateObj.firstY);
          let lastFridayDateSat;
          let fridaySat;
          let lastFridayDateSun;
          let fridaySun;
          if (numDay === 6) {
            console.log(numDay + " - " + dateObj.firstY);
             lastFridayDateSat = dateFormatFriday.setDate(dateFormatFriday.getDate() - 1);
             fridaySat = new Date(lastFridayDateSat);

          }

          if (numDay === 0) {
            console.log(numDay + " - " + dateObj.firstY);
             lastFridayDateSun =  dateFormatFriday.setDate(dateFormatFriday.getDate() - 2);
             fridaySun = new Date(lastFridayDateSun);
          }




          if (
            date === dateObj.firstY ||
            date === dateObj.secondY ||
            date === dateObj.thirdY
          ) {
            acc += parseFloat(curr.ask.c.$numberDecimal);
          } 

/*
for (const currentObj of dateArray[0]) {
  currentObj.total = 0;
  for (const currentAsk of askArray) {
    let askTime = new Date(currentAsk.time);
    let objDate = new Date(currentObj.firstY);
    let objDay = objDate.getDay();

    if (objDay === 6) {
      // sabato
      objDate.setDate(objDate.getDate() - 1);
    } else if (objDay === 0) {
      // domenica
      objDate.setDate(objDate.getDate() - 2);
    }

    let fridayBefore = new Date(objDate);
    fridayBefore.setDate(fridayBefore.getDate() - (objDay + 1) % 7);

    if (askTime.getTime() >= fridayBefore.getTime() && askTime.getTime() < objDate.getTime()) {
      currentObj.total += parseFloat(currentAsk.ask.c.$numberDecimal);
    }
  }
}




*/






          return acc;
        }, 0);

        let sum5 = datiMedia5SenzaDuplicati.reduce((acc5, curr) => {
          const date = new Date(curr.time).toISOString().slice(0, 10);
          if (
            date === dateObj.firstY ||
            date === dateObj.secondY ||
            date === dateObj.thirdY ||
            date === dateObj.fourth ||
            date === dateObj.fiveth
          ) {
            acc5 += parseFloat(curr.ask.c.$numberDecimal);
          }
          return acc5;
        }, 0);

        return {
          ...dateObj,
          totale3Y: sum3.toFixed(5),
          totale5Y: sum5.toFixed(5),
        };
      });

      console.log(result);
    }

    //console.log(result);
  }

  return <div>Graph</div>;
};

export default memo(Graph);
