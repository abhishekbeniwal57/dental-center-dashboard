import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import Layout from "../components/Layout";
import Card from "../components/Card";

const Dashboard = () => {
  const { currentUser, isAdmin } = useAuth();
  const { patients, appointments } = useData();
  const navigate = useNavigate();

  // Redirect if not admin
  useEffect(() => {
    if (!currentUser || !isAdmin) {
      navigate("/login");
    }
  }, [currentUser, isAdmin, navigate]);

  // Calculate dashboard statistics
  const totalPatients = patients.length;
  const totalAppointments = appointments.length;

  const upcomingAppointments = appointments
    .filter(
      (appointment) =>
        new Date(`${appointment.date}T${appointment.time}`) >= new Date() &&
        appointment.status !== "cancelled" &&
        appointment.status !== "completed" &&
        appointment.status !== "no-show"
    )
    .sort(
      (a, b) =>
        new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`)
    );

  const appointmentsToday = appointments.filter((appointment) => {
    const today = new Date();
    const appointmentDate = new Date(appointment.date);
    return (
      appointmentDate.getDate() === today.getDate() &&
      appointmentDate.getMonth() === today.getMonth() &&
      appointmentDate.getFullYear() === today.getFullYear() &&
      appointment.status !== "cancelled" &&
      appointment.status !== "no-show"
    );
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Admin Dashboard
        </h1>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-blue-50 border border-blue-100">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-blue-800">
                Total Patients
              </h3>
              <p className="text-4xl font-bold text-blue-600 mt-2">
                {totalPatients}
              </p>
            </div>
          </Card>

          <Card className="bg-green-50 border border-green-100">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-green-800">
                Total Appointments
              </h3>
              <p className="text-4xl font-bold text-green-600 mt-2">
                {totalAppointments}
              </p>
            </div>
          </Card>

          <Card className="bg-purple-50 border border-purple-100">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-purple-800">
                Today's Appointments
              </h3>
              <p className="text-4xl font-bold text-purple-600 mt-2">
                {appointmentsToday.length}
              </p>
            </div>
          </Card>

          <Card className="bg-amber-50 border border-amber-100">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-amber-800">
                New Patients (Month)
              </h3>
              <p className="text-4xl font-bold text-amber-600 mt-2">
                {/* This would be calculated with real data */}
                {Math.floor(totalPatients / 2)}
              </p>
            </div>
          </Card>
        </div>

        {/* Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Appointments */}
          <Card title="Upcoming Appointments">
            {upcomingAppointments.length > 0 ? (
              <div className="divide-y">
                {upcomingAppointments.slice(0, 5).map((appointment) => {
                  const patient = patients.find(
                    (p) => p.id === appointment.patientId
                  );

                  return (
                    <div key={appointment.id} className="py-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">
                            {patient?.name || "Unknown Patient"}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {appointment.type}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{appointment.date}</p>
                          <p className="text-sm text-gray-500">
                            {appointment.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500">No upcoming appointments</p>
            )}
          </Card>

          {/* Recent Patients */}
          <Card title="Recent Patients">
            {patients.length > 0 ? (
              <div className="divide-y">
                {patients.slice(0, 5).map((patient) => (
                  <div key={patient.id} className="py-3">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium">{patient.name}</h4>
                        <p className="text-sm text-gray-500">{patient.email}</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        <p>{patient.phone}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No patients yet</p>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
