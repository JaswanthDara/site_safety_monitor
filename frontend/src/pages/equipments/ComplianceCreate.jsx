import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosConfig";
import { useAuth } from "../../context/AuthContext";

const ComplianceCreate = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    equipmentName: "",
    checkedAt: "",
    status: "",
    remarks: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.equipmentName.trim())
      e.equipmentName = "Equipment name is required";
    if (!form.checkedAt) e.checkedAt = "Inspection date is required";
    if (!form.status.trim()) e.status = "Status is required";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((f) => ({ ...f, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const eErr = validate();
    if (Object.keys(eErr).length > 0) {
      setErrors(eErr);
      return;
    }

    // Add checkedBy from logged-in user
    const payload = {
      ...form,
      checkedBy: user.id || user._id || "",
    };

    try {
      setLoading(true);
      await axiosInstance.post("/api/equipment", payload, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      navigate("/equipment-compliance");
    } catch {
      alert("Failed to create record.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-green-700 border-b pb-2">
        New Equipment Compliance
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
          <label className="block font-medium text-gray-700">
            Inspection Date
          </label>
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
          <label className="block font-medium text-gray-700">Status</label>
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
          <label className="block font-medium text-gray-700">
            Remarks (Optional)
          </label>
          <textarea
            name="remarks"
            value={form.remarks}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border rounded border-gray-300"
          />
        </div>

        <div className="text-right">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ComplianceCreate;
