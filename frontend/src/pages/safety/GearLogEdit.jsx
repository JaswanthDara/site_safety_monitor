import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosConfig";
import { useAuth } from "../../context/AuthContext";

const GearLogEdit = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    worker_id: "",
    site_id: "",
    gear_type: "",
    gear_condition: "",
    date_checked: "",
    status: "",
    remarks: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [workers, setWorkers] = useState([]);
  const [sites, setSites] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [logRes, workersRes, sitesRes] = await Promise.all([
          axiosInstance.get(`/api/safety/gear-logs/${id}`, {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
          axiosInstance.get("/api/workers", {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
          axiosInstance.get("/api/sites", {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
        ]);

        const logData = logRes.data;

        setFormData({
          worker_id: logData.worker,
          site_id: logData.site,
          gear_type: logData.gearType,
          gear_condition: logData.gearCondition,
          date_checked: logData.dateChecked
            ? logData.dateChecked.slice(0, 16)
            : "",
          status: logData.status,
          remarks: logData.remarks || "",
        });

        setWorkers(workersRes.data);
        setSites(sitesRes.data);
        setLoading(false);
      } catch (err) {
        alert("Failed to load gear log or dropdown data.");
        navigate("/gear-logs");
      }
    };

    fetchData();
  }, [id, user.token, navigate]);

  const validate = () => {
    const newErrors = {};
    if (!formData.worker_id) newErrors.worker_id = "Worker is required";
    if (!formData.site_id) newErrors.site_id = "Site is required";
    if (!formData.gear_type.trim())
      newErrors.gear_type = "Gear type is required";
    if (!formData.gear_condition.trim())
      newErrors.gear_condition = "Gear condition is required";
    if (!formData.date_checked)
      newErrors.date_checked = "Date checked is required";
    if (!formData.status.trim()) newErrors.status = "Status is required";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await axiosInstance.put(
        `/api/safety/gear-logs/${id}`,
        {
          worker: formData.worker_id,
          site: formData.site_id,
          gearType: formData.gear_type,
          gearCondition: formData.gear_condition,
          dateChecked: formData.date_checked,
          status: formData.status,
          remarks: formData.remarks,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      navigate("/gear-logs");
    } catch (err) {
      alert("Failed to update gear log.");
    }
  };

  if (loading)
    return (
      <p className="p-6 text-center text-gray-600 text-lg font-medium">
        Loading...
      </p>
    );

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-white shadow rounded-lg border border-gray-200">
      <h2 className="text-3xl font-bold mb-8 text-yellow-600 border-b pb-3">
        Edit Gear Log
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="worker_id"
            className="block font-medium text-gray-700 mb-1"
          >
            Worker
          </label>
          <select
            id="worker_id"
            name="worker_id"
            value={formData.worker_id}
            onChange={handleChange}
            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
              errors.worker_id ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">-- Select Worker --</option>
            {workers.map((w) => (
              <option key={w._id} value={w._id}>
                {w.workerName}
              </option>
            ))}
          </select>
          {errors.worker_id && (
            <p className="text-red-500 text-sm mt-1">{errors.worker_id}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="site_id"
            className="block font-medium text-gray-700 mb-1"
          >
            Site
          </label>
          <select
            id="site_id"
            name="site_id"
            value={formData.site_id}
            onChange={handleChange}
            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
              errors.site_id ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">-- Select Site --</option>
            {sites.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
          {errors.site_id && (
            <p className="text-red-500 text-sm mt-1">{errors.site_id}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="gear_type"
            className="block font-medium text-gray-700 mb-1"
          >
            Gear Type
          </label>
          <input
            id="gear_type"
            type="text"
            name="gear_type"
            value={formData.gear_type}
            onChange={handleChange}
            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
              errors.gear_type ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.gear_type && (
            <p className="text-red-500 text-sm mt-1">{errors.gear_type}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="gear_condition"
            className="block font-medium text-gray-700 mb-1"
          >
            Gear Condition
          </label>
          <input
            id="gear_condition"
            type="text"
            name="gear_condition"
            value={formData.gear_condition}
            onChange={handleChange}
            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
              errors.gear_condition ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.gear_condition && (
            <p className="text-red-500 text-sm mt-1">{errors.gear_condition}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="date_checked"
            className="block font-medium text-gray-700 mb-1"
          >
            Date Checked
          </label>
          <input
            id="date_checked"
            type="datetime-local"
            name="date_checked"
            value={formData.date_checked}
            onChange={handleChange}
            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
              errors.date_checked ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.date_checked && (
            <p className="text-red-500 text-sm mt-1">{errors.date_checked}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="status"
            className="block font-medium text-gray-700 mb-1"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
              errors.status ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">-- Select Status --</option>
            <option value="Good">Good</option>
            <option value="Damaged">Damaged</option>
            <option value="Replaced">Replaced</option>
          </select>
          {errors.status && (
            <p className="text-red-500 text-sm mt-1">{errors.status}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="remarks"
            className="block font-medium text-gray-700 mb-1"
          >
            Remarks
          </label>
          <textarea
            id="remarks"
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            rows="3"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
          ></textarea>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3 rounded-md font-semibold transition"
          >
            Update Log
          </button>
        </div>
      </form>
    </div>
  );
};

export default GearLogEdit;
