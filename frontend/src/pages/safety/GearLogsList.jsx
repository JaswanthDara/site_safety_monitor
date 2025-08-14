import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosConfig";
import { useAuth } from "../../context/AuthContext";

const GearLogsList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [gearLogs, setGearLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchGearLogs = async () => {
      try {
        const res = await axiosInstance.get("/api/safety/gear-logs", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setGearLogs(res.data);
      } catch (err) {
        setError("Failed to fetch gear logs.");
      } finally {
        setLoading(false);
      }
    };

    fetchGearLogs();
  }, [user, navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this gear log?"))
      return;

    try {
      await axiosInstance.delete(`/api/safety/gear-logs/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setGearLogs((prev) => prev.filter((log) => log._id !== id));
      alert("Gear log successfully deleted.");
    } catch (err) {
      alert("Failed to delete gear log.");
    }
  };

  if (loading) return <p className="p-6 text-center">Loading gear logs...</p>;
  if (error) return <p className="p-6 text-center text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Worker Gear Logs</h1>
        <Link
          to="/gear-logs/new"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          + Log New Gear Check
        </Link>
      </div>

      {gearLogs.length === 0 ? (
        <p>No gear logs found.</p>
      ) : (
        <div className="overflow-x-auto shadow rounded bg-white">
          <table className="min-w-full table-auto border border-gray-200">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 border">S.N</th>
                <th className="px-4 py-2 border">Worker Name</th>
                <th className="px-4 py-2 border">Site Name</th>
                <th className="px-4 py-2 border">Date Checked</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Remarks</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {gearLogs.map((log, index) => (
                <tr key={log._id} className="text-center hover:bg-gray-50">
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border font-semibold text-left">
                    {log.worker?.workerName || "Unknown Worker"}
                  </td>
                  <td className="px-4 py-2 border text-left">
                    {log.site?.name || "Unknown Site"}
                  </td>
                  <td className="px-4 py-2 border">
                    {new Date(log.dateChecked).toLocaleString("en-AU", {
                      dateStyle: "medium",
                      timeStyle: "short",
                      hour12: true,
                    })}
                  </td>
                  <td className="px-4 py-2 border">{log.status}</td>
                  <td className="px-4 py-2 border">{log.remarks || "-"}</td>
                  <td className="px-4 py-2 border">
                    <div className="flex flex-col items-center space-y-2">
                      <Link
                        to={`/gear-logs/view/${log._id}`}
                        className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white px-3 py-1 text-sm rounded w-full text-center"
                      >
                        View
                      </Link>
                      <div className="flex space-x-2">
                        <Link
                          to={`/gear-logs/edit/${log._id}`}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 text-sm rounded"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(log._id)}
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

export default GearLogsList;
