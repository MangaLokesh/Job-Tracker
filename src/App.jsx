
import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const [applications, setApplications] = useState(() => {
    try {
      const savedApplications = localStorage.getItem('jobApplications');
      return savedApplications ? JSON.parse(savedApplications) : [];
    } catch {
      return [];
    }
  });

  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('Applied');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    localStorage.setItem(
      'jobApplications',
      JSON.stringify(applications)
    );
  }, [applications]);

  function resetForm() {
    setCompany('');
    setRole('');
    setDate('');
    setStatus('Applied');
    setEditingId(null);
  }

  function handleSubmit(e) {
    e.preventDefault();

    const applicationData = {
      company: company.trim(),
      role: role.trim(),
      date,
      status,
    };

    if (editingId !== null) {
      setApplications((prev) =>
        prev.map((app) =>
          app.id === editingId
            ? { ...app, ...applicationData }
            : app
        )
      );
    } else {
      setApplications((prev) => [
        ...prev,
        {
          id: Date.now(),
          ...applicationData,
        },
      ]);
    }

    resetForm();
  }

  function handleEdit(app) {
    setCompany(app.company);
    setRole(app.role);
    setDate(app.date);
    setStatus(app.status);
    setEditingId(app.id);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleDelete(id) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this application?'
    );

    if (!confirmed) return;

    setApplications((prev) =>
      prev.filter((app) => app.id !== id)
    );

    if (editingId === id) {
      resetForm();
    }
  }

  const filteredApplications = applications.filter((app) => {
    const search = searchTerm.trim().toLowerCase();

    const matchesSearch =
      app.company.toLowerCase().includes(search) ||
      app.role.toLowerCase().includes(search);

    const matchesStatus =
      filterStatus === 'All' || app.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const appliedCount = applications.filter(
    (app) => app.status === 'Applied'
  ).length;

  const interviewCount = applications.filter(
    (app) => app.status === 'Interview'
  ).length;

  const offerCount = applications.filter(
    (app) => app.status === 'Offer'
  ).length;

  return (
    <div className="dashboard">
      <header className="header">
        <h1>JobTrack</h1>
        <p>Track your job applications in one place.</p>
      </header>

      <main>
        <h2>Dashboard</h2>

        <div className="stats">
          <div className="stat-card">
            <h3>Total Applications</h3>
            <p>{applications.length}</p>
          </div>

          <div className="stat-card">
            <h3>Applied</h3>
            <p>{appliedCount}</p>
          </div>

          <div className="stat-card">
            <h3>Interviews</h3>
            <p>{interviewCount}</p>
          </div>

          <div className="stat-card">
            <h3>Offers</h3>
            <p>{offerCount}</p>
          </div>
        </div>

        <section className="applications">
          <h2>
            {editingId !== null
              ? 'Edit Job Application'
              : 'Add Job Application'}
          </h2>

          <form className="application-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Company Name"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Job Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            />

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>

            <button type="submit">
              {editingId !== null
                ? 'Update Application'
                : 'Add Application'}
            </button>

            {editingId !== null && (
              <button
                type="button"
                onClick={resetForm}
                className="cancel-btn"
              >
                Cancel
              </button>
            )}
          </form>
        </section>

        <section className="applications">
          <h2>Recent Applications</h2>
          <div className="search-filter">

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {filteredApplications.length === 0 ? (
            <p>
              {applications.length === 0
                ? 'No applications yet. Add your first application above!'
                : 'No matching applications found.'}
            </p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Role</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredApplications.map((app) => (
                    <tr key={app.id}>
                      <td>{app.company}</td>
                      <td>{app.role}</td>
                      <td>{app.date}</td>
                      <td>
                        <span
                          className={`status-badge ${app.status.toLowerCase()}`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            type="button"
                            className="edit-btn"
                            onClick={() => handleEdit(app)}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="delete-btn"
                            onClick={() => handleDelete(app.id)}
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
        </section>
      </main>
    </div>
  );
}

export default App;
