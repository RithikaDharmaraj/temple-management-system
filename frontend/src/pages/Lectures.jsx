import { useEffect, useState }
from "react";

import axios from "axios";

function Lectures() {
  const [lectures, setLectures] =
    useState([]);

  const fetchSummary = async () => {
    const response =
      await axios.get(
        "http://localhost:5000/api/lectures/summary"
      );

    setLectures(response.data);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSummary();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-5">
        Lecture Summary
      </h1>

      <div className="bg-white p-5 rounded shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th>Lecture</th>
              <th>Total Donors</th>
              <th>Total Collection</th>
              <th>Total Pending</th>
            </tr>
          </thead>

          <tbody>
            {lectures.map((lecture) => (
              <tr
                key={lecture.lecture}
                className="text-center border-b"
              >
                <td>
                  {lecture.lecture}
                </td>

                <td>
                  {lecture.totalDonors}
                </td>

                <td>
                  Rs. {
                    lecture.totalCollection
                  }
                </td>

                <td>
                  Rs. {
                    lecture.totalPending
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Lectures;