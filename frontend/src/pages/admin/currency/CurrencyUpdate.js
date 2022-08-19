import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { getCurrency, updateCurrency } from "../../../functions/currency";

const CurrencyUpdate = ({ history, match }) => {
  const { user } = useSelector((state) => ({ ...state }));

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCurrency();
  }, []);

  const loadCurrency = () =>
    getCurrency(match.params.slug).then((c) => setName(c.data.name));

  const handleSubmit = (e) => {
    e.preventDefault();
    
    setLoading(true);
    updateCurrency(match.params.slug, { name }, user.token)
      .then((res) => {
       
        setLoading(false);
        setName("");
        toast.success(`"${res.data.name}" is updated`);
        history.push("/admin/currency");
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        if (err.response.status === 400) toast.error(err.response.data);
      });
  };

  const currencyForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Name</label>
        <input
          type="text"
          className="form-control"
          onChange={(e) => setName(e.target.value)}
          value={name}
          autoFocus
          required
        />
        <br />
        <button className="btn btn-outline-primary">Save</button>
      </div>
    </form>
  );

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
            <h4>Update currency</h4>
          )}
          {currencyForm()}
          <hr />
          
        </div>
      </div>
    </div>
  );
};

export default CurrencyUpdate;
