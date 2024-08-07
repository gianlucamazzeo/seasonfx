import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getCurrencies, updateDataCurrency, updateDataCurrencyH4 } from "../../../functions/currency";
import "../../../App.css";
import { Button, message, Space, Select, DatePicker, Tabs } from "antd";
const { TabPane } = Tabs;
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
  const [pairRecentDate, setPairRecentDate] = useState("");

  const handleChange = (value) => {
    setSelectedPair(value);
    console.log(`selected ${value}`);
  };

  const changePicker = (date, dateString) => {
    setFromDate(dateString[0]);
    setToDate(dateString[1]);
  };

  useEffect(() => {
    try {
      getCurrencies().then((c) => setCurrencies(c.data));
    } catch (error) {
      console.log(error);
    }
  }, []);

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
          /*
          getMostRecentDate(user.token).then((c) =>
          setMostRecentDate(c.data.mostRecentDate)
        );
        */
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

  const handleSubmitH4 = (e) => {
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
        granularity: "H4",
      };

      updateDataCurrencyH4(ObjectDataPost, user.token)
        .then((res) => {
          setLoadings((prevLoadings) => {
            const newLoadings = [...prevLoadings];
            newLoadings[0] = false;
            message.info(`Data Update:  `);
            return newLoadings;
          });
          /*
          getMostRecentDate(user.token).then((c) =>
          setMostRecentDate(c.data.mostRecentDate)
        );
        */
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
              <Tabs defaultActiveKey="1">
                <TabPane
                  tab={
                    <span style={{ fontWeight: "bold" }}>
                      UPDATE DATA DAILY
                    </span>
                  }
                  key="1"
                >
                  <h4>Update data</h4>
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
                  </Space>
                </TabPane>
                <TabPane
                  tab={
                    <span style={{ fontWeight: "bold" }}>UPDATE DATA H4</span>
                  }
                  key="2"
                >
                  <h4>Update data</h4>
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
                        onClick={handleSubmitH4}
                      >
                        Update Data
                      </Button>
                    </div>
                  </form>
                </Space>
                </TabPane>
              </Tabs>
            </>
          )}

          <hr />
        </div>
      </div>
    </div>
  );
};

export default CurrencyData;
