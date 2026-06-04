import axios from "axios";

const API = "http://localhost:5000/api/payments";

export const getPayments = async () => {
  const response = await axios.get(API);

  return response.data;
};

export const createPayment = async (data) => {
  const response = await axios.post(API, data);

  return response.data;
};