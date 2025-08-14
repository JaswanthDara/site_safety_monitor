import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../axiosConfig";
import { useAuth } from "../../context/AuthContext";

const ReportView = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axiosInstance.get(`/api/hazard/reports/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setReport(res.data);
      } catch (err) {
        alert("Failed to load report.");
        navigate("/hazard-reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id, user.token, navigate]);

  if (loading) {
    return (
      <div className="text-center mt-10 text-lg font-medium">
        Loading report...
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center mt-10 text-red-600 text-lg font-semibold">
        Report not found.
      </div>
    );
  }

  const formattedDate = report.date
    ? new Date(report.date).toLocaleString("en-AU", {
        dateStyle: "medium",
        timeStyle: "short",
        hour12: true,
      })
    : "-";

  const createdAt = report.createdAt
    ? new Date(report.createdAt).toLocaleString("en-AU", {
        dateStyle: "medium",
        timeStyle: "short",
        hour12: true,
      })
    : "-";

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold text-red-700 mb-8 border-b pb-3">
        Hazard Report Details
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 text-gray-800 text-lg">
        <div className="space-y-4">
          <div>
            <span className="font-semibold text-gray-700">Title:</span>{" "}
            {report.title || "-"}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Created At:</span>{" "}
            {createdAt}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <span className="font-semibold text-gray-700">Location:</span>{" "}
            {report.location || "-"}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Reported Date:</span>{" "}
            {formattedDate}
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Description:
        </h3>
        <p className="bg-gray-50 p-4 rounded-lg border border-gray-300 min-h-[80px] text-gray-700 whitespace-pre-wrap">
          {report.description || "-"}
        </p>
      </div>

      <div className="mt-8 text-right">
        <Link
          to="/hazard-reports"
          className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition"
        >
          Back to List
        </Link>
      </div>
    </div>
  );
};

export default ReportView;
