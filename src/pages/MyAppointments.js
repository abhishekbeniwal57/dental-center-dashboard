import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import Layout from "../components/Layout";
import Card from "../components/Card";
import { viewFile } from "../utils/fileUtils";

const MyAppointments = () => {
  const { currentUser, isPatient } = useAuth();
  const { patients, appointments } = useData();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [patientAppointments, setPatientAppointments] = useState([]);
  const [filter, setFilter] = useState("upcoming");

  // Redirect if not patient
  useEffect(() => {
    if (!currentUser || !isPatient) {
      navigate("/login");
    }
  }, [currentUser, isPatient, navigate]);

  // Find the patient data and appointments associated with the current user
  useEffect(() => {
    if (currentUser && isPatient) {
      const patientData = patients.find((p) => p.email === currentUser.email);

      if (patientData) {
        setPatient(patientData);

        const patientAppts = appointments.filter(
          (a) => a.patientId === patientData.id
        );
        setPatientAppointments(patientAppts);
      }
    }
  }, [currentUser, isPatient, patients, appointments]);

  // Filter appointments
  const filteredAppointments = patientAppointments
    .filter((appointment) => {
      const appointmentDate = new Date(
        `${appointment.date}T${appointment.time}`
      );
      const today = new Date();

      if (filter === "upcoming") {
        // Show only scheduled future appointments
        return appointmentDate >= today && appointment.status === "scheduled";
      } else if (filter === "past") {
        // Show appointments with past dates OR with completed/cancelled/no-show status
        return (
          appointmentDate < today ||
          appointment.status === "completed" ||
          appointment.status === "cancelled" ||
          appointment.status === "no-show"
        );
      }

      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);

      if (filter === "upcoming") {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });

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

  const handleViewFile = (file) => {
    viewFile(file);
  };

  if (!patient) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6">
          <p>Loading your appointment data...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          My Appointments
        </h1>

        <div className="flex space-x-2 mb-6">
          <button
            className={`px-4 py-2 rounded-md ${
              filter === "upcoming" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setFilter("upcoming")}
          >
            Upcoming
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              filter === "past" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setFilter("past")}
          >
            Past
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
        </div>

        <Card>
          {filteredAppointments.length > 0 ? (
            <div className="divide-y">
              {filteredAppointments.map((appointment) => (
                <div key={appointment.id} className="py-4">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div>
                      <h3 className="text-lg font-medium">
                        {appointment.type}
                      </h3>
                      <p className="text-gray-500">{appointment.notes}</p>

                      {/* Show treatment details for completed appointments */}
                      {appointment.status === "completed" && (
                        <div className="mt-3 bg-gray-50 p-3 rounded-md">
                          <h4 className="font-medium text-gray-800 mb-2">
                            Treatment Details
                          </h4>

                          {appointment.treatment && (
                            <div className="mb-2">
                              <span className="text-sm text-gray-600">
                                Treatment:{" "}
                              </span>
                              <span className="font-medium">
                                {appointment.treatment}
                              </span>
                            </div>
                          )}

                          {appointment.cost && (
                            <div className="mb-2">
                              <span className="text-sm text-gray-600">
                                Cost:{" "}
                              </span>
                              <span className="font-medium">
                                ${appointment.cost}
                              </span>
                            </div>
                          )}

                          {appointment.nextAppointmentDate && (
                            <div className="mb-2">
                              <span className="text-sm text-gray-600">
                                Next Appointment:{" "}
                              </span>
                              <span className="font-medium">
                                {appointment.nextAppointmentDate}
                              </span>
                            </div>
                          )}

                          {/* Show appointment files */}
                          {appointment.files &&
                            appointment.files.length > 0 && (
                              <div className="mt-3">
                                <h5 className="text-sm font-medium text-gray-700 mb-1">
                                  Files
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                  {appointment.files.map((file, index) => (
                                    <button
                                      key={index}
                                      onClick={() => handleViewFile(file)}
                                      className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 py-1 px-2 rounded flex items-center"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 mr-1"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                        />
                                      </svg>
                                      {file.name || `File ${index + 1}`}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                        </div>
                      )}
                    </div>

                    <div className="mt-2 md:mt-0 md:text-right">
                      <div className="flex items-center md:justify-end">
                        <span className="font-medium">{appointment.date}</span>
                        <span className="mx-2">•</span>
                        <span>{appointment.time}</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {appointment.duration} minutes
                      </p>
                      <div className="mt-1">
                        {getStatusBadge(appointment.status)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              <p>No {filter} appointments found.</p>
            </div>
          )}
        </Card>

        <div className="mt-6">
          <p className="text-sm text-gray-600">
            For scheduling a new appointment or to make any changes to your
            existing appointments, please contact our dental office directly.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default MyAppointments;
