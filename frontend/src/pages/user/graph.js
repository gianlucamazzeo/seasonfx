import React, { useState, useEffect, memo } from "react";
import UserNav from "../../components/nav/UserNav";
import { Button, message, Space, Select, DatePicker } from "antd";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import moment from "moment";
import {  rimuoviDuplicatiPerData } from "../utils/util";

const Graph = (props) => {
  const { dataCandles, dataIndex } = props;

let media3 = dataCandles.media3;
 
  if (dataIndex) {
    if(media3 && media3.length){
      const datiMedia3SenzaDuplicati = rimuoviDuplicatiPerData(media3);
      console.log(datiMedia3SenzaDuplicati)
      const result = dataIndex[0]?.map((dateObj) => {

        
        let sum = datiMedia3SenzaDuplicati.reduce((acc, curr) => {
          const date = new Date(curr.time).toISOString().slice(0, 10);
  
      //    debugger;
      console.log(date, dateObj)
  
          if (
            date === dateObj.firstY ||
            date === dateObj.secondY ||
            date === dateObj.thirdY
          ) {
            acc += parseFloat(curr.ask.c.$numberDecimal);
          }
          
          return acc;
        }, 0);
  
        return { ...dateObj, totale: sum.toFixed(5) };
      });
      console.log(result);
    }


    //console.log(result);
   
  }

    

  return <div>Graph</div>;
};

export default memo(Graph);
