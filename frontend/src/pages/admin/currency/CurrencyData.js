import React, { useState, useEffect } from "react";
import { Button, message, Space, Select, DatePicker } from "antd";
import AdminNav from "../../../components/nav/AdminNav";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  getCurrencies,
  updateDataCurrency,
  getMostRecentDate,
} from "../../../functions/currency";

const { RangePicker } = DatePicker;

const { Option } = Select;

const CurrencyData = ({ history, match }) => {
  const { user } = useSelector((state) => ({ ...state }));
  const [loadings, setLoadings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currencies, setCurrencies] = useState([]);
  const [selectedPair, setSelectedPair] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [mostRecentDate, setMostRecentDate] = useState("");

  const handleChange = (value) => {
    setSelectedPair(value);
    console.log(`selected ${value}`);
  };

  const changePicker = (date, dateString) => {
    setFromDate(dateString[0]);
    setToDate(dateString[1]);
    console.log(date, dateString);
  };

  useEffect(() => {
    try {
      getCurrencies().then((c) => setCurrencies(c.data));
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    try {
      if (user.token) {
        getMostRecentDate(user.token).then((c) =>
          setMostRecentDate(c.data.mostRecentDate)
        );
      }
    } catch (error) {
      console.log(error);
    }
  }, [user.token]);

  // console.log(currencies);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedPair.length > 0 && fromDate && toDate) {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[0] = true;
        return newLoadings;
      });

      const ObjectDataPost = {
        name: selectedPair,
        fromData: fromDate,
        toData: toDate,
        granularity: "D",
      };

      updateDataCurrency(ObjectDataPost, user.token)
        .then((res) => {
          setLoadings((prevLoadings) => {
            const newLoadings = [...prevLoadings];
            newLoadings[0] = false;
            message.info(`Data Update:  `);
            return newLoadings;
          });
          getMostRecentDate(user.token).then((c) =>
          setMostRecentDate(c.data.mostRecentDate)
        );
        })
        .catch((err) => {
          console.log(err);
          setLoadings((prevLoadings) => {
            const newLoadings = [...prevLoadings];
            newLoadings[0] = false;
            return newLoadings;
          });
          if (err.response.status === 400) toast.error(err.response.data);
        });
      // updateDataCurrency
    }
    return console.log("error, data missing");
  };

  const pairs = () => {
    const menu = [];
    currencies.map((e, i) =>
      menu.push(
        <Option key={i} value={e.name}>
          {e.name}
        </Option>
      )
    );
    return menu;
  };

  // const menu = <Menu onClick={handleMenuClick} items={pairs()} value={selectedClient}  />;

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col">
          {loading ? (
            <h4 className="text-danger">Loading..</h4>
          ) : (
            <>
              <h4>Update currency data</h4>
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
                      Update Data
                    </Button>
                  </div>
                </form>
                {mostRecentDate && <p>Last Candle: {mostRecentDate} </p>}
              </Space>
            </>
          )}

          <hr />
        </div>
      </div>
    </div>
  );
};

export default CurrencyData;
