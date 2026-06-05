import { useEffect, useState } from "react";
import jsPDF from "jspdf";

import axios from "axios";

import { getPayments, createPayment } from "../services/paymentService";

function Payments() {
  const [payments, setPayments] = useState([]);

  const [donors, setDonors] = useState([]);

  const [formData, setFormData] = useState({
    donorId: "",
    amount: "",
    paymentMethod: "Cash",
    note: "",
  });

  const fetchPayments = async () => {
    const data = await getPayments();

    setPayments(data);
  };

  const fetchDonors = async () => {
    const response = await axios.get("http://localhost:5000/api/donors");

    setDonors(response.data);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPayments();
    fetchDonors();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createPayment(formData);

    fetchPayments();

    setFormData({
      donorId: "",
      amount: "",
      paymentMethod: "Cash",
      note: "",
    });
  };

  const generateReceipt = (payment) => {
    const doc = new jsPDF();

    doc.setFontSize(20);

    doc.text("Temple Donation Receipt", 20, 20);

    doc.setFontSize(12);

    let y = 40;

    doc.text(
      `Date: ${new Date(payment.paymentDate).toLocaleDateString()}`,
      20,
      y,
    );

    y += 10;

    doc.text(`Donor Name: ${payment.donorId?.name}`, 20, y);

    y += 10;

    doc.text(`Amount Paid: Rs. ${payment.amount}`, 20, y);

    y += 10;

    doc.text(`Payment Method: ${payment.paymentMethod}`, 20, y);

    y += 20;

    doc.text("Thank You For Your Contribution", 20, y);

    doc.save(`receipt-${payment._id}.pdf`);
  };
  return (
    <div>
      <h1 className="text-3xl font-bold mb-5">Payments</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-5 rounded shadow mb-10"
      >
        <div className="grid grid-cols-2 gap-4">
          <select
            name="donorId"
            value={formData.donorId}
            onChange={handleChange}
            className="border p-2"
          >
            <option value="">Select Donor</option>

            {donors.map((donor) => (
              <option key={donor._id} value={donor._id}>
                {donor.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange}
            className="border p-2"
          />

          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="border p-2"
          >
            <option>Cash</option>
            <option>UPI</option>
            <option>Bank Transfer</option>
          </select>

          <input
            type="text"
            name="note"
            placeholder="Note"
            value={formData.note}
            onChange={handleChange}
            className="border p-2"
          />
        </div>

        <button className="bg-green-500 text-white px-5 py-2 mt-5 rounded">
          Add Payment
        </button>
      </form>

      <div className="bg-white p-5 rounded shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th>Donor</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Date</th>
              <th>Receipt</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id} className="text-center border-b">
                <td>{payment.donorId?.name}</td>

                <td>₹ {payment.amount}</td>

                <td>{payment.paymentMethod}</td>

                <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => generateReceipt(payment)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Receipt
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

export default Payments;
