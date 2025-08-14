import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosConfig';
import { useAuth } from '../../context/AuthContext';

const GearLogCreate = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    worker: '',
    site: '',
    gearType: '',
    gearCondition: '',
    dateChecked: '',
    status: '',
    remarks: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [workers, setWorkers] = useState([]);
  const [sites, setSites] = useState([]);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [workersRes, sitesRes] = await Promise.all([
          axiosInstance.get('/api/workers', {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
          axiosInstance.get('/api/sites', {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
        ]);
        setWorkers(workersRes.data);
        setSites(sitesRes.data);
      } catch (err) {
        alert('Failed to load workers or sites.');
      }
    };

    fetchDropdownData();
  }, [user.token]);

  const validate = () => {
    const newErrors = {};
    if (!formData.worker) newErrors.worker = 'Worker is required';
    if (!formData.site) newErrors.site = 'Site is required';
    if (!formData.gearType.trim()) newErrors.gearType = 'Gear type is required';
    if (!formData.gearCondition.trim()) newErrors.gearCondition = 'Gear condition is required';
    if (!formData.dateChecked) newErrors.dateChecked = 'Date checked is required';
    if (!formData.status.trim()) newErrors.status = 'Status is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
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
      await axiosInstance.post('/api/safety/gear-logs', formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      navigate('/gear-logs');
    } catch (err) {
      alert('Failed to create gear log.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6 text-green-700 border-b pb-2">
        Log New Gear Check
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-medium text-gray-700">Worker</label>
          <select
            name="worker"
            value={formData.worker}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${
              errors.worker ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">-- Select Worker --</option>
            {workers.map((w) => (
              <option key={w._id} value={w._id}>{w.workerName}</option>
            ))}
          </select>
          {errors.worker && (
            <p className="text-red-500 text-sm">{errors.worker}</p>
          )}
        </div>
        <div>
          <label className="block font-medium text-gray-700">Site</label>
          <select
            name="site"
            value={formData.site}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${
              errors.site ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">-- Select Site --</option>
            {sites.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
          {errors.site && <p className="text-red-500 text-sm">{errors.site}</p>}
        </div>
        <div>
          <label className="block font-medium text-gray-700">Gear Type</label>
          <input
            type="text"
            name="gearType"
            value={formData.gearType}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${
              errors.gearType ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.gearType && (
            <p className="text-red-500 text-sm">{errors.gearType}</p>
          )}
        </div>
        <div>
          <label className="block font-medium text-gray-700">Gear Condition</label>
          <input
            type="text"
            name="gearCondition"
            value={formData.gearCondition}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${
              errors.gearCondition ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.gearCondition && (
            <p className="text-red-500 text-sm">{errors.gearCondition}</p>
          )}
        </div>
        <div>
          <label className="block font-medium text-gray-700">Date Checked</label>
          <input
            type="datetime-local"
            name="dateChecked"
            value={formData.dateChecked}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${
              errors.dateChecked ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.dateChecked && (
            <p className="text-red-500 text-sm">{errors.dateChecked}</p>
          )}
        </div>
        <div>
          <label className="block font-medium text-gray-700">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${
              errors.status ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">-- Select Status --</option>
            <option value="Good">Good</option>
            <option value="Damaged">Damaged</option>
            <option value="Replaced">Replaced</option>
          </select>
          {errors.status && (
            <p className="text-red-500 text-sm">{errors.status}</p>
          )}
        </div>
        <div>
          <label className="block font-medium text-gray-700">Remarks (Optional)</label>
          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Any additional remarks"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Log'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GearLogCreate;
