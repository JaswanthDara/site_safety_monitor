import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../axiosConfig';
import { useAuth } from '../../context/AuthContext';

const IncidentView = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [incident, setIncident] = useState(null);
  const [siteName, setSiteName] = useState('Loading...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncident = async () => {
      try {
        const res = await axiosInstance.get(`/api/safety/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setIncident(res.data);

        if (res.data.site_id) {
          try {
            const siteRes = await axiosInstance.get(`/api/sites/${res.data.site_id}`, {
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
        alert('Failed to load incident details.');
        navigate('/safety-incidents');
      } finally {
        setLoading(false);
      }
    };

    fetchIncident();
  }, [id, user.token, navigate]);

  if (loading) {
    return <div className="text-center mt-10 text-lg font-medium">Loading incident...</div>;
  }

  if (!incident) {
    return <div className="text-center mt-10 text-red-600 text-lg font-semibold">Incident not found.</div>;
  }

  const formattedDate = incident.date
    ? new Date(incident.date).toLocaleString('en-AU', {
        dateStyle: 'medium',
        timeStyle: 'short',
        hour12: true,
      })
    : '-';

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold text-blue-700 mb-8 border-b pb-3">
        Safety Incident Details
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 text-gray-800 text-lg">
        <div className="space-y-4">
          <div>
            <span className="font-semibold text-gray-700">Title:</span> {incident.title || '-'}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Incident Type:</span> {incident.incident_type || '-'}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Resolved:</span>{' '}
            {incident.resolved ? (
              <span className="text-green-600 font-semibold">Yes</span>
            ) : (
              <span className="text-red-600 font-semibold">No</span>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <span className="font-semibold text-gray-700">Site:</span> {siteName}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Severity:</span> {incident.severity_level || '-'}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Date & Time:</span> {formattedDate}
          </div>
        </div>
      </div>
      <div className="mt-10">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Description:</h3>
        <p className="bg-gray-50 p-4 rounded-lg border border-gray-300 min-h-[80px] text-gray-700 whitespace-pre-wrap">
          {incident.description || '-'}
        </p>
      </div>
      <div className="mt-8 text-right">
        <Link
          to="/safety-incidents"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
        >
          Back to List
        </Link>
      </div>
    </div>
  );
};

export default IncidentView;
