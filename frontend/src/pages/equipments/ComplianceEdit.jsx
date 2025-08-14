import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosConfig";
import { useAuth } from "../../context/AuthContext";

const ComplianceEdit = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    equipmentName: "",
    checkedAt: "",
    status: "",
    remarks: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch compliance record by Id
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axiosInstance.get(`/api/equipment/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        const cast = res.data;

        setForm({
          equipmentName: cast.equipmentName || "",
          checkedAt: cast.checkedAt?.slice(0, 10) || "",
          status: cast.status || "",
          remarks: cast.remarks || "",
        });
      } catch (err) {
        console.error("Fetch error:", err);
        alert("Failed to load data.");
        navigate("/equipment-compliance");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [id, user.token, navigate]);

  // Validate inputs
  const validate = () => {
    const e = {};
    if (!form.equipmentName.trim())
      e.equipmentName = "Equipment name is required";
    if (!form.checkedAt) e.checkedAt = "Inspection date is required";
    if (!form.status.trim()) e.status = "Status is required";
    return e;
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    const eErr = validate();
    if (Object.keys(eErr).length > 0) {
      setErrors(eErr);
      return;
    }

    try {
      await axiosInstance.put(`/api/equipment/${id}`, form, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      alert("Compliance record updated successfully.");
      navigate("/equipment-compliance");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed.");
    }
  };

  if (loading) return <p className="p-6 text-center">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-yellow-600 border-b pb-2">
        Edit Equipment Compliance
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-medium text-gray-700">
            Equipment Name
          </label>
          <input
            type="text"
            name="equipmentName"
            value={form.equipmentName}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${
              errors.equipmentName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.equipmentName && (
            <p className="text-red-500 text-sm">{errors.equipmentName}</p>
          )}
        </div>
        <div>
          <label className="block font-medium text-gray-700">Checked At</label>
          <input
            type="date"
            name="checkedAt"
            value={form.checkedAt}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${
              errors.checkedAt ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.checkedAt && (
            <p className="text-red-500 text-sm">{errors.checkedAt}</p>
          )}
        </div>
        <div>
          <label className="block font-medium text-gray-700">
            Compliance Status
          </label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${
              errors.status ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">-- Select Status --</option>
            <option value="Compliant">Compliant</option>
            <option value="Non-compliant">Non-compliant</option>
            <option value="Pending">Pending</option>
          </select>
          {errors.status && (
            <p className="text-red-500 text-sm">{errors.status}</p>
          )}
        </div>
        <div>
          <label className="block font-medium text-gray-700">Remarks</label>
          <textarea
            name="remarks"
            value={form.remarks}
            onChange={handleChange}
            rows={4}
            className="w-full p-2 border rounded border-gray-300"
            placeholder="Optional remarks..."
          />
        </div>
        <div className="text-right">
          <button
            type="submit"
            className="bg-yellow-600 text-white px-6 py-2 rounded hover:bg-yellow-700"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default ComplianceEdit;
