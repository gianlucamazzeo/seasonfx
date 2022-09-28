import React, { useState, useEffect } from "react";
import UserNav from "../components/nav/UserNav";
import { useSelector } from "react-redux";

const Home = () => {
  const { user } = useSelector((state) => ({ ...state }));
  
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">{ user && user.role === 'subscriber' &&   <UserNav />  }
        </div>
        <div className="col">
          <p>react home</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
