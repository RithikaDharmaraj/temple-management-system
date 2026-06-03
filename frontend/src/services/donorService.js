import axios from "axios";

const API = "http://localhost:5000/api/donors";

export const getDonors = async () => {
  const response = await axios.get(API);

  return response.data;
};

export const createDonor = async (data) => {
  const response = await axios.post(API, data);

  return response.data;
};

export const deleteDonor = async (id) => {
  await axios.delete(`${API}/${id}`);
};

export const updateDonor = async (id, data) => {
  const response = await axios.put(`${API}/${id}`, data);

  return response.data;
};