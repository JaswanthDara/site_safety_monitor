import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosConfig";
import { useAuth } from "../../context/AuthContext";

const IncidentsList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchIncidents = async () => {
      try {
        const res = await axiosInstance.get("/api/safety/", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        console.log(res.data);
        setIncidents(res.data);
      } catch (err) {
        setError("Failed to fetch incidents.");
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, [user, navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this incident?"))
      return;

    try {
      await axiosInstance.delete(`/api/safety/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      // Remove the deleted item
      setIncidents((prev) => prev.filter((incident) => incident._id !== id));

      // Show success alert
      alert("Incident successfully deleted.");
    } catch (err) {
      console.error(err);
      alert("Failed to delete incident.");
    }
  };

  if (loading) {
    return <p className="p-6 text-center">Loading incidents...</p>;
  }

  if (error) {
    return <p className="p-6 text-center text-red-600">{error}</p>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Safety Incident List</h1>
        <Link
          to="/safety-incidents/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Create New Incident
        </Link>
      </div>

      {incidents.length === 0 ? (
        <p>No incidents found.</p>
      ) : (
        <div className="overflow-x-auto shadow rounded bg-white">
          <table className="min-w-full table-auto border border-gray-200">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 border">S.N</th>
                <th className="px-4 py-2 border">Title</th>
                <th className="px-4 py-2 border">Description</th>
                <th className="px-4 py-2 border">Date & Time</th>
                <th className="px-4 py-2 border">Severity</th>
                <th className="px-4 py-2 border">Resolved</th>
                <th className="px-4 py-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((incident, index) => (
                <tr key={incident._id} className="text-center hover:bg-gray-50">
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border font-semibold text-left">
                    {incident.title}
                  </td>
                  <td className="px-4 py-2 border text-left">
                    {incident.description}
                  </td>

                  <td className="px-4 py-2 border">
                    {new Date(incident.date || incident.date).toLocaleString(
                      "en-AU",
                      {
                        dateStyle: "medium",
                        timeStyle: "short",
                        hour12: true,
                      }
                    )}
                  </td>

                  <td className="px-4 py-2 border">
                    {incident.severity_level || "-"}
                  </td>

                  <td className="px-4 py-2 border">
                    {incident.resolved ? (
                      <span className="text-green-600 font-semibold">Yes</span>
                    ) : (
                      <span className="text-red-600 font-semibold">No</span>
                    )}
                  </td>

                  <td className="px-4 py-2 border">
                    <div className="flex flex-col items-center space-y-2">
                      <Link
                        to={`/safety-incidents/view/${incident._id}`}
                        className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white px-3 py-1 text-sm rounded w-full text-center"
                      >
                        View
                      </Link>
                      <div className="flex space-x-2">
                        <Link
                          to={`/safety-incidents/edit/${incident._id}`}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 text-sm rounded"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(incident._id)}
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

export default IncidentsList;
