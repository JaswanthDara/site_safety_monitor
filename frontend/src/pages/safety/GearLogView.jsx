import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../axiosConfig';
import { useAuth } from '../../context/AuthContext';

const GearLogView = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [gearLog, setGearLog] = useState(null);
  const [workerName, setWorkerName] = useState('Loading...');
  const [siteName, setSiteName] = useState('Loading...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGearLog = async () => {
      try {
        // Fetch gear log data
        const res = await axiosInstance.get(`/api/safety/gear-logs/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setGearLog(res.data);

        if (res.data.worker) {
          try {
            const workerRes = await axiosInstance.get(`/api/workers/${res.data.worker}`, {
              headers: { Authorization: `Bearer ${user.token}` },
            });
            setWorkerName(workerRes.data.workerName || 'Unknown Worker');
          } catch {
            setWorkerName('Unknown Worker');
          }
        } else {
          setWorkerName('Unknown Worker');
        }

        if (res.data.site) {
          try {
            const siteRes = await axiosInstance.get(`/api/sites/${res.data.site}`, {
              headers: { Authorization: `Bearer ${user.token}` },
            });
            setSiteName(siteRes.data.name || 'Unknown Site');
          } catch {
            setSiteName('Unknown Site');
          }
        } else {
          setSiteName('Unknown Site');
        }
      } catch (err) {
        alert('Failed to load gear log details.');
        navigate('/gear-logs');
      } finally {
        setLoading(false);
      }
    };

    fetchGearLog();
  }, [id, user.token, navigate]);

  if (loading) {
    return <div className="text-center mt-10 text-lg font-medium">Loading gear log...</div>;
  }

  if (!gearLog) {
    return <div className="text-center mt-10 text-red-600 text-lg font-semibold">Gear log not found.</div>;
  }

  const formattedDateChecked = gearLog.dateChecked
    ? new Date(gearLog.dateChecked).toLocaleString('en-AU', {
        dateStyle: 'medium',
        timeStyle: 'short',
        hour12: true,
      })
    : '-';

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold text-green-700 mb-8 border-b pb-3">
        Gear Log Details
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 text-gray-800 text-lg">
        <div className="space-y-4">
          <div>
            <span className="font-semibold text-gray-700">Worker:</span> {workerName}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Gear Type:</span> {gearLog.gearType || '-'}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Status:</span> {gearLog.status || '-'}
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <span className="font-semibold text-gray-700">Site:</span> {siteName}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Gear Condition:</span> {gearLog.gearCondition || '-'}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Date Checked:</span> {formattedDateChecked}
          </div>
        </div>
      </div>
      <div className="mt-10">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Remarks:</h3>
        <p className="bg-gray-50 p-4 rounded-lg border border-gray-300 min-h-[80px] text-gray-700 whitespace-pre-wrap">
          {gearLog.remarks || '-'}
        </p>
      </div>
      <div className="mt-8 text-right">
        <Link
          to="/gear-logs"
          className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition"
        >
          Back to List
        </Link>
      </div>
    </div>
  );
};

export default GearLogView;
