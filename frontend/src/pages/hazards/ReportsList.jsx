import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosConfig";
import { useAuth } from "../../context/AuthContext";

const ReportsList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchReports = async () => {
      try {
        const res = await axiosInstance.get("/api/hazard/reports", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setReports(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch reports.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [user, navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;

    try {
      await axiosInstance.delete(`/api/hazard/reports/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setReports((prev) => prev.filter((r) => r._id !== id));
      alert("Report successfully deleted.");
    } catch (err) {
      console.error(err);
      alert("Failed to delete report.");
    }
  };

  if (loading) return <p className="p-6 text-center">Loading reports...</p>;
  if (error) return <p className="p-6 text-center text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Hazard Reports</h1>
        <Link
          to="/hazard-reports/new"
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          + Create New Report
        </Link>
      </div>

      {reports.length === 0 ? (
        <p>No reports found.</p>
      ) : (
        <div className="overflow-x-auto shadow rounded bg-white">
          <table className="min-w-full table-auto border border-gray-200">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 border">S.N</th>
                <th className="px-4 py-2 border">Title</th>
                <th className="px-4 py-2 border">Description</th>
                <th className="px-4 py-2 border">Location</th>
                <th className="px-4 py-2 border">Reported At</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, index) => (
                <tr key={report._id} className="text-center hover:bg-gray-50">
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border text-left font-medium">
                    {report.title}
                  </td>
                  <td className="px-4 py-2 border text-left">
                    {report.description}
                  </td>
                  <td className="px-4 py-2 border text-left">
                    {report.location}
                  </td>
                  <td className="px-4 py-2 border">
                    {new Date(report.date).toLocaleString("en-AU", {
                      dateStyle: "medium",
                      timeStyle: "short",
                      hour12: true,
                    })}
                  </td>
                  <td className="px-4 py-2 border">
                    <div className="flex flex-col items-center space-y-2">
                      <Link
                        to={`/hazard-reports/view/${report._id}`}
                        className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white px-3 py-1 text-sm rounded w-full text-center"
                      >
                        View
                      </Link>
                      <div className="flex space-x-2">
                        <Link
                          to={`/hazard-reports/edit/${report._id}`}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 text-sm rounded"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(report._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReportsList;
