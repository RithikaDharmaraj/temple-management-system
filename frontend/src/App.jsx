import { Link, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Donors from "./pages/Donors";
import Payments from "./pages/Payments";
import Expenses from "./pages/Expenses";

function App() {
  return (
    <div className="flex min-h-screen">
      <div className="w-64 bg-gray-900 text-white p-5">
        <h1 className="text-2xl font-bold mb-10">
          Temple Accounts
        </h1>

        <div className="flex flex-col gap-4">
          <Link to="/">Dashboard</Link>
          <Link to="/donors">Donors</Link>
          <Link to="/payments">Payments</Link>
          <Link to="/expenses">Expenses</Link>
        </div>
      </div>

      <div className="flex-1 p-10 bg-gray-100">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/donors" element={<Donors />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/expenses" element={<Expenses />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;