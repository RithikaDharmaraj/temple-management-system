import { useEffect, useState } from "react";

import { getDashboardData }
from "../services/dashboardService";

function Dashboard() {
  const [data, setData] =
    useState({
      totalCollection: 0,

      totalPromised: 0,

      totalPending: 0,

      totalDonors: 0,

      promisedCollection: 0,

      unpromisedCollection: 0,

      promisedDonorCount: 0,

      unpromisedDonorCount: 0,

      donorsWhoPaid: 0,

      unpaidDonors: 0,

      ledgerSummary: [],
    });

  const fetchDashboard =
    async () => {
      const result =
        await getDashboardData();

      setData(result);
    };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDashboard();
  }, []);

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
      <h1 className="text-3xl font-bold mb-8">
        Dashboard
      </h1>

      {/* MAIN SUMMARY */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500 text-sm">
            Total Collection
          </h2>

          <p className="text-3xl font-bold mt-3 text-green-600">
            Rs.{" "}
            {
              data.totalCollection
            }
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500 text-sm">
            Total Promised
          </h2>

          <p className="text-3xl font-bold mt-3 text-blue-600">
            Rs.{" "}
            {
              data.totalPromised
            }
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500 text-sm">
            Total Pending
          </h2>

          <p className="text-3xl font-bold mt-3 text-red-500">
            Rs.{" "}
            {
              data.totalPending
            }
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500 text-sm">
            Total Donors
          </h2>

          <p className="text-3xl font-bold mt-3">
            {
              data.totalDonors
            }
          </p>
        </div>
      </div>

      {/* COLLECTION BREAKDOWN */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500 text-sm">
            Promised Collection
          </h2>

          <p className="text-3xl font-bold mt-3 text-blue-600">
            Rs.{" "}
            {
              data.promisedCollection
            }
          </p>

          <p className="mt-2 text-gray-500">
            Donors:{" "}
            {
              data.promisedDonorCount
            }
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500 text-sm">
            Unpromised Collection
          </h2>

          <p className="text-3xl font-bold mt-3 text-purple-600">
            Rs.{" "}
            {
              data.unpromisedCollection
            }
          </p>

          <p className="mt-2 text-gray-500">
            Donors:{" "}
            {
              data.unpromisedDonorCount
            }
          </p>
        </div>
      </div>

      {/* DONOR STATUS */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500 text-sm">
            Donors Who Paid
          </h2>

          <p className="text-3xl font-bold mt-3 text-green-600">
            {
              data.donorsWhoPaid
            }
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500 text-sm">
            Unpaid Donors
          </h2>

          <p className="text-3xl font-bold mt-3 text-red-500">
            {
              data.unpaidDonors
            }
          </p>
        </div>
      </div>

      {/* LEDGER SUMMARY */}

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <div className="p-5 border-b">
          <h2 className="text-2xl font-bold">
            Ledger Summary
          </h2>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4 text-left">
                Ledger
              </th>

              <th className="p-4 text-left">
                Total Donors
              </th>

              <th className="p-4 text-left">
                Collection
              </th>
            </tr>
          </thead>

          <tbody>
            {data.ledgerSummary.map(
              (ledger) => (
                <tr
                  key={
                    ledger.ledger
                  }
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getLedgerColor(
                        ledger.ledger
                      )}`}
                    >
                      {
                        ledger.ledger
                      }
                    </span>
                  </td>

                  <td className="p-4 font-medium">
                    {
                      ledger.totalDonors
                    }
                  </td>

                  <td className="p-4 text-green-600 font-medium">
                    Rs.{" "}
                    {
                      ledger.totalCollection
                    }
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

export default Dashboard;