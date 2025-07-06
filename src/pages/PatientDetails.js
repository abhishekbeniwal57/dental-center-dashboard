import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import Layout from "../components/Layout";
import Card from "../components/Card";
import Button from "../components/Button";
import FormInput from "../components/FormInput";
import { viewFile } from "../utils/fileUtils";

const PatientDetails = () => {
  const { id } = useParams();
  const { currentUser, isAdmin } = useAuth();
  const {
    getPatient,
    updatePatient,
    getPatientAppointments,
    addFileToPatient,
    removeFileFromPatient,
  } = useData();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    medicalHistory: "",
  });
  const [errors, setErrors] = useState({});
  const [fileUpload, setFileUpload] = useState(null);
  const [fileError, setFileError] = useState("");

  // Redirect if not admin
  useEffect(() => {
    if (!currentUser || !isAdmin) {
      navigate("/login");
    }
  }, [currentUser, isAdmin, navigate]);

  // Load patient data
  useEffect(() => {
    const patientData = getPatient(id);
    if (patientData) {
      setPatient(patientData);
      setFormData({
        name: patientData.name || "",
        email: patientData.email || "",
        phone: patientData.phone || "",
        address: patientData.address || "",
        dateOfBirth: patientData.dateOfBirth || "",
        medicalHistory: patientData.medicalHistory || "",
      });
    } else {
      navigate("/patients");
    }

    const patientAppointments = getPatientAppointments(id);
    setAppointments(patientAppointments);
  }, [id, getPatient, getPatientAppointments, navigate]);

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
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      updatePatient(id, formData);
      setIsEditing(false);

      // Update local state
      setPatient((prev) => ({ ...prev, ...formData }));
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

        addFileToPatient(id, fileData);

        // Update local state
        setPatient((prev) => ({
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
      removeFileFromPatient(id, fileId);

      // Update local state
      setPatient((prev) => ({
        ...prev,
        files: prev.files.filter((file) => file.id !== fileId),
      }));
    }
  };

  if (!patient) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6">
          <p>Loading patient data...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Patient Details</h1>
          <div>
            <Button
              variant={isEditing ? "secondary" : "primary"}
              onClick={() => setIsEditing(!isEditing)}
              className="mr-2"
            >
              {isEditing ? "Cancel" : "Edit Patient"}
            </Button>
            <Button variant="secondary" onClick={() => navigate("/patients")}>
              Back to List
            </Button>
          </div>
        </div>

        {/* Patient Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            {isEditing ? (
              <Card title="Edit Patient Information">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      label="Full Name"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      error={errors.name}
                    />

                    <FormInput
                      label="Email"
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      error={errors.email}
                    />

                    <FormInput
                      label="Phone"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      error={errors.phone}
                    />

                    <FormInput
                      label="Date of Birth"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                    />

                    <div className="md:col-span-2">
                      <FormInput
                        label="Address"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label
                        htmlFor="medicalHistory"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Medical History
                      </label>
                      <textarea
                        id="medicalHistory"
                        name="medicalHistory"
                        rows="3"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        value={formData.medicalHistory}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button type="submit">Save Changes</Button>
                  </div>
                </form>
              </Card>
            ) : (
              <Card title="Patient Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{patient.name}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{patient.email}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{patient.phone}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p className="font-medium">
                      {patient.dateOfBirth || "Not provided"}
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">
                      {patient.address || "Not provided"}
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Medical History</p>
                    <p className="font-medium whitespace-pre-wrap">
                      {patient.medicalHistory || "No medical history provided"}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Appointments Section */}
            <Card title="Appointments" className="mt-6">
              {appointments.length > 0 ? (
                <div className="divide-y">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="py-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{appointment.type}</h4>
                          <p className="text-sm text-gray-500">
                            {appointment.notes}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{appointment.date}</p>
                          <p className="text-sm text-gray-500">
                            {appointment.time} ({appointment.duration} min)
                          </p>
                          <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 mt-1">
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No appointments scheduled</p>
              )}
              <div className="mt-4">
                <Button
                  variant="secondary"
                  onClick={() =>
                    navigate("/appointments/new", { state: { patientId: id } })
                  }
                >
                  Schedule Appointment
                </Button>
              </div>
            </Card>
          </div>

          {/* Files Section */}
          <Card title="Patient Files" className="w-full">
            <div className="space-y-4">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload New File
                </label>
                <div className="flex items-center">
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
                <p className="mt-1 text-xs text-gray-500">Max file size: 5MB</p>
              </div>

              {/* File List */}
              <div className="mt-4">
                <h4 className="font-medium mb-2">Uploaded Files</h4>
                {patient.files && patient.files.length > 0 ? (
                  <ul className="divide-y">
                    {patient.files.map((file) => (
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
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PatientDetails;
