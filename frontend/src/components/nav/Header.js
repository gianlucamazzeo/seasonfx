import React, { useState } from "react";
import { Menu } from "antd";
import {
  AppstoreOutlined,
  SettingOutlined,
  UserOutlined,
  UserAddOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { auth } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const Header = () => {
  const [current, setCurrent] = useState("home");

  let dispatch = useDispatch();
  let { user } = useSelector((state) => ({ ...state }));

  let history = useHistory();

  const handleClick = (e) => {
    // console.log(e.key);
    setCurrent(e.key);
  };

  const logout = () => {
    auth.signOut();
    dispatch({
      type: "LOGOUT",
      payload: null,
    });
    history.push("/login");
  };



  const menuItems = [
        {
            key: 'home',
            icon: <AppstoreOutlined />,
            label: (
              <Link to="/">Home</Link>
            ),
            style: {float: 'left', display: 'block'}
        },
        {
          label: user  ? user.email.split("@")[0] : 'Username',
          key: 'username',
          icon: <SettingOutlined />,
          
              children: [
                {
                  label: 'Logout',
                  key: 'logout',
                  icon: <LogoutOutlined />,
                  onClick: logout
                },
              ],
            style: user ? {float: 'right', display: 'block'} : {float: 'left', display: 'block'}
        },
        {
          key: 'register',
          icon: <UserAddOutlined />,
          label: (
            <Link to="/register">Register</Link>
          ),
          style: {float: 'right'}
         
        },
        {
          key: 'login',
          icon: <UserOutlined />,
          label: (
            <Link to="/login">Login</Link>
          ),
          style: {float: 'right'}
      },

  ];

  const LoginLogoutItems = function checkLoginLogout(user) {
  //  return age >= 18;
    return user  ? menuItems.filter((e) => e.key !== 'login' && e.key !== 'register'  ) : menuItems.filter((e) => e.key !== 'username'  );
  }

  return (
    <Menu key="menu" style={{display: 'inline-block', width: '100%'}} onClick={handleClick} selectedKeys={[current]} mode="horizontal" items={LoginLogoutItems(user)} />
  );
};

export default Header;
