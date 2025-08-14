import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../axiosConfig";
import { useAuth } from "../../context/AuthContext";

const ComplianceView = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompliance = async () => {
      try {
        const res = await axiosInstance.get(`/api/equipment/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setRecord(res.data);
      } catch (err) {
        alert("Failed to load compliance details.");
        navigate("/equipment-compliance");
      } finally {
        setLoading(false);
      }
    };

    fetchCompliance();
  }, [id, user.token, navigate]);

  if (loading) {
    return (
      <div className="text-center mt-10 text-lg font-medium">
        Loading compliance record...
      </div>
    );
  }

  if (!record) {
    return (
      <div className="text-center mt-10 text-red-600 text-lg font-semibold">
        Record not found.
      </div>
    );
  }

  const formattedCheckedAt = record.checkedAt
    ? new Date(record.checkedAt).toLocaleDateString("en-AU", {
        dateStyle: "medium",
      })
    : "-";

  const formattedCreatedAt = record.createdAt
    ? new Date(record.createdAt).toLocaleString("en-AU", {
        dateStyle: "medium",
        timeStyle: "short",
        hour12: true,
      })
    : "-";

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold text-green-700 mb-8 border-b pb-3">
        Equipment Compliance Details
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 text-gray-800 text-lg">
        <div className="space-y-4">
          <div>
            <span className="font-semibold text-gray-700">Equipment Name:</span>{" "}
            {record.equipmentName || "-"}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Checked By:</span>{" "}
            {record.checkedBy?.name || record.checkedBy || "-"}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Status:</span>{" "}
            <span
              className={
                record.status === "Compliant"
                  ? "text-green-600 font-semibold"
                  : record.status === "Non-compliant"
                  ? "text-red-600 font-semibold"
                  : "text-yellow-600 font-semibold"
              }
            >
              {record.status || "-"}
            </span>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <span className="font-semibold text-gray-700">Checked At:</span>{" "}
            {formattedCheckedAt}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Created At:</span>{" "}
            {formattedCreatedAt}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Remarks:</span>{" "}
            {record.remarks || "-"}
          </div>
        </div>
      </div>
      <div className="mt-8 text-right">
        <Link
          to="/equipment-compliance"
          className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition"
        >
          Back to List
        </Link>
      </div>
    </div>
  );
};

export default ComplianceView;
