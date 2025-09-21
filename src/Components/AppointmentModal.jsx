import React, { useEffect, useState } from "react";
import "../styles/Modal.sass";

export default function AppointmentModal({ open, onClose, context, onSave, onUpdate, onDelete, users }) {
  const appt = context?.appointment || {};
  const isEdit = Boolean(appt?.id);

  const [title, setTitle] = useState(appt.title || "");
  const [description, setDescription] = useState(appt.description || "");
  const [selectedGuests, setSelectedGuests] = useState(appt.participantIds || []);

  const [guestInput, setGuestInput] = useState("");

  const [startDate, setStartDate] = useState(appt.start ? new Date(appt.start).toISOString().slice(0,10) : "");
  const [startHour, setStartHour] = useState(appt.start ? new Date(appt.start).getHours() % 12 || 12 : "9");
  const [startMinute, setStartMinute] = useState(appt.start ? new Date(appt.start).getMinutes() : "00");
  const [startAmPm, setStartAmPm] = useState(appt.start ? (new Date(appt.start).getHours() >= 12 ? "PM" : "AM") : "AM");

  const [endDate, setEndDate] = useState(appt.end ? new Date(appt.end).toISOString().slice(0,10) : "");
  const [endHour, setEndHour] = useState(appt.end ? new Date(appt.end).getHours() % 12 || 12 : "10");
  const [endMinute, setEndMinute] = useState(appt.end ? new Date(appt.end).getMinutes() : "00");
  const [endAmPm, setEndAmPm] = useState(appt.end ? (new Date(appt.end).getHours() >= 12 ? "PM" : "AM") : "AM");

  const [recurrence, setRecurrence] = useState(appt.recurrence?.type || "none");
  const [count, setCount] = useState(appt.recurrence?.count || 0);
  const [recEndDate, setRecEndDate] = useState(appt.recurrence?.endDate || "");
  const [recurrenceDays, setRecurrenceDays] = useState(appt.recurrence?.days || []);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    if (!open) return;
    if (isEdit) {
      setTitle(appt.title || "");
      setDescription(appt.description || "");
      setSelectedGuests(appt.guests || []);
      setGuestInput("");

      const s = appt.start ? new Date(appt.start) : new Date();
      setStartDate(s.toISOString().slice(0,10));
      setStartHour(s.getHours() % 12 || 12);
      setStartMinute(s.getMinutes());
      setStartAmPm(s.getHours() >= 12 ? "PM" : "AM");

      const e = appt.end ? new Date(appt.end) : new Date(s.getTime()+30*60000);
      setEndDate(e.toISOString().slice(0,10));
      setEndHour(e.getHours() % 12 || 12);
      setEndMinute(e.getMinutes());
      setEndAmPm(e.getHours() >= 12 ? "PM" : "AM");

      if(appt.recurrence){
        setRecurrence(appt.recurrence.type || "none");
        setCount(appt.recurrence.count || 0);
        setRecEndDate(appt.recurrence.endDate || "");
        setRecurrenceDays(appt.recurrence.days || []);
      } else {
        setRecurrence("none");
        setCount(0);
        setRecEndDate("");
        setRecurrenceDays([]);
      }
    } else if(context?.start){
      const s = new Date(context.start);
      const e = new Date(context.end);

      setStartDate(s.toISOString().slice(0,10));
      setStartHour(s.getHours() % 12 || 12);
      setStartMinute(s.getMinutes());
      setStartAmPm(s.getHours() >= 12 ? "PM" : "AM");

      setEndDate(e.toISOString().slice(0,10));
      setEndHour(e.getHours() % 12 || 12);
      setEndMinute(e.getMinutes());
      setEndAmPm(e.getHours() >= 12 ? "PM" : "AM");

      setTitle("");
      setDescription("");
      setSelectedGuests([]);
      setGuestInput("");
      setRecurrence("none");
      setCount(0);
      setRecEndDate("");
      setRecurrenceDays([]);
    }
  }, [open]);

  const toggleDay = day => {
    setRecurrenceDays(prev=>{
      if(prev.includes(day)) return prev.filter(d=>d!==day);
      return [...prev, day];
    });
  }

  const convertTo24Hour = (hour, ampm) => ampm === "PM" ? (Number(hour)%12)+12 : Number(hour)%12;
  const assembleDateTime = (date, hour, minute, ampm) => {
    const dt = new Date(date);
    dt.setHours(convertTo24Hour(hour, ampm), Number(minute), 0, 0);
    return dt;
  }

  const validateTimes = (start,end) => {
    const now = new Date();
    if(start<now){ alert("Start time must be in the future"); return false;}
    if(start>=end){ alert("End must be after start"); return false;}
    if(recurrence==="weekly" && recurrenceDays.length===0){ alert("Select at least one day for weekly recurrence"); return false;}
    return true;
  }

  // 🔹 Handle guest selection using IDs
  const handleGuestSelect = (userId) => {
    if(!selectedGuests.includes(userId)){
      setSelectedGuests([...selectedGuests,userId]);
    }
  };

  const handleGuestRemove = (userId) => {
    setSelectedGuests(selectedGuests.filter(id=>id!==userId));
  };

  const handleSave=()=>{
    if(!title) return alert("Enter title");
    const start = assembleDateTime(startDate,startHour,startMinute,startAmPm);
    const end = assembleDateTime(endDate,endHour,endMinute,endAmPm);
    if(!validateTimes(start,end)) return;

    onSave({
      title,
      description,
      participantIds: selectedGuests, // ✅ send IDs
      start:start.toISOString(),
      end:end.toISOString(),
      recurrence: recurrence==="none"?null:{
        type: recurrence,
        count: Number(count),
        endDate: recEndDate ? new Date(recEndDate).toISOString():null,
        days: recurrenceDays
      }
    });
  }

  const handleUpdate=()=>{
    if(!isEdit) return;
    const start = assembleDateTime(startDate,startHour,startMinute,startAmPm);
    const end = assembleDateTime(endDate,endHour,endMinute,endAmPm);
    if(!validateTimes(start,end)) return;

    onUpdate({
      id:appt.id,
      title, description, guests:selectedGuests,
      start:start.toISOString(), end:end.toISOString(),
      recurrence: recurrence==="none"?null:{
        type: recurrence,
        count: Number(count),
        endDate: recEndDate ? new Date(recEndDate).toISOString():null,
        days: recurrenceDays
      }
    });
  }

  const handleDelete=()=>{
    if(window.confirm("Delete appointment?")){
      onDelete(appt.id);
    }
  }

  if(!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={e=>e.stopPropagation()}>
        <h3>{isEdit?"Edit Appointment":"New Appointment"}</h3>

        {/* Title & Description stay same */}
        <div className="input-group">
          <label>Title</label>
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Enter title" maxLength={50}/>
        </div>
        <div className="input-group">
          <label>Description</label>
          <textarea value={description} onChange={e=>setDescription(e.target.value)} rows={3} maxLength={250} placeholder="Add details"/>
          <div className="description-counter">{description.length}/250</div>
        </div>

        {/* Guests with IDs */}
        <div className="input-group">
          <label>Invite Attendees</label>
          <div className="guest-tags">
            {selectedGuests.map(id=>{
              const user = users?.find(u=>u.id===id);
              return (
                <span key={id} className="guest-tag">
                  {user?.name || id}
                  <button onClick={()=>handleGuestRemove(id)}>×</button>
                </span>
              );
            })}
            <input value={guestInput} onChange={e=>setGuestInput(e.target.value)} placeholder="Type name & select from below" />
          </div>
          <div className="guest-dropdown">
            {users
              ?.filter(u=>!selectedGuests.includes(u.id) && u.name.toLowerCase().includes(guestInput.toLowerCase()))
              .slice(0,4)
              .map(u=><div key={u.id} onClick={()=>{handleGuestSelect(u.id); setGuestInput("");}}>{u.name}</div>)}
          </div>
        </div>

        {/* Date & Time Groups */}
        <div className="datetime-group">
          <div>
            <label>Start Date</label>
            <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} />
          </div>
          <div>
            <label>Hour</label>
            <input type="number" min="1" max="12" value={startHour} onChange={e=>setStartHour(e.target.value)}/>
          </div>
          <div>
            <label>Minute</label>
            <input type="number" min="0" max="59" value={startMinute} onChange={e=>setStartMinute(e.target.value)}/>
          </div>
          <div>
            <label>AM/PM</label>
            <select value={startAmPm} onChange={e=>setStartAmPm(e.target.value)}><option>AM</option><option>PM</option></select>
          </div>
        </div>

        <div className="datetime-group">
          <div>
            <label>End Date</label>
            <input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} />
          </div>
          <div>
            <label>Hour</label>
            <input type="number" min="1" max="12" value={endHour} onChange={e=>setEndHour(e.target.value)}/>
          </div>
          <div>
            <label>Minute</label>
            <input type="number" min="0" max="59" value={endMinute} onChange={e=>setEndMinute(e.target.value)}/>
          </div>
          <div>
            <label>AM/PM</label>
            <select value={endAmPm} onChange={e=>setEndAmPm(e.target.value)}><option>AM</option><option>PM</option></select>
          </div>
        </div>

        {/* Recurrence */}
        <div className="input-group">
          <label>Repeat / Recurrence</label>
          <select value={recurrence} onChange={e=>setRecurrence(e.target.value)}>
            <option value="none">None</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        {(recurrence!=="none") && (
          <>
            <div className="input-group">
              <label>Repetitions</label>
              <input type="number" min="1" value={count} onChange={e=>setCount(e.target.value)} placeholder="0"/>
            </div>
            <div className="input-group">
              <label>End Date (optional)</label>
              <input type="date" value={recEndDate} onChange={e=>setRecEndDate(e.target.value)} />
            </div>
          </>
        )}

        {(recurrence==="weekly"||recurrence==="custom") && (
          <div className="day-selector">
            {days.map(d=>(
              <button key={d} type="button" className={recurrenceDays.includes(d)?"active":""} onClick={()=>toggleDay(d)}>{d}</button>
            ))}
          </div>
        )}

        <div className="modal-actions">
          {isEdit ? (
            <>
              <button className="btn-primary" onClick={handleUpdate}>Save</button>
              <button className="btn-danger" onClick={handleDelete}>Delete</button>
              <button className="btn-secondary" onClick={onClose}>Close</button>
            </>
          ) : (
            <>
              <button className="btn-secondary" onClick={onClose}>Close</button>
              <button className="btn-primary" onClick={handleSave}>Create</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
