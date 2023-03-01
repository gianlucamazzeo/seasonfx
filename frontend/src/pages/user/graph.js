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

          if (numDay === 6) {
            console.log(numDay + " - " + dateObj.firstY);
            let lastFridayDateSat = dateFormatFriday.setDate(dateFormatFriday.getDate() - 1);
            let fridaySat = new Date(lastFridayDateSat);
            
            console.log(fridaySat);
          }

          if (numDay === 0) {
            console.log(numDay + " - " + dateObj.firstY);
            let lastFridayDateSun =  dateFormatFriday.setDate(dateFormatFriday.getDate() - 2);
            let fridaySun = new Date(lastFridayDateSun);
            console.log(fridaySun);
          }




          if (
            date === dateObj.firstY ||
            date === dateObj.secondY ||
            date === dateObj.thirdY
          ) {
            acc += parseFloat(curr.ask.c.$numberDecimal);
          }

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
