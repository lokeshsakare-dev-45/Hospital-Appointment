export default function AdminSettings() {
  return (
    <div>
      <h1 className="mb-4">Admin Settings</h1>
      <div className="card mb-4">
        <h3>System Preferences</h3>
        <p className="text-muted mt-2">Manage global hospital settings, business hours, and notification rules.</p>
        
        <div className="mt-4">
          <div className="input-group">
            <label>Hospital Name</label>
            <input type="text" defaultValue="MediCare Hospital" />
          </div>
          <button className="btn btn-primary mt-2">Save Changes</button>
        </div>
      </div>
    </div>
  );
}
