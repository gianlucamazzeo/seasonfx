import React, { useState, useEffect, memo, useMemo } from "react";
import UserNav from "../../components/nav/UserNav";
import { Button, message, Space, Select, DatePicker } from "antd";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import moment from "moment";
import { rimuoviDuplicatiPerData, formatDate } from "../utils/util";
import { getDataCurrencyDay } from "../../functions/currency";

const Graph = (props) => {
  const { user } = useSelector((state) => ({ ...state }));
  const { dataCandles, dataIndex, dataCurId } = props;
  const [extraData, setExtraData] = useState([
    { selectedPair: "", fromDate: "", granularity: "D" },
  ]);

  let media3 = dataCandles.media3;
  let media5 = dataCandles.media5;
  //  console.log(media5);

  /*  const getDataDay = (customData, user) => {
    const { selectedPair, fromDate, granularity } = customData;

    if (selectedPair && fromDate && granularity) {
      const ObjectDataPost = {
        id: selectedPair,
        fromDate: fromDate,
        granularity: granularity,
      };

      debugger
      /*
      getDataCurrencyDay(ObjectDataPost, user.token)
        .then((res) => {
         
          console.log('resDay ' + JSON.stringify(res.data));
        })
        .catch((err) => {
          console.log(err);

          if (err.response.status === 400) toast.error(err.response.data);
        });
        
    }
  };
*/

  /*
  const memoizedGetDataDay = useMemo(() => {
    return getDataDay(dataCustom, user);
  }, [dataCustom, user]);
*/
  if (dataIndex) {
    if ((media3 && media3.length) || (media5 && media5.length)) {
      const datiMedia3SenzaDuplicati = rimuoviDuplicatiPerData(media3);
      const datiMedia5SenzaDuplicati = rimuoviDuplicatiPerData(media5);

      const result = dataIndex[0]?.map((dateObj) => {
        let sum3 = datiMedia3SenzaDuplicati.reduce((acc, curr) => {
          const date = new Date(curr.time).toISOString().slice(0, 10);

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

      //  console.log(result);
      //  setExtraData(result)
      for (var i = 0; i < result?.length; i++) {
        // Check if firstY is a weekend
        let currentDateFirstY = new Date(result[i].firstY);
        let currentYearFirstY = currentDateFirstY.getFullYear();
        let currentMonthFirstY = currentDateFirstY.getMonth();
        let currentDayOfWeekFirstY = currentDateFirstY.getDay();

        /// secondY
        let currentDateSecondY = new Date(result[i].secondY);
        let currentYearSecondY = currentDateFirstY.getFullYear();
        let currentMonthSecondY = currentDateFirstY.getMonth();
        let currentDayOfWeekSecondY = currentDateFirstY.getDay();

        if (currentDayOfWeekFirstY === 0 || currentDayOfWeekFirstY === 6) {
          // If it's a Sunday, add 1 day
          if (
            currentDayOfWeekFirstY === 0 &&
            currentDateFirstY.getFullYear() === currentYearFirstY
          ) {
            currentDateFirstY.setDate(currentDateFirstY.getDate() - 2);
            result[i].extraDayFirstY = currentDateFirstY
              .toISOString()
              .slice(0, 10);
          } else if (
            currentDayOfWeekFirstY === 6 &&
            currentDateFirstY.getFullYear() === currentYearFirstY
          ) {
            currentDateFirstY.setDate(currentDateFirstY.getDate() - 1);
            result[i].extraDayFirstY = currentDateFirstY
              .toISOString()
              .slice(0, 10);
          } else {
            
          }
          /*else { // If it's a Saturday, add 2 days
                currentDate.setDate(currentDate.getDate() + 2);
            }
            */

          // Check if the new date is in the same year as firstY

          /*else { // Otherwise, it's in the next year
                extraDaySecondY = currentDate.toISOString().slice(0, 10);
            }
            */
        }
        /*
        if (currentDayOfWeekSecondY === 0 || currentDayOfWeekSecondY === 6) {
          // If it's a Sunday, add 1 day
          if (
            currentDayOfWeekSecondY === 0 &&
            currentDateSecondY.getFullYear() === currentYearSecondY
          ) {
            currentDateSecondY.setDate(currentDateSecondY.getDate() - 2);
            result[i].extraDaySecondY = currentDateSecondY
              .toISOString()
              .slice(0, 10);
          } else if (
            currentDayOfWeekSecondY === 6 &&
            currentDateSecondY.getFullYear() === currentYearSecondY
          ) {
            currentDateSecondY.setDate(currentDateSecondY.getDate() - 1);
            result[i].extraDaySecondY = currentDateSecondY
              .toISOString()
              .slice(0, 10);
          } else {
            return true;
          }
        }
        */
      }
      
      console.log(result);
    }

    //console.log(result);
  }

  //////////////////////////////////////////////////////////////////

  //console.log(extraData)

  ///////////////////////////////////////////////////////////////

  // cicla i risulta di

  return <div>Graph</div>;
};

export default memo(Graph);
