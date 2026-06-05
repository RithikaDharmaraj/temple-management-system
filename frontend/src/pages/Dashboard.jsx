import { useEffect, useState } from "react";

import { getDashboardData }
from "../services/dashboardService";

function Dashboard() {
  const [data, setData] = useState({
    totalCollection: 0,
    totalPromised: 0,
    totalPending: 0,
    totalDonors: 0,
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    const result =
      await getDashboardData();

    setData(result);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-10">
        Dashboard
      </h1>

      <div className="grid grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded shadow">
          <h2 className="text-gray-500">
            Total Collection
          </h2>

          <p className="text-2xl font-bold mt-3">
            Rs. {data.totalCollection}
          </p>
        </div>

        <div className="bg-white p-5 rounded shadow">
          <h2 className="text-gray-500">
            Total Promised
          </h2>

          <p className="text-2xl font-bold mt-3">
            Rs. {data.totalPromised}
          </p>
        </div>

        <div className="bg-white p-5 rounded shadow">
          <h2 className="text-gray-500">
            Total Pending
          </h2>

          <p className="text-2xl font-bold mt-3">
            Rs. {data.totalPending}
          </p>
        </div>

        <div className="bg-white p-5 rounded shadow">
          <h2 className="text-gray-500">
            Total Donors
          </h2>

          <p className="text-2xl font-bold mt-3">
            {data.totalDonors}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;