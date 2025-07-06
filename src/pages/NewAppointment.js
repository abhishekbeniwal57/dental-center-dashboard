import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import Layout from "../components/Layout";
import Card from "../components/Card";
import Button from "../components/Button";
import FormInput from "../components/FormInput";

const NewAppointment = () => {
  const { currentUser, isAdmin } = useAuth();
  const { patients, addAppointment } = useData();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if patientId was passed via location state
  const preselectedPatientId = location.state?.patientId;

  const [formData, setFormData] = useState({
    patientId: preselectedPatientId || "",
    date: "",
    time: "",
    duration: "60",
    type: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});

  // Redirect if not admin
  useEffect(() => {
    if (!currentUser || !isAdmin) {
      navigate("/login");
    }
  }, [currentUser, isAdmin, navigate]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.patientId) newErrors.patientId = "Patient is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.time) newErrors.time = "Time is required";
    if (!formData.type) newErrors.type = "Appointment type is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      addAppointment(formData);
      navigate("/appointments");
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Schedule New Appointment
          </h1>
          <Button variant="secondary" onClick={() => navigate("/appointments")}>
            Cancel
          </Button>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 mb-6">
                <label
                  htmlFor="patientId"
                  className="block text-base font-medium text-gray-700 mb-2"
                >
                  Patient
                </label>
                <select
                  id="patientId"
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleChange}
                  className={`
                    form-select block w-full px-4 py-3 text-base
                    rounded-lg shadow-sm transition duration-150 ease-in-out
                    focus:ring-blue-500 focus:border-blue-500 focus:ring-2
                    ${errors.patientId ? "border-red-300" : "border-gray-300"}
                  `}
                >
                  <option value="">Select a patient</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name}
                    </option>
                  ))}
                </select>
                {errors.patientId && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.patientId}
                  </p>
                )}
              </div>

              <FormInput
                label="Date"
                id="date"
                name="date"
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={formData.date}
                onChange={handleChange}
                error={errors.date}
              />

              <FormInput
                label="Time"
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                error={errors.time}
              />

              <div className="mb-6">
                <label
                  htmlFor="duration"
                  className="block text-base font-medium text-gray-700 mb-2"
                >
                  Duration (minutes)
                </label>
                <select
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="form-select block w-full px-4 py-3 text-base rounded-lg shadow-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500 focus:ring-2 transition duration-150 ease-in-out"
                >
                  <option value="30">30 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="90">90 minutes</option>
                  <option value="120">120 minutes</option>
                </select>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="type"
                  className="block text-base font-medium text-gray-700 mb-2"
                >
                  Appointment Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={`
                    form-select block w-full px-4 py-3 text-base
                    rounded-lg shadow-sm transition duration-150 ease-in-out
                    focus:ring-blue-500 focus:border-blue-500 focus:ring-2
                    ${errors.type ? "border-red-300" : "border-gray-300"}
                  `}
                >
                  <option value="">Select appointment type</option>
                  <option value="Check-up">Check-up</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Filling">Filling</option>
                  <option value="Root Canal">Root Canal</option>
                  <option value="Crown">Crown</option>
                  <option value="Extraction">Extraction</option>
                  <option value="Consultation">Consultation</option>
                  <option value="Follow-up">Follow-up</option>
                </select>
                {errors.type && (
                  <p className="mt-2 text-sm text-red-600">{errors.type}</p>
                )}
              </div>

              <div className="md:col-span-2 mb-6">
                <label
                  htmlFor="notes"
                  className="block text-base font-medium text-gray-700 mb-2"
                >
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows="4"
                  className="form-textarea block w-full px-4 py-3 text-base rounded-lg shadow-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500 focus:ring-2 transition duration-150 ease-in-out"
                  value={formData.notes}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button type="submit">Schedule Appointment</Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default NewAppointment;
