import React, { useState, useEffect, useCallback, useMemo } from "react";
import UserNav from "../../components/nav/UserNav";
import { Button, message, Space, Select, DatePicker } from "antd";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getCurrencies, getLocalDataCurrency } from "../../functions/currency";
import { getDateArray, formatDate } from "../utils/util";
import Graph from "./graph";

const { RangePicker } = DatePicker;

const { Option } = Select;

const Plot = ({ history, match }) => {
  const { user } = useSelector((state) => ({ ...state }));
  const [loadings, setLoadings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currencies, setCurrencies] = useState([]);
  const [selectedPair, setSelectedPair] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [dataCandles, setDataCandles] = useState({});
  const [lastDateYear, setLastDateYear] = useState([]);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [january, setJanuary] = useState(0);
  const [december, setDecember] = useState(11);
  const [dataIndex, setDataIndex] = useState(null);

  const graph = useMemo(
    () => (
      <Graph
        loading={loading}
        dataCandles={dataCandles}
        setDataCandles={setDataCandles}
        dataCurId={selectedPair}
        selectedPair={selectedPair}
        fromDate={fromDate}
        toDate={toDate}
      />
    ),
    [dataCandles, loading, selectedPair, fromDate, toDate]
  );

  const handleChange = useCallback((value) => {
    setSelectedPair(value);
  }, []);

  const changePicker = useCallback((date, dateString) => {
    setFromDate(dateString[0]);
    setToDate(dateString[1]);
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (selectedPair.length > 0 && fromDate && toDate) {
        setLoadings((prevLoadings) => {
          const newLoadings = [...prevLoadings];
          newLoadings[0] = true;
          return newLoadings;
        });

        const ObjectDataPost = {
          id: selectedPair,
          fromData: fromDate,
          toData: toDate,
          granularity: "D",
        };

        const dataIndex = [];

        getLocalDataCurrency(ObjectDataPost, user.token)
          .then((res) => {


            console.log(res.data)
            /*
            const monthPostFrom = ObjectDataPost.fromData.substring(5, 7);
            const monthPostTo = ObjectDataPost.toData.substring(5, 7);
            const enMonthPostFrom = monthPostFrom.replace(/^0+/, "") - 1;
            const enMonthPostTo = monthPostTo.replace(/^0+/, "") - 1;
            const endMonthTo = ObjectDataPost.toData.substring(8, 10);

            const firstDay = new Date(currentYear, enMonthPostFrom, 1);
            const lastDay = new Date(currentYear, enMonthPostTo, endMonthTo);
            const dateArray = getDateArray(firstDay, lastDay);

            let newDateArrayIndex = dateArray.map((el) => {
              var year = el.getFullYear();
              var month = el.getMonth();
              var day = el.getDate();
              let period7yearsAgoTimestamp = new Date(year - 7, month, day);
              let period6yearsAgoTimestamp = new Date(year - 6, month, day);
              let period5yearsAgoTimestamp = new Date(year - 5, month, day);
              let period4yearsAgoTimestamp = new Date(year - 4, month, day);
              let period3yearsAgoTimestamp = new Date(year - 3, month, day);
              let period2yearsAgoTimestamp = new Date(year - 2, month, day);
              let period1yearsAgoTimestamp = new Date(year - 1, month, day);
              //  const filteredResult = jsObject.find((e) => e.b == 6);
              let timestampDate = {
                firstY: formatDate(period1yearsAgoTimestamp),
                secondY: formatDate(period2yearsAgoTimestamp),
                thirdY: formatDate(period3yearsAgoTimestamp),
                fourth: formatDate(period4yearsAgoTimestamp),
                fiveth: formatDate(period5yearsAgoTimestamp),
                sixth: formatDate(period6yearsAgoTimestamp),
                seventh: formatDate(period7yearsAgoTimestamp),
              }; //  ['Work', 9]
              //mapPeriodLastYear.push(timestampDate);

              return timestampDate;
            });

            dataIndex.push(newDateArrayIndex);
            */
            setDataCandles({ ...res.data });

            setLoadings((prevLoadings) => {
              const newLoadings = [...prevLoadings];
              newLoadings[0] = false;
              message.info(`Data get:  `);
              return newLoadings;
            });
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
            if (err.response.status === 400) toast.error(err.response.data);
          });

        setDataIndex(dataIndex);
      }
    },
    [fromDate, toDate, user.token, selectedPair]
  );



  useEffect(() => {
    const currentYear = new Date().getFullYear();

    const firstDay = new Date(currentYear, january, 1);
    const lastDay = new Date(currentYear, december, 31);
    const dateArray = getDateArray(firstDay, lastDay);
    let newDateArrayIndex = dateArray.map((el) => {
      var year = el.getFullYear();
      var month = el.getMonth();
      var day = el.getDate();
      let period3yearsAgoTimestamp = new Date(year - 3, month, day);
      //  const filteredResult = jsObject.find((e) => e.b == 6);
      let timestampDate = [
        el.getTime(),
        formatDate(el),
        period3yearsAgoTimestamp.getTime(),
        formatDate(period3yearsAgoTimestamp),
      ]; //  ['Work', 9]
      //mapPeriodLastYear.push(timestampDate);
      return [...timestampDate];
    });

    // const newDateArrayIndex = [...dateArray

    setLastDateYear(newDateArrayIndex);

    try {
      getCurrencies().then((c) => setCurrencies(c.data));
    } catch (error) {
      console.log(error);
    }
  }, [december, january]);

  const pairs = () => {
    const menu = [];
    // console.log(currencies);
    currencies.map((e, i) =>
      menu.push(
        <Option key={i} value={e._id}>
          {e.name}
        </Option>
      )
    );
    return menu;
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <UserNav />
        </div>
        <div className="col">
          {loading ? (
            <h4 className="text-danger">Loading..</h4>
          ) : (
            <>
              <h4>Plot Pair Data</h4>
              <Space size={102}>
                <form method="post">
                  <div className="form-group">
                    <Select
                      showSearch
                      style={{
                        width: 200,
                        marginRight: 20,
                      }}
                      placeholder="Search to Select"
                      optionFilterProp="children"
                      onChange={handleChange}
                      value={selectedPair}
                    >
                      {pairs()}
                    </Select>

                    <RangePicker onChange={changePicker} />

                    <Button
                      style={{ marginLeft: 20 }}
                      loading={loadings[0]}
                      onClick={handleSubmit}
                    >
                      Get data
                    </Button>
                  </div>
                </form>
              </Space>
            </>
          )}

          <hr />
          {graph}
        </div>
      </div>
    </div>
  );
};

export default Plot;
