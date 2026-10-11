import { useState, useEffect } from 'react';
import { doctorService } from '../services/api';

const ALL_DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

const defaultSchedule = ALL_DAYS.map(day => ({
  dayOfWeek: day,
  available: false,
  startTime: '10:00',
  endTime: '17:00',
}));

export default function DoctorSchedule() {
  const doctorId = localStorage.getItem('userId');
  const [schedule, setSchedule] = useState(defaultSchedule);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadSchedule() {
      if (!doctorId) { setLoading(false); return; }
      try {
        const data = await doctorService.getSchedule(doctorId);
        const merged = ALL_DAYS.map(day => {
          const existing = data.find(s => s.dayOfWeek === day);
          if (existing) {
            return {
              dayOfWeek: day,
              available: true,
              startTime: (existing.startTime || '10:00').substring(0, 5),
              endTime: (existing.endTime || '17:00').substring(0, 5),
            };
          }
          return { dayOfWeek: day, available: false, startTime: '10:00', endTime: '17:00' };
        });
        setSchedule(merged);
      } catch (err) {
        console.error('Failed to load schedule:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSchedule();
  }, [doctorId]);

  const handleToggle = (idx, value) => {
    setSchedule(prev => prev.map((s, i) => i === idx ? { ...s, available: value === 'Available' } : s));
  };

  const handleTimeChange = (idx, field, value) => {
    setSchedule(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };

  const handleSave = async () => {
    if (!doctorId) { setMessage('Not logged in.'); return; }
    const activeDays = schedule
      .filter(s => s.available)
      .map(s => ({ dayOfWeek: s.dayOfWeek, startTime: s.startTime, endTime: s.endTime }));
    setSaving(true);
    setMessage('');
    try {
      await doctorService.saveSchedule(doctorId, activeDays);
      setMessage('Schedule saved successfully!');
    } catch (err) {
      setMessage(err.message || 'Failed to save schedule.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-muted">Loading schedule...</p>;

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 className="mb-4">My Availability</h1>

      {message && (
        <div style={{
          backgroundColor: message.includes('success') ? '#dcfce7' : '#fee2e2',
          color: message.includes('success') ? '#166534' : '#b91c1c',
          padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem'
        }}>
          {message}
        </div>
      )}

      <div className="card">
        {schedule.map((day, i) => (
          <div key={i} className="flex items-center gap-4 mb-4 pb-4" style={{ borderBottom: i < schedule.length - 1 ? '1px solid var(--border-color)' : 'none', flexWrap: 'wrap' }}>
            <div style={{ width: '120px', fontWeight: '500' }}>{day.dayOfWeek.charAt(0) + day.dayOfWeek.slice(1).toLowerCase()}</div>

            <div className="input-group" style={{ marginBottom: 0, width: '160px' }}>
              <select value={day.available ? 'Available' : 'Not Available'} onChange={(e) => handleToggle(i, e.target.value)}>
                <option>Available</option>
                <option>Not Available</option>
              </select>
            </div>

            {day.available && (
              <div className="flex items-center gap-2 flex-1" style={{ minWidth: '250px' }}>
                <input
                  type="time"
                  value={day.startTime}
                  onChange={(e) => handleTimeChange(i, 'startTime', e.target.value)}
                  style={{ marginBottom: 0, padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '6px' }}
                />
                <span className="text-muted">to</span>
                <input
                  type="time"
                  value={day.endTime}
                  onChange={(e) => handleTimeChange(i, 'endTime', e.target.value)}
                  style={{ marginBottom: 0, padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '6px' }}
                />
              </div>
            )}
          </div>
        ))}

        <div className="mt-4 text-right">
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Schedule'}
          </button>
        </div>
      </div>
    </div>
  );
}
