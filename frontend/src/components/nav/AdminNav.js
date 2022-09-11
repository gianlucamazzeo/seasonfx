import React from "react";
import { Link } from "react-router-dom";

const AdminNav = () => (
  <nav>
    <ul className="nav flex-column">
      <li className="nav-item">
        <Link to="/admin/dashboard" className="nav-link">
          Dashboard
        </Link>
      </li>

      <li className="nav-item">
        <Link to="/admin/currency" className="nav-link">
          Currency
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/user/password" className="nav-link">
          Password
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/admin/update" className="nav-link">
          Update data currency
        </Link>
      </li>
    </ul>
  </nav>
);

export default AdminNav;
