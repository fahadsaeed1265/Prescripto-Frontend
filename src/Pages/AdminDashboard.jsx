import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [revenue, setRevenue] = useState(null);
  const [activeTab, setActiveTab] = useState("stats");
  const navigate = useNavigate();

  const token = localStorage.getItem("adminToken");
  const adminName = localStorage.getItem("adminName");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    if (!token) {
      navigate("/admin-login");
      return;
    }
    fetchStats();
    fetchPatients();
    fetchDoctors();
    fetchAppointments();
    fetchRevenue();
  }, []);

  const fetchStats = async () => {
    const res = await fetch("https://localhost:7244/api/admin/stats", { headers });
    const data = await res.json();
    setStats(data);
  };

  const fetchPatients = async () => {
    const res = await fetch("https://localhost:7244/api/admin/patients", { headers });
    const data = await res.json();
    setPatients(data);
  };

  const fetchDoctors = async () => {
    const res = await fetch("https://localhost:7244/api/admin/doctors", { headers });
    const data = await res.json();
    setDoctors(data);
  };

  const fetchAppointments = async () => {
    const res = await fetch("https://localhost:7244/api/admin/appointments", { headers });
    const data = await res.json();
    setAppointments(data);
  };

  const fetchRevenue = async () => {
    const res = await fetch("https://localhost:7244/api/admin/revenue", { headers });
    const data = await res.json();
    setRevenue(data);
  };

  const handleApproveDoctor = async (userId) => {
    await fetch(`https://localhost:7244/api/admin/approve-doctor/${userId}`, {
      method: "PUT",
      headers,
    });
    fetchDoctors();
  };

  const handleRejectDoctor = async (userId) => {
    await fetch(`https://localhost:7244/api/admin/reject-doctor/${userId}`, {
      method: "PUT",
      headers,
    });
    fetchDoctors();
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminName");
    navigate("/admin-login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600 text-sm">Welcome, {adminName}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-5 text-center">
              <p className="text-3xl font-bold text-blue-600">{stats.totalPatients}</p>
              <p className="text-gray-500 mt-1">Total Patients</p>
            </div>
            <div className="bg-white rounded-lg shadow p-5 text-center">
              <p className="text-3xl font-bold text-green-600">{stats.totalDoctors}</p>
              <p className="text-gray-500 mt-1">Total Doctors</p>
            </div>
            <div className="bg-white rounded-lg shadow p-5 text-center">
              <p className="text-3xl font-bold text-purple-600">{stats.totalAppointments}</p>
              <p className="text-gray-500 mt-1">Total Appointments</p>
            </div>
            <div className="bg-white rounded-lg shadow p-5 text-center">
              <p className="text-3xl font-bold text-yellow-600">
                Rs. {revenue ? revenue.totalRevenue.toLocaleString() : 0}
              </p>
              <p className="text-gray-500 mt-1">Total Revenue</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {["patients", "doctors", "appointments", "revenue"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded capitalize font-medium text-sm ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Patients Table */}
        {activeTab === "patients" && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 text-left">ID</th>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Email</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr key={p.userId} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-3">{p.userId}</td>
                    <td className="px-6 py-3">{p.name}</td>
                    <td className="px-6 py-3">{p.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Doctors Table */}
        {activeTab === "doctors" && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Speciality</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((d, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-3">{d.name}</td>
                    <td className="px-6 py-3">{d.email}</td>
                    <td className="px-6 py-3">{d.speciality}</td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        d.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : d.status === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 flex gap-2">
                      {d.status !== "Approved" && (
                        <button
                          onClick={() => handleApproveDoctor(d.userId)}
                          className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
                        >
                          Approve
                        </button>
                      )}
                      {d.status !== "Rejected" && (
                        <button
                          onClick={() => handleRejectDoctor(d.userId)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                        >
                          Reject
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Appointments Table */}
        {activeTab === "appointments" && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 text-left">ID</th>
                  <th className="px-6 py-3 text-left">Patient ID</th>
                  <th className="px-6 py-3 text-left">Doctor ID</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Time</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Amount</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-3">{a.id}</td>
                    <td className="px-6 py-3">{a.userId}</td>
                    <td className="px-6 py-3">{a.docId}</td>
                    <td className="px-6 py-3">{a.slotDate}</td>
                    <td className="px-6 py-3">{a.slotTime}</td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        a.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : a.status === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-6 py-3">Rs. {a.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Revenue Tab */}
        {activeTab === "revenue" && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-700">
                Revenue Per Doctor
              </h2>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 text-left">Doctor ID</th>
                  <th className="px-6 py-3 text-left">Total Earned</th>
                </tr>
              </thead>
              <tbody>
                {revenue && revenue.revenuePerDoctor.map((r, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-3">{r.docId}</td>
                    <td className="px-6 py-3 font-medium text-yellow-600">
                      Rs. {r.totalEarned.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;