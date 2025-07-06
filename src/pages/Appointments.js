import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import Layout from "../components/Layout";
import Card from "../components/Card";
import Button from "../components/Button";

const Appointments = () => {
  const { currentUser, isAdmin } = useAuth();
  const { appointments, patients, deleteAppointment } = useData();
  const navigate = useNavigate();

  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Redirect if not admin
  useEffect(() => {
    if (!currentUser || !isAdmin) {
      navigate("/login");
    }
  }, [currentUser, isAdmin, navigate]);

  // Filter and sort appointments
  const filteredAppointments = appointments
    .filter((appointment) => {
      // Filter by status
      if (filter !== "all" && appointment.status !== filter) {
        return false;
      }

      // Search functionality
      if (searchTerm) {
        const patient = patients.find((p) => p.id === appointment.patientId);
        const patientName = patient ? patient.name.toLowerCase() : "";

        return (
          appointment.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patientName.includes(searchTerm.toLowerCase()) ||
          appointment.date.includes(searchTerm)
        );
      }

      return true;
    })
    .sort((a, b) => {
      // Sort by date and time
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA - dateB;
    });

  // Handle appointment deletion
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      deleteAppointment(id);
    }
  };

  // Format appointment status for display
  const getStatusBadge = (status) => {
    const statusClasses = {
      scheduled: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      "no-show": "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`inline-block px-2 py-1 text-xs rounded-full ${
          statusClasses[status] || "bg-gray-100"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Appointments</h1>
          <Button onClick={() => navigate("/appointments/new")}>
            + New Appointment
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by patient name, type, or date..."
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex space-x-2">
            <button
              className={`px-4 py-2 rounded-md ${
                filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
                filter === "scheduled"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setFilter("scheduled")}
            >
              Scheduled
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
                filter === "completed"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setFilter("completed")}
            >
              Completed
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
                filter === "cancelled"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setFilter("cancelled")}
            >
              Cancelled
            </button>
          </div>
        </div>

        {/* Appointments List */}
        <Card>
          {filteredAppointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Patient
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date & Time
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Type
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAppointments.map((appointment) => {
                    const patient = patients.find(
                      (p) => p.id === appointment.patientId
                    ) || { name: "Unknown Patient" };
                    return (
                      <tr key={appointment.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            {patient.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-900">
                            {appointment.date}
                          </div>
                          <div className="text-gray-500">
                            {appointment.time} ({appointment.duration} min)
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {appointment.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(appointment.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button
                            variant="secondary"
                            className="mr-2"
                            onClick={() =>
                              navigate(`/appointments/${appointment.id}`)
                            }
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => handleDelete(appointment.id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              {searchTerm || filter !== "all"
                ? "No appointments match your search or filter."
                : "No appointments scheduled yet."}
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default Appointments;
