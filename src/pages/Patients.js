import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import Layout from "../components/Layout";
import Card from "../components/Card";
import Button from "../components/Button";
import FormInput from "../components/FormInput";

const Patients = () => {
  const { currentUser, isAdmin } = useAuth();
  const { patients, addPatient, deletePatient } = useData();
  const navigate = useNavigate();

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    medicalHistory: "",
  });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

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
    // Clear error when field is edited
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
      addPatient(formData);
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        dateOfBirth: "",
        medicalHistory: "",
      });
      setShowAddForm(false);
    }
  };

  // Filter patients by search term
  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm)
  );

  // View patient details
  const viewPatient = (id) => {
    navigate(`/patients/${id}`);
  };

  // Handle patient deletion
  const handleDelete = (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this patient? This will also delete all associated appointments."
      )
    ) {
      deletePatient(id);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Patients Management
          </h1>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? "Cancel" : "+ Add Patient"}
          </Button>
        </div>

        {/* Add Patient Form */}
        {showAddForm && (
          <Card title="Add New Patient" className="mb-8">
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
                <Button type="submit">Save Patient</Button>
              </div>
            </form>
          </Card>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <FormInput
            placeholder="Search patients by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Patients List */}
        <Card>
          {filteredPatients.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Contact
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date of Birth
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
                  {filteredPatients.map((patient) => (
                    <tr key={patient.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {patient.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900">{patient.email}</div>
                        <div className="text-gray-500">{patient.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {patient.dateOfBirth || "Not provided"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          variant="secondary"
                          className="mr-2"
                          onClick={() => viewPatient(patient.id)}
                        >
                          View
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleDelete(patient.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              {searchTerm
                ? "No patients match your search."
                : "No patients added yet."}
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default Patients;
