import React from "react";
import "../styles/Header.sass";
import { FiMenu } from "react-icons/fi";

const Header = ({
  view,
  setView,
  selectedDate,
  setSelectedDate,
  formatDate,
  onPrev,
  onNext,
  onNewAppointment,
  disableNavigation,
  onToggleSidebar,
}) => {

  return (
    <div className="calendar-panel-header">

       {/* App Name */}
      <div className="app-name">SchedulePro</div>
      
      <div className="left-section">

        {/* Hamburger menu */}
        <button
          className="hamburger-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <FiMenu size={20} />
        </button>

        <button
          className="nav-btn"
          onClick={onPrev}
          disabled={disableNavigation}
        >
          ◀
        </button>
        <div className="date-display">{formatDate(selectedDate)}</div>
        <button
          className="nav-btn"
          onClick={onNext}
          disabled={disableNavigation}
        >
          ▶
        </button>
      </div>

      <div className="right-section">
        <select
          className="view-dropdown"
          value={view}
          onChange={(e) => setView(e.target.value)}
        >
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>
        <button
          className="new-appointment-btn"
          onClick={onNewAppointment}
          disabled={disableNavigation}
        >
          + New Appointment
        </button>
      </div>
    </div>
  );
};

export default Header;
