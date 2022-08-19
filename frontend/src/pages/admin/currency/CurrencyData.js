import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {  } from "../../../functions/currency";

const CurrencyData = ({ history, match }) => {

    const [loading, setLoading] = useState(false);





  const handleSubmit = (e) => {
    e.preventDefault();
  };



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
          <h4>Update currency data</h4>
        )}
       
        <hr />
        
      </div>
    </div>
  </div>
  )


};

export default CurrencyData;
