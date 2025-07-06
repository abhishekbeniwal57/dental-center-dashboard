import { createContext, useState, useContext, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const DataContext = createContext();

export const useData = () => {
  return useContext(DataContext);
};

export const DataProvider = ({ children }) => {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedPatients = localStorage.getItem("dentalPatients");
    const storedAppointments = localStorage.getItem("dentalAppointments");

    if (storedPatients) {
      setPatients(JSON.parse(storedPatients));
    } else {
      // Initialize with some sample data
      const samplePatients = [
        {
          id: "1",
          name: "John Doe",
          email: "patient1@example.com",
          phone: "555-123-4567",
          address: "123 Main St, Anytown, ST 12345",
          dateOfBirth: "1985-06-15",
          medicalHistory: "No significant dental history.",
          files: [],
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "patient2@example.com",
          phone: "555-987-6543",
          address: "456 Oak Ave, Somewhere, ST 67890",
          dateOfBirth: "1990-09-22",
          medicalHistory: "Root canal on tooth #18 in 2020.",
          files: [],
        },
      ];
      setPatients(samplePatients);
      localStorage.setItem("dentalPatients", JSON.stringify(samplePatients));
    }

    if (storedAppointments) {
      setAppointments(JSON.parse(storedAppointments));
    } else {
      // Initialize with some sample appointments
      const sampleAppointments = [
        {
          id: "1",
          patientId: "1",
          date: "2025-07-05",
          time: "09:00",
          duration: 60,
          type: "Check-up",
          notes: "Regular dental check-up",
          status: "scheduled",
        },
        {
          id: "2",
          patientId: "2",
          date: "2025-07-10",
          time: "14:00",
          duration: 90,
          type: "Cleaning",
          notes: "Dental cleaning",
          status: "scheduled",
        },
      ];
      setAppointments(sampleAppointments);
      localStorage.setItem(
        "dentalAppointments",
        JSON.stringify(sampleAppointments)
      );
    }

    setLoading(false);
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("dentalPatients", JSON.stringify(patients));
    }
  }, [patients, loading]);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem("dentalAppointments", JSON.stringify(appointments));
    }
  }, [appointments, loading]);

  // Patient CRUD operations
  const addPatient = (patientData) => {
    const newPatient = {
      ...patientData,
      id: uuidv4(),
      files: [],
    };
    setPatients((prevPatients) => [...prevPatients, newPatient]);
    return newPatient;
  };

  const updatePatient = (id, patientData) => {
    setPatients((prevPatients) =>
      prevPatients.map((patient) =>
        patient.id === id ? { ...patient, ...patientData } : patient
      )
    );
  };

  const deletePatient = (id) => {
    setPatients((prevPatients) =>
      prevPatients.filter((patient) => patient.id !== id)
    );
    // Also delete associated appointments
    setAppointments((prevAppointments) =>
      prevAppointments.filter((appointment) => appointment.patientId !== id)
    );
  };

  const getPatient = (id) => {
    return patients.find((patient) => patient.id === id) || null;
  };

  // File handling for patients
  const addFileToPatient = (patientId, fileData) => {
    const newFile = {
      id: uuidv4(),
      name: fileData.name,
      type: fileData.type,
      data: fileData.data, // Base64 encoded data
      uploadDate: new Date().toISOString(),
    };

    setPatients((prevPatients) =>
      prevPatients.map((patient) =>
        patient.id === patientId
          ? { ...patient, files: [...patient.files, newFile] }
          : patient
      )
    );

    return newFile;
  };

  const removeFileFromPatient = (patientId, fileId) => {
    setPatients((prevPatients) =>
      prevPatients.map((patient) =>
        patient.id === patientId
          ? {
              ...patient,
              files: patient.files.filter((file) => file.id !== fileId),
            }
          : patient
      )
    );
  };

  // Appointment CRUD operations
  const addAppointment = (appointmentData) => {
    const newAppointment = {
      ...appointmentData,
      id: uuidv4(),
      status: "scheduled",
    };
    setAppointments((prevAppointments) => [
      ...prevAppointments,
      newAppointment,
    ]);
    return newAppointment;
  };

  const updateAppointment = (id, appointmentData) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appointment) =>
        appointment.id === id
          ? { ...appointment, ...appointmentData }
          : appointment
      )
    );
  };

  const deleteAppointment = (id) => {
    setAppointments((prevAppointments) =>
      prevAppointments.filter((appointment) => appointment.id !== id)
    );
  };

  const getAppointment = (id) => {
    return appointments.find((appointment) => appointment.id === id) || null;
  };

  const getPatientAppointments = (patientId) => {
    return appointments.filter(
      (appointment) => appointment.patientId === patientId
    );
  };

  // File handling for appointments
  const addFileToAppointment = (appointmentId, fileData) => {
    const newFile = {
      id: uuidv4(),
      name: fileData.name,
      type: fileData.type,
      data: fileData.data, // Base64 encoded data
      uploadDate: new Date().toISOString(),
    };

    setAppointments((prevAppointments) =>
      prevAppointments.map((appointment) =>
        appointment.id === appointmentId
          ? {
              ...appointment,
              files: [...(appointment.files || []), newFile],
            }
          : appointment
      )
    );

    return newFile;
  };

  const removeFileFromAppointment = (appointmentId, fileId) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appointment) =>
        appointment.id === appointmentId
          ? {
              ...appointment,
              files:
                appointment.files?.filter((file) => file.id !== fileId) || [],
            }
          : appointment
      )
    );
  };

  const value = {
    patients,
    appointments,
    loading,
    addPatient,
    updatePatient,
    deletePatient,
    getPatient,
    addFileToPatient,
    removeFileFromPatient,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    getAppointment,
    getPatientAppointments,
    addFileToAppointment,
    removeFileFromAppointment,
  };

  return (
    <DataContext.Provider value={value}>
      {!loading && children}
    </DataContext.Provider>
  );
};
