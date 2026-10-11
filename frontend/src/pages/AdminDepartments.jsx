import { useState, useEffect } from 'react';
import { departmentService } from '../services/api';

export default function AdminDepartments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDepartments = async () => {
    try {
      const data = await departmentService.getDepartments();
      setDepartments(data);
    } catch (err) {
      console.error('Failed to load departments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const handleAddDepartment = async () => {
    const name = window.prompt('Enter new department name:');
    if (!name || !name.trim()) return;
    const description = window.prompt('Enter description (optional):') || '';
    try {
      await departmentService.createDepartment({ name: name.trim(), description });
      await loadDepartments();
    } catch (err) {
      alert(err.message || 'Failed to create department');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;
    try {
      await departmentService.deleteDepartment(id);
      await loadDepartments();
    } catch (err) {
      alert(err.message || 'Failed to delete department');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1>Departments</h1>
        <button onClick={handleAddDepartment} className="btn btn-primary">Add Department</button>
      </div>

      {loading ? (
        <p className="text-muted">Loading departments...</p>
      ) : departments.length === 0 ? (
        <div className="card text-center py-5">
          <p className="text-muted">No departments created yet.</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Department Name</th>
                <th>Description</th>
                <th style={{ width: '200px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept) => (
                <tr key={dept.id}>
                  <td style={{ fontWeight: '500' }}>{dept.name}</td>
                  <td className="text-muted">{dept.description || 'Specialized Medical Department'}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="flex gap-2" style={{ justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleDelete(dept.id)}
                        className="btn btn-danger"
                        style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
