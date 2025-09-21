import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import CalendarPanel from "./CalendarPanel";
import AppointmentModal from "./AppointmentModal";
import "../styles/CalendarPage.sass";

let nextId = 1;
const getNextId = () => nextId++;

const CalendarPage = () => {
  const [view, setView] = useState("day"); // day | week | month
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContext, setModalContext] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // sidebar toggle

  // Toggle sidebar (for mobile)
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const openModal = (payload) => {
    setModalContext(payload);
    setModalOpen(true);
  };

  const handleSaveAppointment = (payload) => {
    const newAppt = { id: getNextId(), conflict: false, ...payload };
    setAppointments((prev) => [...prev, newAppt]);

    if (modalContext?.fromView === "month" || modalContext?.fromView === "dayCell") {
      setView("day");
      setSelectedDate(new Date(newAppt.start));
    }
    setModalOpen(false);
    setModalContext(null);
  };

  const handleUpdateAppointment = (payload) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === payload.id ? { ...a, ...payload } : a))
    );

    if (modalContext?.fromView === "month" || modalContext?.fromView === "dayCell") {
      setView("day");
      setSelectedDate(new Date(payload.start));
    }

    setModalOpen(false);
    setModalContext(null);
  };

  const handleDeleteAppointment = (id) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
    setModalOpen(false);
    setModalContext(null);
  };

  const startOfWeek = (date) => {
    const d = new Date(date);
    const mondayOffset = (d.getDay() + 6) % 7;
    const monday = new Date(d);
    monday.setDate(d.getDate() - mondayOffset);
    monday.setHours(0, 0, 0, 0);
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      return day;
    });
  };

  const goPrev = () => {
    setSelectedDate((prev) => {
      const nd = new Date(prev);
      if (view === "day") nd.setDate(nd.getDate() - 1);
      else if (view === "week") nd.setDate(nd.getDate() - 7);
      else if (view === "month") nd.setMonth(nd.getMonth() - 1);
      return nd;
    });
  };

  const goNext = () => {
    setSelectedDate((prev) => {
      const nd = new Date(prev);
      if (view === "day") nd.setDate(nd.getDate() + 1);
      else if (view === "week") nd.setDate(nd.getDate() + 7);
      else if (view === "month") nd.setMonth(nd.getMonth() + 1);
      return nd;
    });
  };

  const handleNewAppointment = () => {
    let start = new Date(selectedDate);
    start.setHours(9, 0, 0, 0);
    const now = new Date();
    if (selectedDate.toDateString() === now.toDateString() && start < now) {
      start = new Date(Math.ceil(now.getTime() / (30 * 60000)) * 30 * 60000);
    }
    const end = new Date(start.getTime() + 30 * 60000);
    openModal({ start, end, fromView: view === "month" ? "month" : "day" });
  };

  const formatDate = (date) => {
    if (!date) return "";
    if (view === "day")
      return date.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    if (view === "week") {
      const start = startOfWeek(date)[0];
      const end = startOfWeek(date)[6];
      return `${start.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })} - ${end.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })}`;
    }
    if (view === "month")
      return date.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
    return "";
  };

  return (
    <div className="calendar-page">
      <Header
        view={view}
        setView={setView}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        formatDate={formatDate}
        onPrev={goPrev}
        onNext={goNext}
        onNewAppointment={handleNewAppointment}
        disableNavigation={modalOpen}
        onToggleSidebar={toggleSidebar}
      />

      <div className="main-content">
        {/* Desktop Sidebar */}
        <div className="sidebar-container desktop-only">
          <Sidebar
            view={view}
            selectedDate={selectedDate}
            appointments={appointments}
            openModal={openModal}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="sidebar-overlay mobile-only" onClick={() => setSidebarOpen(false)}>
            <Sidebar
              view={view}
              selectedDate={selectedDate}
              appointments={appointments}
              openModal={openModal}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        )}

        <CalendarPanel
          view={view}
          selectedDate={selectedDate}
          appointments={appointments}
          openModal={openModal}
          setView={setView}
          setSelectedDate={setSelectedDate}
        />

        <AppointmentModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          context={modalContext}
          onSave={handleSaveAppointment}
          onUpdate={handleUpdateAppointment}
          onDelete={handleDeleteAppointment}
        />
      </div>
    </div>
  );
};

export default CalendarPage;
