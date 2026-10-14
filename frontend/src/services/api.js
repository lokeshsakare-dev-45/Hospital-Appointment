const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const token = localStorage.getItem('authToken');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  let response;
  try {
    response = await fetch(url, config);
  } catch (err) {
    throw new Error('Unable to connect to MediCare server. Please check your backend connection.');
  }

  let data;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMsg = (data && data.message) || (typeof data === 'string' && data) || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

export const authService = {
  async loginPatient(identifier, password) {
    const data = await request('/api/auth/patient/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    });
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', 'patient');
    localStorage.setItem('userId', data.id);
    localStorage.setItem('userName', data.name);
    localStorage.setItem('userEmail', data.email);
    if (data.token) localStorage.setItem('authToken', data.token);
    return data;
  },

  async registerPatient(patientData) {
    return await request('/api/auth/patient/register', {
      method: 'POST',
      body: JSON.stringify(patientData),
    });
  },

  async loginDoctor(identifier, password) {
    const data = await request('/api/auth/doctor/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    });
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', 'doctor');
    localStorage.setItem('userId', data.id);
    localStorage.setItem('userName', data.name);
    localStorage.setItem('userEmail', data.email);
    if (data.token) localStorage.setItem('authToken', data.token);
    return data;
  },

  async registerDoctor(doctorData) {
    return await request('/api/auth/doctor/register', {
      method: 'POST',
      body: JSON.stringify(doctorData),
    });
  },

  async loginAdmin(identifier, password) {
    const data = await request('/api/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    });
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', 'admin');
    localStorage.setItem('userId', data.id);
    localStorage.setItem('userName', data.name);
    localStorage.setItem('userEmail', data.email);
    if (data.token) localStorage.setItem('authToken', data.token);
    return data;
  },

  logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('authToken');
  },

  getCurrentUser() {
    return {
      isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
      role: localStorage.getItem('userRole'),
      id: localStorage.getItem('userId'),
      name: localStorage.getItem('userName'),
      email: localStorage.getItem('userEmail'),
    };
  },
};

export const doctorService = {
  getDoctors(params = {}) {
    const query = new URLSearchParams();
    if (params.departmentId) query.append('departmentId', params.departmentId);
    if (params.search) query.append('search', params.search);
    const queryString = query.toString();
    return request(`/api/doctors${queryString ? `?${queryString}` : ''}`);
  },

  getDoctor(id) {
    return request(`/api/doctors/${id}`);
  },

  getAppointments(doctorId) {
    return request(`/api/doctors/${doctorId}/appointments`);
  },

  getRequests(doctorId) {
    return request(`/api/doctors/${doctorId}/requests`);
  },

  getPatients(doctorId) {
    return request(`/api/doctors/${doctorId}/patients`);
  },

  getSchedule(doctorId) {
    return request(`/api/doctors/${doctorId}/schedule`);
  },

  saveSchedule(doctorId, schedules) {
    return request(`/api/doctors/${doctorId}/schedule`, {
      method: 'POST',
      body: JSON.stringify(schedules),
    });
  },

  getStats(doctorId) {
    return request(`/api/doctors/${doctorId}/stats`);
  },
};

export const patientService = {
  getProfile(id) {
    return request(`/api/patients/${id}`);
  },

  getAppointments(patientId) {
    return request(`/api/patients/${patientId}/appointments`);
  },

  getStats(patientId) {
    return request(`/api/patients/${patientId}/stats`);
  },
};

export const appointmentService = {
  bookAppointment(data) {
    return request('/api/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateStatus(id, status) {
    return request(`/api/appointments/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  cancelAppointment(id) {
    return request(`/api/appointments/${id}`, {
      method: 'DELETE',
    });
  },

  getAllAppointments() {
    return request('/api/appointments');
  },
};

export const departmentService = {
  getDepartments() {
    return request('/api/departments');
  },

  createDepartment(data) {
    return request('/api/departments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  deleteDepartment(id) {
    return request(`/api/departments/${id}`, {
      method: 'DELETE',
    });
  },
};

export const adminService = {
  getStats() {
    return request('/api/admin/stats');
  },

  // alias used in some pages
  getDoctors() {
    return request('/api/admin/doctors');
  },

  getAllDoctors() {
    return request('/api/admin/doctors');
  },

  getPendingDoctors() {
    return request('/api/admin/doctors').then(doctors =>
      doctors.filter(d => d.status === 'PENDING')
    );
  },

  updateDoctorStatus(id, status) {
    return request(`/api/admin/doctors/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  approveDoctor(id) {
    return request(`/api/admin/doctors/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'APPROVED' }),
    });
  },

  rejectDoctor(id) {
    return request(`/api/admin/doctors/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'REJECTED' }),
    });
  },

  getPatients() {
    return request('/api/admin/patients');
  },

  getAllPatients() {
    return request('/api/admin/patients');
  },

  getAppointments() {
    return request('/api/admin/appointments');
  },

  getAllAppointments(status) {
    return request('/api/admin/appointments').then(appointments => {
      if (!status || status === '') return appointments;
      return appointments.filter(a => a.status === status);
    });
  },

  getRecentAppointments() {
    return request('/api/admin/appointments').then(appointments =>
      appointments.slice(0, 5)
    );
  },
};

export default {
  auth: authService,
  doctor: doctorService,
  patient: patientService,
  appointment: appointmentService,
  department: departmentService,
  admin: adminService,
};
