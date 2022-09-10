import React, { useState, useEffect } from "react";
import { PoweroffOutlined } from "@ant-design/icons";
import {
  Button,
  Dropdown,
  Menu,
  message,
  Space,
  Tooltip,
  Select,
  DatePicker,
} from "antd";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { getCurrencies } from "../../../functions/currency";

const { RangePicker } = DatePicker;

const { Option } = Select;

const CurrencyData = ({ history, match }) => {
  const [loadings, setLoadings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currencies, setCurrencies] = useState([]);
  const [selectedClient,setSelectedClient] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');


  const handleChange = (value) => {
    setSelectedClient(value)
   console.log(`selected ${value}`);
  };

  const changePicker  = (date, dateString) => {
    setFromDate(dateString[0])
    setToDate(dateString[1])
    console.log(date, dateString);
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

    if(selectedClient.length > 0 && fromDate  && toDate){
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[0] = true;
      return newLoadings;
    });


     
      setTimeout(() => {
        setLoadings(prevLoadings => {
          const newLoadings = [...prevLoadings];
          newLoadings[0] = false;
          message.info("Data Update");
          return newLoadings;
        });
      }, 6000);

      console.log(selectedClient, fromDate, toDate)
    }
    return console.log('error, data missing')
  //  
   
   
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
                      value={selectedClient}
                    
                    >
                      {pairs()}
                    </Select>

                    <RangePicker onChange={changePicker} />

                    <Button
                    style={{marginLeft: 20}}
                    loading={loadings[0]}
                    onClick={handleSubmit}
                    >
                      Update Data
                    </Button>
                  </div>
                </form>
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
