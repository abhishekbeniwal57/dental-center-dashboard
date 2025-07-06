import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import Layout from "../components/Layout";
import Card from "../components/Card";
import Button from "../components/Button";
import { viewFile } from "../utils/fileUtils";

const MyProfile = () => {
  const { currentUser, isPatient } = useAuth();
  const { patients } = useData();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);

  // Redirect if not patient
  useEffect(() => {
    if (!currentUser || !isPatient) {
      navigate("/login");
    }
  }, [currentUser, isPatient, navigate]);

  // Find the patient data associated with the current user
  useEffect(() => {
    if (currentUser && isPatient) {
      const patientData = patients.find((p) => p.email === currentUser.email);
      if (patientData) {
        setPatient(patientData);
      }
    }
  }, [currentUser, isPatient, patients]);

  if (!patient) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6">
          <p>Loading your profile data...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card title="Personal Information">
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
              </div>
            </Card>

            <Card title="Medical History" className="mt-6">
              <p className="whitespace-pre-wrap">
                {patient.medicalHistory || "No medical history recorded."}
              </p>
            </Card>
          </div>

          {/* Files Section */}
          <Card title="My Files" className="w-full">
            {patient.files && patient.files.length > 0 ? (
              <ul className="divide-y">
                {patient.files.map((file) => (
                  <li key={file.id} className="py-3">
                    <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          Uploaded:{" "}
                          {new Date(file.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => viewFile(file)}
                      >
                        View
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No files uploaded</p>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default MyProfile;
