import { useEffect, useState } from "react";

import {
  getDonors,
  createDonor,
  deleteDonor,
  updateDonor,
} from "../services/donorService";

import { ReactTransliterate } from "react-transliterate";

import "react-transliterate/dist/index.css";

function Donors() {
  const [donors, setDonors] =
    useState([]);

  const [editId, setEditId] =
    useState(null);

  const [filters, setFilters] =
    useState({
      name: "",
      phone: "",
      address: "",
      ledger: "",
    });

  const [formData, setFormData] =
    useState({
      name: "",
      phone: "",
      address: "",
      promisedAmount: "",
    });

  const [currentPage, setCurrentPage] =
    useState(1);

  const rowsPerPage = 20;

  const fetchDonors = async () => {
    try {
      const data = await getDonors();

      setDonors(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDonors();
  }, []);

  // LEDGER CALCULATION

  const getLedger = (amount) => {
    const value = Number(amount);

    if (
      amount === "" ||
      amount === null ||
      amount === undefined ||
      value < 30000
    ) {
      return "D Ledger";
    }

    if (value >= 100000) {
      return "A Ledger";
    }

    if (value >= 50000) {
      return "B Ledger";
    }

    return "C Ledger";
  };

  // FORM CHANGE

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  // DELETE DONOR

  const handleDelete = async (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure?"
      );

    if (!confirmDelete) return;

    await deleteDonor(id);

    fetchDonors();
  };

  // EDIT DONOR

  const handleEdit = (donor) => {
    setFormData({
      name: donor.name,
      phone: donor.phone,
      address: donor.address,
      promisedAmount:
        donor.promisedAmount,
    });

    setEditId(donor._id);
  };

  // FILTER DONORS

  const filteredDonors =
    donors.filter((donor) => {
      return (
        donor.name
  .trim()
  .includes(
    filters.name.trim()
  ) &&
        donor.phone.includes(
          filters.phone
        ) &&
        donor.address
          .toLowerCase()
          .includes(
            filters.address.toLowerCase()
          ) &&
        (filters.ledger === "" ||
          donor.ledger ===
            filters.ledger)
      );
    });
  
  const totalPages = Math.ceil(
    filteredDonors.length /
      rowsPerPage
  );

  const paginatedDonors =
    filteredDonors.slice(
      (currentPage - 1) *
        rowsPerPage,
      currentPage * rowsPerPage
    );
  // SUBMIT FORM

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ledger = getLedger(
      formData.promisedAmount
    );

    if (editId) {
      const existingDonor =
        donors.find(
          (donor) =>
            donor._id === editId
        );

      const totalPaid =
        existingDonor?.totalPaid || 0;

      const promised =
        Number(
          formData.promisedAmount
        ) || 0;

      const pendingAmount =
        promised - totalPaid;

      await updateDonor(editId, {
        ...formData,
        ledger,
        totalPaid,
        pendingAmount:
          pendingAmount > 0
            ? pendingAmount
            : 0,
      });

      setEditId(null);
    } else {
      await createDonor({
        ...formData,
        ledger,
        totalPaid: 0,
        pendingAmount:
          formData.promisedAmount ||
          0,
      });
    }

    fetchDonors();

    setFormData({
      name: "",
      phone: "",
      address: "",
      promisedAmount: "",
    });
  };

  // LEDGER COLORS

  const getLedgerColor = (
    ledger
  ) => {
    switch (ledger) {
      case "A Ledger":
        return "bg-green-100 text-green-700";

      case "B Ledger":
        return "bg-blue-100 text-blue-700";

      case "C Ledger":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Donors
      </h1>

      {/* DONOR FORM */}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* DONOR NAME */}

          <ReactTransliterate
            lang="ta"
            value={formData.name}
            onChangeText={(text) =>{
              setFormData({
                ...formData,
                name: text,
              });
              setCurrentPage(1);
            }}
            placeholder="Donor Name"
            className="border p-3 rounded w-full"
          />

          {/* PHONE */}

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="border p-3 rounded"
          />

          {/* ADDRESS */}

          <ReactTransliterate
            lang="ta"
            value={formData.address}
            onChangeText={(text) =>{
              setFormData({
                ...formData,
                address: text,
              });
              setCurrentPage(1);
            }}
            placeholder="Address"
            className="border p-3 rounded w-full"
          />

          {/* PROMISED AMOUNT */}

          <input
            type="number"
            name="promisedAmount"
            placeholder="Promised Amount"
            value={
              formData.promisedAmount
            }
            onChange={handleChange}
            className="border p-3 rounded"
          />


          
        </div>

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 mt-5 rounded-lg">
          {editId
            ? "Update Donor"
            : "Add Donor"}
        </button>
      </form>

      {/* FILTERS */}

      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* SEARCH NAME */}

          <ReactTransliterate
            lang="ta"
            value={filters.name}
            onChangeText={(text) =>{
              setFilters({
                ...filters,
                name: text,
              });
              setCurrentPage(1);
            }}
            placeholder="Search Name"
            className="border p-3 rounded w-full"
          />

          {/* SEARCH PHONE */}

          <input
            type="text"
            placeholder="Search Phone"
            value={filters.phone}
            onChange={(e) =>{
              setFilters({
                ...filters,
                phone:
                  e.target.value,
              });
              setCurrentPage(1);
            }}
            className="border p-3 rounded"
          />

          {/* SEARCH ADDRESS */}

          <ReactTransliterate
            lang="ta"
            value={filters.address}
            onChangeText={(text) =>{
              setFilters({
                ...filters,
                address: text,
              });
              setCurrentPage(1);
            }}
            placeholder="Search Address"
            className="border p-3 rounded w-full"
          />

          {/* LEDGER FILTER */}

          <select
            value={filters.ledger}
            onChange={(e) =>{
              setFilters({
                ...filters,
                ledger:
                  e.target.value,
              });
              setCurrentPage(1);
            }}
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

      {/* DONOR TABLE */}

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4 text-left">
                Name
              </th>

              <th className="p-4 text-left">
                Phone
              </th>

              <th className="p-4 text-left">
                Address
              </th>

              <th className="p-4 text-left">
                Ledger
              </th>

              <th className="p-4 text-left">
                Promised
              </th>

              <th className="p-4 text-left">
                Paid
              </th>

              <th className="p-4 text-left">
                Pending
              </th>

              <th className="p-4 text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredDonors.length >
            0 ? (
              paginatedDonors.map(
                (donor) => (
                  <tr
                    key={donor._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-4 font-medium">
                      {donor.name}
                    </td>

                    <td className="p-4">
                      {donor.phone}
                    </td>

                    <td className="p-4">
                      {donor.address}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getLedgerColor(
                          donor.ledger
                        )}`}
                      >
                        {donor.ledger}
                      </span>
                    </td>

                    <td className="p-4">
                      Rs.{" "}
                      {
                        donor.promisedAmount
                      }
                    </td>

                    <td className="p-4">
                      Rs.{" "}
                      {donor.totalPaid}
                    </td>

                    <td className="p-4">
                      Rs.{" "}
                      {
                        donor.pendingAmount
                      }
                    </td>

                    <td className="p-4">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() =>
                            handleEdit(
                              donor
                            )
                          }
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(
                              donor._id
                            )
                          }
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="text-center py-8 text-gray-500"
                >
                  No donors found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex justify-center items-center gap-4 py-4">
          <button
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage(
                (prev) => prev - 1
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
              currentPage ===
                totalPages ||
              totalPages === 0
            }
            onClick={() =>
              setCurrentPage(
                (prev) => prev + 1
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

export default Donors;