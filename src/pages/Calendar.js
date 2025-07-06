import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import Layout from "../components/Layout";
import Card from "../components/Card";
import Button from "../components/Button";

const Calendar = () => {
  const { currentUser, isAdmin } = useAuth();
  const { appointments, patients } = useData();
  const navigate = useNavigate();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [dayAppointments, setDayAppointments] = useState([]);
  const [viewMode, setViewMode] = useState("month"); // 'month' or 'week'
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());

  // Redirect if not admin
  useEffect(() => {
    if (!currentUser || !isAdmin) {
      navigate("/login");
    }
  }, [currentUser, isAdmin, navigate]);

  // Get appointments for a specific day
  const getAppointmentsForDay = useCallback(
    (date) => {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();

      const dateStr = `${year}-${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;

      return appointments.filter((appointment) => appointment.date === dateStr);
    },
    [appointments]
  );

  // Generate calendar days for the current month
  useEffect(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // Get first day of month and last day of month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Get days from previous month to fill the first week
    const daysFromPrevMonth = firstDay.getDay();
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    const daysArray = [];

    // Add days from previous month
    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      daysArray.push({
        date,
        currentMonth: false,
        appointments: getAppointmentsForDay(date),
      });
    }

    // Add days from current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      daysArray.push({
        date,
        currentMonth: true,
        appointments: getAppointmentsForDay(date),
      });
    }

    // Add days from next month to fill the last week
    const daysToAdd = 42 - daysArray.length; // 6 weeks * 7 days = 42
    for (let i = 1; i <= daysToAdd; i++) {
      const date = new Date(year, month + 1, i);
      daysArray.push({
        date,
        currentMonth: false,
        appointments: getAppointmentsForDay(date),
      });
    }

    setCalendarDays(daysArray);

    // Reset selected day when month changes
    setSelectedDay(null);
    setDayAppointments([]);
  }, [currentMonth, getAppointmentsForDay]);

  // Generate weekly calendar days
  useEffect(() => {
    if (viewMode !== "week") return;

    const startDate = new Date(currentWeekStart);
    startDate.setDate(startDate.getDate() - startDate.getDay()); // Get Sunday

    const daysArray = [];

    // Generate 7 days for the week
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);

      daysArray.push({
        date,
        currentMonth: date.getMonth() === currentMonth.getMonth(),
        appointments: getAppointmentsForDay(date),
      });
    }

    setCalendarDays(daysArray);
  }, [viewMode, currentWeekStart, currentMonth, getAppointmentsForDay]);

  // Handle day selection
  const handleDayClick = (day) => {
    setSelectedDay(day.date);
    setDayAppointments(day.appointments);
  };

  // Navigate to previous month
  const previousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  // Navigate to today
  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    setCurrentWeekStart(today);

    // Find today in calendar days and select it
    const todayStr = today.toDateString();
    const todayInCalendar = calendarDays.find(
      (day) => day.date.toDateString() === todayStr
    );

    if (todayInCalendar) {
      handleDayClick(todayInCalendar);
    }
  };

  // Navigate to previous week
  const previousWeek = () => {
    const prevWeek = new Date(currentWeekStart);
    prevWeek.setDate(prevWeek.getDate() - 7);
    setCurrentWeekStart(prevWeek);
  };

  // Navigate to next week
  const nextWeek = () => {
    const nextWeek = new Date(currentWeekStart);
    nextWeek.setDate(nextWeek.getDate() + 7);
    setCurrentWeekStart(nextWeek);
  };

  // Handle view mode change
  const handleViewModeChange = (mode) => {
    setViewMode(mode);

    // Force regeneration of calendar days when switching view modes
    if (mode === "month") {
      // When switching to month view, regenerate the month days
      const newCurrentMonth = new Date(currentMonth);
      setCurrentMonth(
        new Date(newCurrentMonth.getFullYear(), newCurrentMonth.getMonth() - 1)
      );
      setTimeout(() => {
        setCurrentMonth(newCurrentMonth);
      }, 10);
    } else if (mode === "week") {
      // When switching to week view, regenerate the week days
      const newWeekStart = new Date(currentWeekStart);
      setCurrentWeekStart(new Date(newWeekStart.getTime() - 86400000)); // Subtract one day
      setTimeout(() => {
        setCurrentWeekStart(newWeekStart);
      }, 10);
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

  // Format date as YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Day names
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Appointment Calendar
          </h1>
          <Button onClick={() => navigate("/appointments/new")}>
            + New Appointment
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card>
              {/* Calendar Header */}
              <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
                <div>
                  <h2 className="text-xl font-bold">
                    {viewMode === "month"
                      ? `${
                          monthNames[currentMonth.getMonth()]
                        } ${currentMonth.getFullYear()}`
                      : `Week of ${new Date(
                          currentWeekStart
                        ).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                        })}, ${new Date(currentWeekStart).getFullYear()}`}
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      className={`px-3 py-1 text-sm ${
                        viewMode === "month"
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-700"
                      }`}
                      onClick={() => handleViewModeChange("month")}
                    >
                      Month
                    </button>
                    <button
                      className={`px-3 py-1 text-sm ${
                        viewMode === "week"
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-700"
                      }`}
                      onClick={() => handleViewModeChange("week")}
                    >
                      Week
                    </button>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="secondary"
                      onClick={
                        viewMode === "month" ? previousMonth : previousWeek
                      }
                      size="sm"
                    >
                      &larr; Prev
                    </Button>
                    <Button variant="secondary" onClick={goToToday} size="sm">
                      Today
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={viewMode === "month" ? nextMonth : nextWeek}
                      size="sm"
                    >
                      Next &rarr;
                    </Button>
                  </div>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Day Names */}
                {dayNames.map((day, index) => (
                  <div
                    key={index}
                    className="text-center py-2 font-medium text-gray-600"
                  >
                    {day}
                  </div>
                ))}

                {/* Calendar Days */}
                {calendarDays.map((day, index) => {
                  const isToday =
                    day.date.toDateString() === new Date().toDateString();
                  const isSelected =
                    selectedDay &&
                    day.date.toDateString() === selectedDay.toDateString();

                  return (
                    <div
                      key={index}
                      className={`
                        p-1 min-h-[80px] border rounded-md
                        ${
                          day.currentMonth
                            ? "bg-white"
                            : "bg-gray-50 text-gray-400"
                        }
                        ${isToday ? "border-blue-500" : "border-gray-200"}
                        ${isSelected ? "ring-2 ring-blue-500" : ""}
                        cursor-pointer hover:bg-gray-50
                      `}
                      onClick={() => handleDayClick(day)}
                    >
                      <div className="flex justify-between items-center">
                        <span
                          className={`text-sm font-medium ${
                            isToday
                              ? "bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                              : ""
                          }`}
                        >
                          {day.date.getDate()}
                        </span>
                        {day.appointments.length > 0 && (
                          <span className="bg-blue-100 text-blue-800 text-xs rounded-full px-2 py-0.5">
                            {day.appointments.length}
                          </span>
                        )}
                      </div>

                      {/* Show first two appointments for the day */}
                      <div className="mt-1 space-y-1 overflow-hidden max-h-[40px]">
                        {day.appointments
                          .slice(0, 2)
                          .map((appointment, idx) => (
                            <div
                              key={idx}
                              className="text-xs bg-blue-50 rounded p-1 truncate"
                            >
                              {appointment.time} - {appointment.type}
                            </div>
                          ))}
                        {day.appointments.length > 2 && (
                          <div className="text-xs text-gray-500">
                            + {day.appointments.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Day Details */}
          <div>
            <Card>
              {selectedDay ? (
                <>
                  <h3 className="font-bold text-lg mb-4">
                    {new Date(selectedDay).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </h3>

                  {dayAppointments.length > 0 ? (
                    <div className="divide-y">
                      {dayAppointments
                        .sort((a, b) => {
                          // Sort by time
                          return a.time.localeCompare(b.time);
                        })
                        .map((appointment) => {
                          const patient = patients.find(
                            (p) => p.id === appointment.patientId
                          );

                          return (
                            <div key={appointment.id} className="py-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">
                                    {appointment.time} ({appointment.duration}{" "}
                                    min)
                                  </p>
                                  <p className="text-gray-600">
                                    {appointment.type}
                                  </p>
                                  <p className="text-sm font-medium mt-1">
                                    {patient?.name || "Unknown Patient"}
                                  </p>
                                  {appointment.notes && (
                                    <p className="text-sm text-gray-500 mt-1">
                                      {appointment.notes}
                                    </p>
                                  )}
                                </div>
                                <div>
                                  {getStatusBadge(appointment.status)}
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    className="mt-2"
                                    onClick={() =>
                                      navigate(
                                        `/appointments/${appointment.id}`
                                      )
                                    }
                                  >
                                    Edit
                                  </Button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      No appointments scheduled for this day.
                    </p>
                  )}

                  <div className="mt-4">
                    <Button
                      onClick={() =>
                        navigate("/appointments/new", {
                          state: {
                            date: formatDate(selectedDay),
                          },
                        })
                      }
                    >
                      Add Appointment
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Select a day to view appointments</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Calendar;
