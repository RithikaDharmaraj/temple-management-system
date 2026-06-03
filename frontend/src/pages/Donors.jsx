import { useEffect, useState } from "react";
import { getDonors, createDonor,deleteDonor,updateDonor } from "../services/donorService";

function Donors() {
  const [donors, setDonors] = useState([]);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    lecture: "",
    promisedAmount: "",
  });

  const fetchDonors = async () => {
    try {
      const data = await getDonors();

      console.log(data);

      setDonors(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
  const loadDonors = async () => {
    await fetchDonors();
  };

  loadDonors();
}, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure?"
  );

  if (!confirmDelete) return;

  await deleteDonor(id);

  fetchDonors();
};

const handleEdit = (donor) => {
  setFormData({
    name: donor.name,
    phone: donor.phone,
    address: donor.address,
    lecture: donor.lecture,
    promisedAmount: donor.promisedAmount,
  });

  setEditId(donor._id);
};

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (editId) {
    await updateDonor(editId, {
      ...formData,
      pendingAmount:
        formData.promisedAmount,
    });

    setEditId(null);
  } else {
    await createDonor({
      ...formData,
      totalPaid: 0,
      pendingAmount:
        formData.promisedAmount,
    });
  }

  fetchDonors();

  setFormData({
    name: "",
    phone: "",
    address: "",
    lecture: "",
    promisedAmount: "",
  });
};

  return (
    <div>
      <h1 className="text-3xl font-bold mb-5">
        Donors
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-5 rounded shadow mb-10"
      >
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="border p-2"
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="border p-2"
          />

          <input
            type="text"
            name="lecture"
            placeholder="Lecture"
            value={formData.lecture}
            onChange={handleChange}
            className="border p-2"
          />

          <input
            type="number"
            name="promisedAmount"
            placeholder="Promised Amount"
            value={formData.promisedAmount}
            onChange={handleChange}
            className="border p-2"
          />
        </div>

        <button className="bg-blue-500 text-white px-5 py-2 mt-5 rounded">
  {editId ? "Update Donor" : "Add Donor"}
</button>
      </form>

      <div className="bg-white p-5 rounded shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th>Name</th>
              <th>Phone</th>
              <th>Lecture</th>
              <th>Promised</th>
              <th>Paid</th>
              <th>Pending</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {donors.map((donor) => (
              <tr key={donor._id} className="text-center border-b">
                <td>{donor.name}</td>
                <td>{donor.phone}</td>
                <td>{donor.lecture}</td>
                <td>{donor.promisedAmount}</td>
                <td>{donor.totalPaid}</td>
                <td>{donor.pendingAmount}</td>
                <td className="flex gap-2 justify-center py-2">
                  <button
                    onClick={() => handleEdit(donor)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(donor._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Donors;