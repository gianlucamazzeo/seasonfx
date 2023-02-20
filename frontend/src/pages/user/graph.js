import React, { useState, useEffect } from "react";
import UserNav from "../../components/nav/UserNav";
import { Button, message, Space, Select, DatePicker } from "antd";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";


const Graph = (props) => {
    const {dataCandles, dateIndex } = props;
console.log(dateIndex, dataCandles)




return (

    <div>Graph</div>
)


}

export default Graph;

