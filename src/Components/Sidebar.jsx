import React from "react";
import "../styles/Sidebar.sass";

const Sidebar = ({ view, selectedDate, appointments, openModal, isOpen, onClose }) => {
  const now = new Date();

  const formatDateRange = () => {
    if (view === "day") {
      return selectedDate.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }
    if (view === "week") {
      const start = new Date(selectedDate);
      const end = new Date(selectedDate);
      start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
      end.setDate(start.getDate() + 6);
      return `${start.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })} - ${end.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}`;
    }
    if (view === "month") {
      return selectedDate.toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
      });
    }
    return "";
  };

  const getFilteredAppointments = () => {
    if (view === "day") {
      return appointments.filter(
        (a) =>
          new Date(a.start).toDateString() === selectedDate.toDateString() &&
          new Date(a.end) >= now
      );
    }
    if (view === "week") {
      const start = new Date(selectedDate);
      start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return appointments.filter(
        (a) => new Date(a.start) >= start && new Date(a.start) <= end && new Date(a.end) >= now
      );
    }
    if (view === "month") {
      const month = selectedDate.getMonth();
      const year = selectedDate.getFullYear();
      return appointments.filter((a) => {
        const d = new Date(a.start);
        return d.getMonth() === month && d.getFullYear() === year && new Date(a.end) >= now;
      });
    }
    return [];
  };

  const filtered = getFilteredAppointments();

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <h2>Upcoming Appointments</h2>
        <p className="date-range">{formatDateRange()}</p>
        <div className="appointments-list">
          {filtered.length === 0 ? (
            <p className="no-appointments">No upcoming appointments</p>
          ) : (
            filtered.map((a) => {
              const start = new Date(a.start);
              const end = new Date(a.end);
              const isPast = start < now;
              return (
                <div
                  key={a.id}
                  className={`appointment-item ${isPast ? "past" : "upcoming"}`}
                  onClick={() =>
                    openModal({
                      appointment: a,
                      fromView: "day",
                    })
                  }
                >
                  <div className="title">{a.title}</div>
                    <div className="time">
                      <div className="start">
                        {start.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })} -{" "}
                        {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}
                      </div>
                      <div className="end">
                        {end.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })} -{" "}
                        {end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}
                      </div>
                    </div>

                </div>

              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
