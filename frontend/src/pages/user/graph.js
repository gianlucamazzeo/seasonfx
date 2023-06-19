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
  const { dataCandles, dataIndex, dataCurId, selectedPair } = props;
  const [getUser, setGetUser] = useState(user);

  let media3 = dataCandles.media3;
  let media5 = dataCandles.media5;
  let media7 = dataCandles.media7;
  //  console.log(media5);

  const getDataDay = (customData) => {
    const { selectedPair, fromDate, granularity } = customData;

    if (selectedPair && fromDate && granularity) {
      const ObjectDataPost = {
        id: selectedPair,
        fromDate: fromDate,
        granularity: granularity,
      };

     

      getDataCurrencyDay(ObjectDataPost, getUser.token)
        .then((res) => {
          return res;
        })
        .catch((err) => {
          console.log(err);

          if (err.response.status === 400) toast.error(err.response.data);
        });
    }
  };

  /*
  const memoizedGetDataDay = useMemo(() => {
    return getDataDay(dataCustom, user);
  }, [dataCustom, user]);
*/
  if (dataIndex) {
    if (
      (media3 && media3.length) ||
      (media5 && media5.length) ||
      (media7 && media7.length)
    ) {
      const datiMedia3SenzaDuplicati = rimuoviDuplicatiPerData(media3);
      const datiMedia5SenzaDuplicati = rimuoviDuplicatiPerData(media5);
      const datiMedia7SenzaDuplicati = rimuoviDuplicatiPerData(media7);

      const result = dataIndex[0]?.map((dateObj) => {
        console.log(dateObj);

        let sum3 = datiMedia3SenzaDuplicati.reduce((acc, curr) => {
          const date = new Date(curr.time).toISOString().slice(0, 10);
          if (
            date === dateObj.firstY ||
            date === dateObj.secondY ||
            date === dateObj.thirdY
          ) {
            let curDec = parseFloat(curr.ask.c.$numberDecimal);
            acc += Math.round((curDec + Number.EPSILON) * 100) / 100;
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
            let curDec = parseFloat(curr.ask.c.$numberDecimal);
            acc5 += Math.round((curDec + Number.EPSILON) * 100) / 100;
          }

          return acc5;
        }, 0);

        let sum7 = datiMedia7SenzaDuplicati.reduce((acc7, curr) => {
             const date = new Date(curr.time).toISOString().slice(0, 10);
        
          if (
            date === dateObj.firstY ||
            date === dateObj.secondY ||
            date === dateObj.thirdY ||
            date === dateObj.fourth ||
            date === dateObj.fiveth ||
            date === dateObj.sixth ||
            date === dateObj.seventh 
          ) {
            let curDec = parseFloat(curr.ask.c.$numberDecimal);
            acc7 += parseFloat(curDec);
          }
            return acc7;

          }, 0);
      

        return {
          ...dateObj,
          totale3Y: sum3,
          totale5Y: sum5,
          totale7Y: sum7,
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
        let currentYearSecondY = currentDateSecondY.getFullYear();
        let currentMonthSecondY = currentDateSecondY.getMonth();
        let currentDayOfWeekSecondY = currentDateSecondY.getDay();

        /// thirdY
        let currentDateThirdY = new Date(result[i].thirdY);
        let currentYearThirdY = currentDateThirdY.getFullYear();
        let currentMonthThirdY = currentDateThirdY.getMonth();
        let currentDayOfWeekThirdY = currentDateThirdY.getDay();

        // fourth
        let currentDateFourthY = new Date(result[i].fourth);
        let currentYearFourthY = currentDateFourthY.getFullYear();
        let currentMonthFourthY = currentDateFourthY.getMonth();
        let currentDayOfWeekFourthY = currentDateFourthY.getDay();

        // fiveth
        let currentDateFivethY = new Date(result[i].fiveth);
        let currentYearFivethY = currentDateFivethY.getFullYear();
        let currentMonthFivethY = currentDateFivethY.getMonth();
        let currentDayOfWeekFivethY = currentDateFivethY.getDay();

        // sixth
        let currentDateSixthY = new Date(result[i].sixth);
        let currentYearSixthY = currentDateSixthY.getFullYear();
        let currentMonthSixthY = currentDateSixthY.getMonth();
        let currentDayOfWeekSixthY = currentDateSixthY.getDay();

        // seventh
        let currentDateSeventhY = new Date(result[i].seventh);
        let currentYearSeventhY = currentDateSeventhY.getFullYear();
        let currentMonthSeventhY = currentDateSeventhY.getMonth();
        let currentDayOfWeekSeventhY = currentDateSeventhY.getDay();

        if (currentDayOfWeekFirstY === 0 || currentDayOfWeekFirstY === 6) {
          // If it's a Sunday, add 1 day
          if (
            currentDayOfWeekFirstY === 0 &&
            currentDateFirstY.getFullYear() === currentYearFirstY
          ) {
            currentDateFirstY.setDate(currentDateFirstY.getDate() - 2);
            result[i].extraDayfirstY = currentDateFirstY
              .toISOString()
              .slice(0, 10);
          } else if (
            currentDayOfWeekFirstY === 6 &&
            currentDateFirstY.getFullYear() === currentYearFirstY
          ) {
            currentDateFirstY.setDate(currentDateFirstY.getDate() - 1);
            result[i].extraDayfirstY = currentDateFirstY
              .toISOString()
              .slice(0, 10);
          }
        }

        if (currentDayOfWeekSecondY === 0 || currentDayOfWeekSecondY === 6) {
          if (
            currentDayOfWeekSecondY === 0 &&
            currentDateSecondY.getFullYear() === currentYearSecondY
          ) {
            currentDateSecondY.setDate(currentDateSecondY.getDate() - 2);
            result[i].extraDaysecondY = currentDateSecondY
              .toISOString()
              .slice(0, 10);
          } else if (
            currentDayOfWeekSecondY === 6 &&
            currentDateSecondY.getFullYear() === currentYearSecondY
          ) {
            currentDateSecondY.setDate(currentDateSecondY.getDate() - 1);
            result[i].extraDaysecondY = currentDateSecondY
              .toISOString()
              .slice(0, 10);
          }
        }

        if (currentDayOfWeekThirdY === 0 || currentDayOfWeekThirdY === 6) {
          if (
            currentDayOfWeekThirdY === 0 &&
            currentDateThirdY.getFullYear() === currentYearThirdY
          ) {
            currentDateThirdY.setDate(currentDateThirdY.getDate() - 2);
            result[i].extraDaythirdY = currentDateThirdY
              .toISOString()
              .slice(0, 10);
          } else if (
            currentDayOfWeekThirdY === 6 &&
            currentDateThirdY.getFullYear() === currentYearThirdY
          ) {
            currentDateThirdY.setDate(currentDateThirdY.getDate() - 1);
            result[i].extraDaythirdY = currentDateThirdY
              .toISOString()
              .slice(0, 10);
          }
        }

        if (currentDayOfWeekFourthY === 0 || currentDayOfWeekFourthY === 6) {
          if (
            currentDayOfWeekFourthY === 0 &&
            currentDateFourthY.getFullYear() === currentYearFourthY
          ) {
            currentDateFourthY.setDate(currentDateFourthY.getDate() - 2);
            result[i].extraDayfourth = currentDateFourthY
              .toISOString()
              .slice(0, 10);
          } else if (
            currentDayOfWeekFourthY === 6 &&
            currentDateFourthY.getFullYear() === currentYearFourthY
          ) {
            currentDateFourthY.setDate(currentDateFourthY.getDate() - 1);
            result[i].extraDayfourth = currentDateFourthY
              .toISOString()
              .slice(0, 10);
          }
        }

        if (currentDayOfWeekFivethY === 0 || currentDayOfWeekFivethY === 6) {
          if (
            currentDayOfWeekFivethY === 0 &&
            currentDateFivethY.getFullYear() === currentYearFivethY
          ) {
            currentDateFivethY.setDate(currentDateFivethY.getDate() - 2);
            result[i].extraDayfiveth = currentDateFivethY
              .toISOString()
              .slice(0, 10);
          } else if (
            currentDayOfWeekFivethY === 6 &&
            currentDateFivethY.getFullYear() === currentYearFivethY
          ) {
            currentDateFivethY.setDate(currentDateFivethY.getDate() - 1);
            result[i].extraDayfiveth = currentDateFivethY
              .toISOString()
              .slice(0, 10);
          }
        }

        if (currentDayOfWeekSixthY === 0 || currentDayOfWeekSixthY === 6) {
          if (
            currentDayOfWeekSixthY === 0 &&
            currentDateSixthY.getFullYear() === currentYearSixthY
          ) {
            currentDateSixthY.setDate(currentDateSixthY.getDate() - 2);
            result[i].extraDaysixth = currentDateSixthY
              .toISOString()
              .slice(0, 10);
          } else if (
            currentDayOfWeekSixthY === 6 &&
            currentDateSixthY.getFullYear() === currentYearSixthY
          ) {
            currentDateSixthY.setDate(currentDateSixthY.getDate() - 1);
            result[i].extraDaysixth = currentDateSixthY
              .toISOString()
              .slice(0, 10);
          }
        }

        if (currentDayOfWeekSeventhY === 0 || currentDayOfWeekSeventhY === 6) {
          if (
            currentDayOfWeekSeventhY === 0 &&
            currentDateSeventhY.getFullYear() === currentYearSeventhY
          ) {
            currentDateSeventhY.setDate(currentDateSeventhY.getDate() - 2);
            result[i].extraDayseventh = currentDateSeventhY
              .toISOString()
              .slice(0, 10);
          } else if (
            currentDayOfWeekSeventhY === 6 &&
            currentDateSeventhY.getFullYear() === currentYearSeventhY
          ) {
            currentDateSeventhY.setDate(currentDateSeventhY.getDate() - 1);
            result[i].extraDayseventh = currentDateSeventhY
              .toISOString()
              .slice(0, 10);
          }
        }
      }

      const extraDays = [
        "extraDayfirstY",
        "extraDaysecondY",
        "extraDaythirdY",
        "extraDayfourth",
        "extraDayfiveth",
        "extraDaysixth",
        "extraDayseventh",
      ];

      const newObj = {};

      const sumResult = result?.map((obj) => {
        for (let i = 0; i < extraDays.length; i++) {
          const property = extraDays[i];
          if (obj.hasOwnProperty(property)) {
            const propertyName = property.replace("extraDay", "");

            if (propertyName === "firstY") {
              //   console.log(selectedPair, property, obj[propertyName], obj.extraDayfirstY);

               getDataDay({
                selectedPair: selectedPair,
                fromDate: obj.extraDayfirstY,
                granularity: "D",
              });

              // obj.totale3Y = (obj.totale3Y)+1.2321;
            } else if (propertyName === "secondY") {
              //        console.log(selectedPair, property, obj[propertyName], obj.extraDaysecondY);
            } else if (propertyName === "thirdY") {
              //      console.log(selectedPair, property, obj[propertyName], obj.extraDaythirdY);
            } else if (propertyName === "fourth") {
              //      console.log(selectedPair, property,  obj[propertyName], obj.extraDayfourth);
            } else if (propertyName === "fiveth") {
              //        console.log(selectedPair, property,  obj[propertyName], obj.extraDayfiveth);
            } else if (propertyName === "sixth") {
              //         console.log(selectedPair, property,  obj[propertyName], obj.extraDaysixth);
            } else if (propertyName === "seventh") {
              //         console.log(selectedPair, property,  obj[propertyName], obj.extraDayseventh);
            }
            //console.log(`Trovato: ${property}`);
          }
        }
        return obj;
      });

      console.log(sumResult);
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
