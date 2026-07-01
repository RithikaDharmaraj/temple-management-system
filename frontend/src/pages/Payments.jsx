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
    donorSuggestions,
    setDonorSuggestions,
  ] = useState([]);

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

  const [currentPage, setCurrentPage] =
    useState(1);

  const rowsPerPage = 20;

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

  // DONOR NAME SEARCH

  const handleNameChange = (
    value
  ) => {
    const cleanedValue =
      value.trim();

    setSelectedName(
      cleanedValue
    );

    const matchedDonors =
      donors.filter((donor) =>
        donor.name
          .trim()
          .toLowerCase()
          .includes(
            cleanedValue.toLowerCase()
          )
      );

    setDonorSuggestions(
      matchedDonors
    );

    setFilteredAddresses([]);

    setFormData({
      ...formData,
      donorId: "",
    });
  };

  // SELECT DONOR NAME

  const selectDonorName = (
    donorName
  ) => {
    setSelectedName(
      donorName
    );

    const matchedDonors =
      donors.filter(
        (donor) =>
          donor.name === donorName
      );

    setFilteredAddresses(
      matchedDonors
    );

    setDonorSuggestions([]);
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

  // FILTER NAME SEARCH

  const handlePaymentFilterName =
    (value) => {
      const cleanedValue =
        value.trim();

      const matchedDonors =
        donors.filter((donor) =>
          donor.name
            .trim()
            .toLowerCase()
            .includes(
              cleanedValue.toLowerCase()
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
      setCurrentPage(1);
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

    setDonorSuggestions([]);

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
          .toLowerCase()
          .includes(
            filters.donorName
              .trim()
              .toLowerCase()
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

    const totalPages = Math.ceil(
      filteredPayments.length /
        rowsPerPage
    );

    const paginatedPayments =
      filteredPayments.slice(
        (currentPage - 1) *
          rowsPerPage,
        currentPage * rowsPerPage
      );

  const formatDate = (dateValue) => {
    const date = new Date(dateValue);

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };
  // PDF GENERATION

  const generateDonorStatement = async (donorId) => {
    const response = await axios.get(
      `http://localhost:5000/api/payments/donor/${donorId}`
    );

    const donorPayments = response.data;

    if (donorPayments.length === 0) return;

    const donor = donorPayments[0].donorId;

    const rowsPerPage = 32;
    const totalPages = Math.ceil(
      donorPayments.length / rowsPerPage
    );

    const pdf = new jsPDF("p", "mm", "a4");

    for (
      let page = 0;
      page < totalPages;
      page++
    ) {
      if (page > 0) pdf.addPage();

      const container =
        document.createElement("div");

      container.style.width = "800px";
      container.style.background =
        "white";
      container.style.padding = "30px";
      container.style.fontFamily =
        "Arial, sans-serif";
      container.style.boxSizing =
        "border-box";
      container.style.border =
        "3px solid black";

      const pagePayments =
        donorPayments.slice(
          page * rowsPerPage,
          (page + 1) * rowsPerPage
        );

      let html = "";

      // HEADER ONLY FIRST PAGE
      if (page === 0) {
        html += `
          <h1 style="text-align:center;margin-bottom:25px;">
            Donor Payment Statement
          </h1>

          <p><b>Name:</b> ${donor.name}</p>
          <p><b>Address:</b> ${donor.address}</p>
          <p><b>Phone:</b> ${donor.phone || "-"}</p>
          <br/>
        `;
      }

      html += `
        <table 
          border="1" 
          cellspacing="0" 
          cellpadding="8"
          width="100%"
          style="border-collapse:collapse;text-align:left;"
        >
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
      `;

      pagePayments.forEach((payment) => {
        html += `
          <tr>
            <td>
              ${formatDate(payment.paymentDate)}
            </td>
            <td>
              Rs. ${payment.amount}
            </td>
          </tr>
        `;
      });

      html += `
          </tbody>
        </table>
      `;

      // TOTAL ONLY LAST PAGE
      if (page === totalPages - 1) {
        html += `
          <br/>
          <h3>
            Total Paid: Rs. ${donor.totalPaid}
          </h3>
        `;
      }

      container.innerHTML = html;
      document.body.appendChild(
        container
      );

      const canvas =
        await html2canvas(container, {
          scale: 2,
        });

      const imgData =
        canvas.toDataURL("image/png");

      const pdfWidth =
        pdf.internal.pageSize.getWidth();

      const pdfHeight =
        (canvas.height *
          (pdfWidth - 10)) /
        canvas.width;

      pdf.addImage(
        imgData,
        "PNG",
        5,
        5,
        pdfWidth - 10,
        pdfHeight
      );

      document.body.removeChild(
        container
      );
    }

    pdf.save(
      `${donor.name}-statement.pdf`
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

          <div className="relative">
            <ReactTransliterate
              lang="ta"
              value={selectedName}
              onChangeText={(text) =>
                handleNameChange(
                  text
                )
              }
              placeholder="Type Donor Name"
              className="border p-3 rounded w-full"
            />

            {donorSuggestions.length >
              0 &&
              selectedName !==
                "" && (
                <div className="absolute bg-white border rounded shadow-lg w-full max-h-52 overflow-y-auto z-50">
                  {donorSuggestions.map(
                    (donor) => (
                      <div
                        key={
                          donor._id
                        }
                        onClick={() =>
                          selectDonorName(
                            donor.name
                          )
                        }
                        className="p-3 hover:bg-gray-100 cursor-pointer border-b"
                      >
                        <p className="font-medium">
                          {
                            donor.name
                          }
                        </p>

                        <p className="text-sm text-gray-500">
                          {
                            donor.address
                          }
                        </p>
                      </div>
                    )
                  )}
                </div>
              )}
          </div>

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

          <select
            value={
              filters.donorAddress
            }
            onChange={(e) => {
              setFilters({
                ...filters,
                donorAddress: e.target.value,
              });
              setCurrentPage(1);
            }}
            disabled={
              filters.donorName ===
              ""
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

          <select
            value={filters.ledger}
            onChange={(e) => {
              setFilters({
                ...filters,
                ledger: e.target.value,
              });
              setCurrentPage(1);
            }}
            disabled={
              filters.donorName !==
                "" ||
              filters.donorAddress !==
                ""
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
            {paginatedPayments.map(
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
                    Rs.{" "}
                    {payment.amount}
                  </td>

                  <td className="p-4">
                    {formatDate(payment.paymentDate)}
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
        <div className="flex justify-center items-center gap-4 py-4">
          <button
            disabled={
              currentPage === 1
            }
            onClick={() =>
              setCurrentPage(
                currentPage - 1
              )
            }
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span>
            Page {currentPage} of{" "}
            {totalPages || 1}
          </span>

          <button
            disabled={
              currentPage === totalPages ||
              totalPages === 0
            }
            onClick={() =>
              setCurrentPage(
                currentPage + 1
              )
            }
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Payments;