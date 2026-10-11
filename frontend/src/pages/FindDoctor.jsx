import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doctorService, departmentService } from '../services/api';

export default function FindDoctor() {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepartments();
    fetchDoctors();
  }, []);

  const fetchDepartments = async () => {
    try {
      const data = await departmentService.getDepartments();
      setDepartments(data);
    } catch (err) {
      console.error('Error fetching departments:', err);
    }
  };

  const fetchDoctors = async (deptId = '', searchTerm = '') => {
    setLoading(true);
    try {
      const params = {};
      if (deptId) params.departmentId = deptId;
      if (searchTerm) params.search = searchTerm;
      const data = await doctorService.getDoctors(params);
      setDoctors(data);
    } catch (err) {
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDoctors(selectedDept, search);
  };

  const formatDays = (schedules) => {
    if (!schedules || schedules.length === 0) return 'Mon - Fri';
    return schedules.map(s => s.dayOfWeek).join(', ');
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h1 className="mb-1">Find a Doctor</h1>
      <p className="text-muted mb-4">Search and filter doctors to book an appointment.</p>

      <div className="card mb-4">
        <form onSubmit={handleSearch} className="grid-4" style={{ alignItems: 'end' }}>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label>Search</label>
            <input
              type="text"
              placeholder="Doctor name or specialty"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label>Department</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label>Availability</label>
            <select>
              <option>Any Day</option>
              <option>Today</option>
              <option>Tomorrow</option>
            </select>
          </div>
          <div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Search</button>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <p className="text-muted">Loading doctors...</p>
        </div>
      ) : doctors.length === 0 ? (
        <div className="card text-center py-5">
          <p className="text-muted">No doctors found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid-3">
          {doctors.map((doc) => (
            <div key={doc.id} className="card text-center">
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>👨‍⚕️</div>
              <h3 className="mb-1">{doc.name}</h3>
              <p style={{ fontWeight: '500', color: 'var(--primary-color)' }}>{doc.department?.name || 'General'}</p>
              <p className="text-muted mb-2">{doc.specialization}</p>

              <div style={{ borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '1rem 0', margin: '1rem 0' }}>
                <p><strong>{doc.experienceYears || 5} Years</strong> Experience</p>
                <p className="mt-1 text-muted" style={{ fontSize: '0.875rem' }}>Available: {formatDays(doc.schedules)}</p>
              </div>

              <Link to={`/doctor-profile?id=${doc.id}`} className="btn btn-secondary" style={{ width: '100%' }}>View Profile</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
