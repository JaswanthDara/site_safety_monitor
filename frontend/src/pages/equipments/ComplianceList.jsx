import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosConfig";
import { useAuth } from "../../context/AuthContext";

const ComplianceList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchRecords = async () => {
      try {
        const res = await axiosInstance.get("/api/equipment", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setRecords(res.data);
      } catch {
        setError("Failed to fetch records.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [user, navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await axiosInstance.delete(`/api/equipment/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setRecords((prev) => prev.filter((r) => r._id !== id));
      alert("Record Deleted Successfully.");
    } catch {
      alert("Delete failed.");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Equipment Compliance List</h1>
        <Link
          to="/equipment-compliance/new"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          + New Compliance
        </Link>
      </div>

      {loading ? (
        <p className="p-6 text-center">Loading...</p>
      ) : error ? (
        <p className="p-6 text-center text-red-600">{error}</p>
      ) : records.length === 0 ? (
        <p className="p-6 text-center text-gray-700">No records found.</p>
      ) : (
        <div className="overflow-x-auto shadow rounded bg-white">
          <table className="min-w-full table-auto border border-gray-200">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                {[
                  "S.N",
                  "Equipment Name",
                  "Checked By",
                  "Checked At",
                  "Status",
                  "Remarks",
                  "Actions",
                ].map((header) => (
                  <th key={header} className="px-4 py-2 border">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr key={r._id} className="text-center hover:bg-gray-50">
                  <td className="px-4 py-2 border">{i + 1}</td>
                  <td className="px-4 py-2 border text-left">
                    {r.equipmentName || r.equipmentId}
                  </td>
                  <td className="px-4 py-2 border">
                    {r.checkedBy?.name || r.checkedBy || "Unknown"}
                  </td>
                  <td className="px-4 py-2 border">
                    {new Date(r.checkedAt).toLocaleDateString("en-AU", {
                      dateStyle: "medium",
                    })}
                  </td>
                  <td className="px-4 py-2 border">{r.status}</td>
                  <td className="px-4 py-2 border text-left">
                    {r.remarks || "-"}
                  </td>
                  <td className="px-4 py-2 border">
                    <div className="flex flex-col items-center space-y-2">
                      <Link
                        to={`/equipment-compliance/view/${r._id}`}
                        className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white px-3 py-1 text-sm rounded w-full text-center"
                      >
                        View
                      </Link>
                      <div className="flex space-x-2">
                        <Link
                          to={`/equipment-compliance/edit/${r._id}`}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 text-sm rounded"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(r._id)}
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

export default ComplianceList;
