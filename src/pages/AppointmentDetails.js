import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import Layout from "../components/Layout";
import Card from "../components/Card";
import Button from "../components/Button";
import FormInput from "../components/FormInput";
import { viewFile } from "../utils/fileUtils";

const AppointmentDetails = () => {
  const { id } = useParams();
  const { currentUser, isAdmin } = useAuth();
  const {
    getAppointment,
    updateAppointment,
    patients,
    addFileToAppointment,
    removeFileFromAppointment,
  } = useData();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [fileUpload, setFileUpload] = useState(null);
  const [fileError, setFileError] = useState("");
  const [formData, setFormData] = useState({
    patientId: "",
    date: "",
    time: "",
    duration: "",
    type: "",
    notes: "",
    status: "",
    cost: "",
    treatment: "",
    nextAppointmentDate: "",
  });

  const [errors, setErrors] = useState({});

  // Redirect if not admin
  useEffect(() => {
    if (!currentUser || !isAdmin) {
      navigate("/login");
    }
  }, [currentUser, isAdmin, navigate]);

  // Load appointment data
  useEffect(() => {
    const appointmentData = getAppointment(id);

    if (appointmentData) {
      setAppointment(appointmentData);
      setFormData({
        patientId: appointmentData.patientId || "",
        date: appointmentData.date || "",
        time: appointmentData.time || "",
        duration: appointmentData.duration || "60",
        type: appointmentData.type || "",
        notes: appointmentData.notes || "",
        status: appointmentData.status || "scheduled",
        cost: appointmentData.cost || "",
        treatment: appointmentData.treatment || "",
        nextAppointmentDate: appointmentData.nextAppointmentDate || "",
      });

      // Find patient data (not needed currently, but kept for future reference)
      // const patientData = patients.find(p => p.id === appointmentData.patientId);
    } else {
      navigate("/appointments");
    }
  }, [id, getAppointment, patients, navigate]);

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
      updateAppointment(id, formData);
      navigate("/appointments");
    }
  };

  // Handle file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFileError("File size cannot exceed 5MB");
        setFileUpload(null);
      } else {
        setFileError("");
        setFileUpload(file);
      }
    }
  };

  // Handle file upload
  const handleFileUpload = () => {
    if (fileUpload) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const fileData = {
          name: fileUpload.name,
          type: fileUpload.type,
          data: e.target.result, // Base64 encoded data
        };

        addFileToAppointment(id, fileData);

        // Update local state
        setAppointment((prev) => ({
          ...prev,
          files: [
            ...(prev.files || []),
            {
              id: Date.now().toString(), // Temporary ID until state updates
              name: fileUpload.name,
              type: fileUpload.type,
              uploadDate: new Date().toISOString(),
            },
          ],
        }));

        setFileUpload(null);
      };

      reader.readAsDataURL(fileUpload);
    }
  };

  // Handle file deletion
  const handleDeleteFile = (fileId) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      removeFileFromAppointment(id, fileId);

      // Update local state
      setAppointment((prev) => ({
        ...prev,
        files: prev.files.filter((file) => file.id !== fileId),
      }));
    }
  };

  if (!appointment) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6">
          <p>Loading appointment data...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Edit Appointment</h1>
          <Button variant="secondary" onClick={() => navigate("/appointments")}>
            Back to Appointments
          </Button>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label
                  htmlFor="patientId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Patient
                </label>
                <select
                  id="patientId"
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleChange}
                  className={`
                    shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full 
                    sm:text-sm border-gray-300 rounded-md
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
                  <p className="mt-1 text-sm text-red-600">
                    {errors.patientId}
                  </p>
                )}
              </div>

              <FormInput
                label="Date"
                id="date"
                name="date"
                type="date"
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

              <div>
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Duration (minutes)
                </label>
                <select
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="30">30 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="90">90 minutes</option>
                  <option value="120">120 minutes</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Appointment Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={`
                    shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full 
                    sm:text-sm border-gray-300 rounded-md
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
                  <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no-show">No Show</option>
                </select>
              </div>

              {/* Cost Field - Shown when status is completed */}
              {formData.status === "completed" && (
                <div>
                  <label
                    htmlFor="cost"
                    className="block text-base font-medium text-gray-700 mb-2"
                  >
                    Treatment Cost ($)
                  </label>
                  <input
                    type="number"
                    id="cost"
                    name="cost"
                    value={formData.cost}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="form-input block w-full px-4 py-3 text-base rounded-lg shadow-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500 focus:ring-2 transition duration-150 ease-in-out"
                    placeholder="0.00"
                  />
                </div>
              )}

              {/* Treatment Details - Shown when status is completed */}
              {formData.status === "completed" && (
                <div>
                  <label
                    htmlFor="treatment"
                    className="block text-base font-medium text-gray-700 mb-2"
                  >
                    Treatment Details
                  </label>
                  <textarea
                    id="treatment"
                    name="treatment"
                    rows="3"
                    className="form-textarea block w-full px-4 py-3 text-base rounded-lg shadow-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500 focus:ring-2 transition duration-150 ease-in-out"
                    value={formData.treatment}
                    onChange={handleChange}
                    placeholder="Enter treatment details"
                  ></textarea>
                </div>
              )}

              {/* Next Appointment Date - Shown when status is completed */}
              {formData.status === "completed" && (
                <div>
                  <label
                    htmlFor="nextAppointmentDate"
                    className="block text-base font-medium text-gray-700 mb-2"
                  >
                    Next Appointment Date
                  </label>
                  <input
                    type="date"
                    id="nextAppointmentDate"
                    name="nextAppointmentDate"
                    value={formData.nextAppointmentDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="form-input block w-full px-4 py-3 text-base rounded-lg shadow-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500 focus:ring-2 transition duration-150 ease-in-out"
                  />
                </div>
              )}

              <div className="md:col-span-2">
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
            {/* File Upload Section */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Files
              </label>
              <div className="flex items-center">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="form-input block w-full text-sm border-gray-300 rounded-md"
                  accept=".jpg,.jpeg,.png,.pdf"
                />
                <Button
                  type="button"
                  onClick={handleFileUpload}
                  className="ml-3"
                  disabled={!fileUpload}
                >
                  Upload
                </Button>
              </div>
              {fileError && (
                <p className="mt-1 text-sm text-red-600">{fileError}</p>
              )}
            </div>
            {/* Existing Files List */}
            {appointment.files && appointment.files.length > 0 && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Uploaded Files
                </h2>
                <ul className="list-disc list-inside">
                  {appointment.files.map((file) => (
                    <li
                      key={file.id}
                      className="flex justify-between items-center"
                    >
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteFile(file.id)}
                      >
                        Delete
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}{" "}
            {/* File Upload Section - Only shown for completed appointments */}
            {formData.status === "completed" && (
              <div className="mt-6 border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Treatment Files
                </h3>

                {/* File Upload */}
                <div className="mb-4">
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    Upload Files
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <Button
                      onClick={handleFileUpload}
                      disabled={!fileUpload}
                      size="sm"
                    >
                      Upload
                    </Button>
                  </div>
                  {fileError && (
                    <p className="mt-1 text-sm text-red-600">{fileError}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Max file size: 5MB
                  </p>
                </div>

                {/* File List */}
                {appointment.files && appointment.files.length > 0 ? (
                  <ul className="divide-y">
                    {appointment.files.map((file) => (
                      <li
                        key={file.id}
                        className="py-3 flex flex-wrap md:flex-nowrap justify-between items-center gap-3"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            Uploaded:{" "}
                            {new Date(file.uploadDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => viewFile(file)}
                          >
                            View
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteFile(file.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No files uploaded</p>
                )}
              </div>
            )}
            <div className="mt-6 flex justify-end">
              <Button type="submit">Update Appointment</Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default AppointmentDetails;
