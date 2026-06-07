import {
  Link,
  Routes,
  Route,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";

import Donors from "./pages/Donors";

import Payments from "./pages/Payments";

function App() {
  return (
    <div className="md:flex min-h-screen bg-gray-100">
      <div className="w-full md:w-64 bg-gray-900 text-white p-5">

        <div className="flex md:flex-col gap-3 overflow-x-auto">
          <Link
            to="/"
            className="hover:bg-gray-700 p-3 rounded transition"
          >
            Dashboard
          </Link>

          <Link
            to="/donors"
            className="hover:bg-gray-700 p-3 rounded transition"
          >
            Donors
          </Link>

          <Link
            to="/payments"
            className="hover:bg-gray-700 p-3 rounded transition"
          >
            Payments
          </Link>
        </div>
      </div>

      <div className="flex-1 p-5 md:p-10">
        

        <Routes>
          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/donors"
            element={<Donors />}
          />

          <Route
            path="/payments"
            element={<Payments />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;