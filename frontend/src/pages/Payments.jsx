import { useEffect, useState } from "react";

import jsPDF from "jspdf";

import html2canvas from "html2canvas";

import axios from "axios";

import {
  getPayments,
  createPayment,
} from "../services/paymentService";

import { ReactTransliterate } from "react-transliterate";

import "react-transliterate/dist/index.css";

function Payments() {
  const [payments, setPayments] =
    useState([]);

  const [donors, setDonors] =
    useState([]);

  const [selectedName, setSelectedName] =
    useState("");

  const [
    filteredAddresses,
    setFilteredAddresses,
  ] = useState([]);

  const [
    paymentAddressOptions,
    setPaymentAddressOptions,
  ] = useState([]);

  const [filters, setFilters] =
    useState({
      donorName: "",
      donorAddress: "",
      ledger: "",
    });

  const [formData, setFormData] =
    useState({
      donorId: "",
      amount: "",
      paymentDate: "",
    });

  const fetchPayments = async () => {
    const data = await getPayments();

    setPayments(data);
  };

  const fetchDonors = async () => {
    const response =
      await axios.get(
        "http://localhost:5000/api/donors"
      );

    setDonors(response.data);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPayments();

    fetchDonors();
  }, []);

  // NAME SEARCH

  const handleNameChange = (name) => {
    setSelectedName(name);

    const searchValue =
      name.trim();

    const matchedDonors =
      donors.filter((donor) =>
        donor.name
          .trim()
          .includes(
            searchValue.trim()
          )
      );

    setFilteredAddresses(
      matchedDonors
    );

    setFormData({
      ...formData,
      donorId: "",
    });
  };

  // ADDRESS SELECT

  const handleAddressChange = (
    donorId
  ) => {
    setFormData({
      ...formData,
      donorId,
    });
  };

  // FILTER SEARCH

  const handlePaymentFilterName =
    (value) => {

      const cleanedValue =
        value.trim();

      const matchedDonors =
        donors.filter((donor) =>
          donor.name
            .trim()
            .includes(
              cleanedValue
            )
        );

      setPaymentAddressOptions(
        matchedDonors
      );

      setFilters({
        donorName:
          cleanedValue,
        donorAddress: "",
        ledger: "",
      });
    };

  // FORM CHANGE

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  // SUBMIT PAYMENT

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.donorId) {
      alert(
        "Select donor address"
      );
      return;
    }

    if (!formData.amount) {
      alert(
        "Enter amount"
      );
      return;
    }

    await createPayment(formData);

    fetchPayments();

    setSelectedName("");

    setFilteredAddresses([]);

    setFormData({
      donorId: "",
      amount: "",
      paymentDate: "",
    });

    alert(
      "Payment Added Successfully"
    );
  };

  // FILTER PAYMENTS

  const filteredPayments =
    payments.filter((payment) => {

      const matchesName =
        filters.donorName === "" ||
        payment.donorId?.name
          .trim()
          .includes(
            filters.donorName.trim()
          );

      const matchesAddress =
        filters.donorAddress === "" ||
        payment.donorId?.address ===
          filters.donorAddress;

      const matchesLedger =
        filters.ledger === "" ||
        payment.donorId?.ledger ===
          filters.ledger;

      return (
        matchesName &&
        matchesAddress &&
        matchesLedger
      );
    });

  // PDF GENERATION

  const generateDonorStatement =
    async (donorId) => {

      const response =
        await axios.get(
          `http://localhost:5000/api/payments/donor/${donorId}`
        );

      const donorPayments =
        response.data;

      if (
        donorPayments.length === 0
      )
        return;

      const donor =
        donorPayments[0].donorId;

      const container =
        document.createElement(
          "div"
        );

      container.style.padding =
        "20px";

      container.style.background =
        "white";

      container.style.width =
        "700px";

      container.innerHTML = `
        <h1 style="font-size:24px;margin-bottom:20px;">
          Donor Payment Statement
        </h1>

        <p>Name: ${donor.name}</p>
        <br>
        <p>Address: ${donor.address}</p>
        <br>
        <p> Phone Number: ${donor.phone}
        <br>
        <br/>

        <table border="1" cellspacing="0" cellpadding="10" width="100%">
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
            </tr>
          </thead>

          <tbody>
            ${donorPayments
              .map(
                (payment) => `
              <tr>
                <td>
                  ${new Date(
                    payment.paymentDate
                  ).toLocaleDateString()}
                </td>

                <td>
                  Rs. ${payment.amount}
                </td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <br/>

        <h3>
          Total Paid:
          Rs. ${donor.totalPaid}
        </h3>
      `;

      document.body.appendChild(
        container
      );

      const canvas =
        await html2canvas(
          container
        );

      const imgData =
        canvas.toDataURL(
          "image/png"
        );

      const pdf =
        new jsPDF(
          "p",
          "mm",
          "a4"
        );

      const pdfWidth =
        pdf.internal.pageSize.getWidth();

      const imgWidth =
        pdfWidth - 20;

      const imgHeight =
        (canvas.height *
          imgWidth) /
        canvas.width;

      pdf.addImage(
        imgData,
        "PNG",
        10,
        10,
        imgWidth,
        imgHeight
      );

      pdf.save(
        `${donor.name}-statement.pdf`
      );

      document.body.removeChild(
        container
      );
    };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Payments
      </h1>

      {/* PAYMENT FORM */}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* DONOR NAME */}

          <ReactTransliterate
            lang="ta"
            value={selectedName}
            onChangeText={(text) =>
              handleNameChange(text)
            }
            placeholder="Type Donor Name"
            className="border p-3 rounded w-full"
          />

          {/* ADDRESS */}

          <select
            value={formData.donorId}
            onChange={(e) =>
              handleAddressChange(
                e.target.value
              )
            }
            className="border p-3 rounded"
            disabled={!selectedName}
          >
            <option value="">
              Select Address
            </option>

            {filteredAddresses.map(
              (donor) => (
                <option
                  key={donor._id}
                  value={donor._id}
                >
                  {donor.address}
                </option>
              )
            )}
          </select>

          {/* AMOUNT */}

          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange}
            className="border p-3 rounded"
          />

          {/* DATE */}

          <input
            type="date"
            name="paymentDate"
            value={
              formData.paymentDate
            }
            onChange={handleChange}
            className="border p-3 rounded"
          />
        </div>

        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 mt-5 rounded-lg">
          Add Payment
        </button>
      </form>

      {/* FILTERS */}

      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* FILTER NAME */}

          <ReactTransliterate
            lang="ta"
            value={filters.donorName}
            onChangeText={(text) =>
              handlePaymentFilterName(
                text
              )
            }
            placeholder="Search Donor Name"
            className="border p-3 rounded w-full"
          />

          {/* FILTER ADDRESS */}

          <select
            value={
              filters.donorAddress
            }
            onChange={(e) =>
              setFilters({
                ...filters,
                donorAddress:
                  e.target.value,
              })
            }
            disabled={
              filters.donorName === ""
            }
            className="border p-3 rounded"
          >
            <option value="">
              Select Address
            </option>

            {paymentAddressOptions.map(
              (donor) => (
                <option
                  key={donor._id}
                  value={donor.address}
                >
                  {donor.address}
                </option>
              )
            )}
          </select>

          {/* FILTER LEDGER */}

          <select
            value={filters.ledger}
            onChange={(e) =>
              setFilters({
                ...filters,
                ledger:
                  e.target.value,
              })
            }
            disabled={
              filters.donorName !== "" ||
              filters.donorAddress !== ""
            }
            className="border p-3 rounded"
          >
            <option value="">
              All Ledgers
            </option>

            <option>
              A Ledger
            </option>

            <option>
              B Ledger
            </option>

            <option>
              C Ledger
            </option>

            <option>
              D Ledger
            </option>
          </select>
        </div>
      </div>

      {/* PAYMENT TABLE */}

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full border-collapse">

          <thead>
            <tr className="bg-gray-100">

              <th className="p-4 text-left">
                Donor
              </th>

              <th className="p-4 text-left">
                Address
              </th>

              <th className="p-4 text-left">
                Ledger
              </th>

              <th className="p-4 text-left">
                Amount
              </th>

              <th className="p-4 text-left">
                Date
              </th>

              <th className="p-4 text-center">
                Statement
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredPayments.map(
              (payment) => (
                <tr
                  key={payment._id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="p-4 font-medium">
                    {
                      payment.donorId
                        ?.name
                    }
                  </td>

                  <td className="p-4">
                    {
                      payment.donorId
                        ?.address
                    }
                  </td>

                  <td className="p-4">
                    {
                      payment.donorId
                        ?.ledger
                    }
                  </td>

                  <td className="p-4">
                    Rs. {payment.amount}
                  </td>

                  <td className="p-4">
                    {new Date(
                      payment.paymentDate
                    ).toLocaleDateString()}
                  </td>

                  <td className="p-4 text-center">
                    <button
                      onClick={() =>
                        generateDonorStatement(
                          payment
                            .donorId
                            ?._id
                        )
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                      Download
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Payments;