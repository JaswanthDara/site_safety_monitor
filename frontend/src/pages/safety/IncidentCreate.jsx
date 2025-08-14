import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosConfig";
import { useAuth } from "../../context/AuthContext";

const IncidentCreate = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    site_id: "",
    incident_type: "",
    title: "",
    description: "",
    severity_level: "",
    date: "",
    resolved: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sites, setSites] = useState([]);

  const incidentTypes = [
    "Fall",
    "Electrical",
    "Equipment Failure",
    "Fire",
    "Chemical",
    "Other",
  ];

  const severityLevels = ["Low", "Medium", "High"];

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const res = await axiosInstance.get("/api/sites", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setSites(res.data);
      } catch (error) {
        console.error("Failed to load sites", error);
      }
    };

    fetchSites();
  }, [user.token]);

  const validate = () => {
    const newErrors = {};
    if (!formData.site_id) newErrors.site_id = "Site is required";
    if (!formData.incident_type)
      newErrors.incident_type = "Incident type is required";
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.severity_level)
      newErrors.severity_level = "Severity level is required";
    if (!formData.date) newErrors.date = "Date and time is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post("/api/safety", formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      alert("Incident reported successfully!");
      navigate("/safety-incidents");
    } catch (err) {
      console.error(err);
      alert("Failed to create incident. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setErrors({ ...errors, [name]: "" });
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-blue-700 border-b pb-2">
        Report New Safety Incident
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium text-gray-700">Site</label>
          <select
            name="site_id"
            value={formData.site_id}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${
              errors.site_id ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">-- Select Site --</option>
            {sites.map((site) => (
              <option
                key={site.site_id || site._id}
                value={site.site_id || site._id}
              >
                {site.name}
              </option>
            ))}
          </select>
          {errors.site_id && (
            <p className="text-red-500 text-sm">{errors.site_id}</p>
          )}
        </div>
        <div>
          <label className="block font-medium text-gray-700">
            Incident Type
          </label>
          <select
            name="incident_type"
            value={formData.incident_type}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${
              errors.incident_type ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">-- Select Type --</option>
            {incidentTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.incident_type && (
            <p className="text-red-500 text-sm">{errors.incident_type}</p>
          )}
        </div>
        <div>
          <label className="block font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            className={`w-full p-2 border rounded ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
            value={formData.title}
            onChange={handleChange}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title}</p>
          )}
        </div>
        <div>
          <label className="block font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            className={`w-full p-2 border rounded h-32 resize-none ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
            value={formData.description}
            onChange={handleChange}
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description}</p>
          )}
        </div>
        <div>
          <label className="block font-medium text-gray-700">
            Severity Level
          </label>
          <select
            name="severity_level"
            value={formData.severity_level}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${
              errors.severity_level ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">-- Select Severity --</option>
            {severityLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          {errors.severity_level && (
            <p className="text-red-500 text-sm">{errors.severity_level}</p>
          )}
        </div>
        <div>
          <label className="block font-medium text-gray-700">Date & Time</label>
          <input
            type="datetime-local"
            name="date"
            className={`w-full p-2 border rounded ${
              errors.date ? "border-red-500" : "border-gray-300"
            }`}
            value={formData.date}
            onChange={handleChange}
          />
          {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="resolved"
            id="resolved"
            checked={formData.resolved}
            onChange={handleChange}
            className="h-4 w-4"
          />
          <label htmlFor="resolved" className="font-medium text-gray-700">
            Resolved
          </label>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Create Incident"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default IncidentCreate;
