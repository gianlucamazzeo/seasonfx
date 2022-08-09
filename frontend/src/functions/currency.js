import axios from "axios";

export const getCurrencies = async () =>
  await axios.get(`${process.env.REACT_APP_API}/currencies`);

export const getCurrency = async (slug) =>
  await axios.get(`${process.env.REACT_APP_API}/currency/${slug}`);

export const removeCurrency = async (slug, authtoken) =>
  await axios.delete(`${process.env.REACT_APP_API}/currency/${slug}`, {
    headers: {
      authtoken,
    },
  });

export const updateCurrency = async (slug, currency, authtoken) =>
  await axios.put(`${process.env.REACT_APP_API}/category/${slug}`, {
    headers: {
      authtoken,
    },
  });

export const createCurrency = async (currency, authtoken) =>
  await axios.post(`${process.env.REACT_APP_API}/currency`, currency, {
    headers: {
      authtoken,
    },
  });
