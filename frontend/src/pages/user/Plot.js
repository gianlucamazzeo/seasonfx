import React, { useState, useEffect } from "react";
import UserNav from "../../components/nav/UserNav";
import {
  Button,
  message,
  Space,
  Select,
  DatePicker,
} from "antd";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getCurrencies, getLocalDataCurrency } from "../../functions/currency";

const { RangePicker } = DatePicker;

const { Option } = Select;


const Plot = ({ history, match }) => {
  const { user } = useSelector((state) => ({ ...state }));
  const [loadings, setLoadings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currencies, setCurrencies] = useState([]);
  const [selectedPair,setSelectedPair] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const handleChange = (value) => {
    setSelectedPair(value)
   console.log(`selected ${value}`);
  };

  const changePicker  = (date, dateString) => {
    setFromDate(dateString[0])
    setToDate(dateString[1])
    console.log(date, dateString);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(selectedPair.length > 0 && fromDate  && toDate){

      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[0] = true;
        return newLoadings;
      });

      const ObjectDataPost = {
        id: selectedPair,
        fromData: fromDate,
        toData : toDate,
        granularity: "D"
      }

      getLocalDataCurrency(ObjectDataPost,user.token)
      .then((res) => {
        console.log(res);

        setLoadings(prevLoadings => {
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

      

    }


  }

  useEffect(() => {
    try {
      getCurrencies().then((c) => setCurrencies(c.data));
    } catch (error) {
      console.log(error);
    }
  }, []);

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
                    style={{marginLeft: 20}}
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
        </div>
      </div>
    </div>
  );
};

export default Plot;
