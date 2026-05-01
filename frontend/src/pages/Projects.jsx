import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchProjects = async () => {
      try {
        setLoading(true);
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('/api/projects', config);
        console.log('Projects API Response:', data);
        setProjects(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching projects', err);
        setError('Failed to load projects');
        setLoading(false);
      }
    };

    fetchProjects();
  }, [navigate, user?.token]);

  const createProject = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post('/api/projects', { title: newTitle, description: newDesc }, config);
      setProjects([...projects, data]);
      setNewTitle('');
      setNewDesc('');
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating project');
    }
  };

  return (
    <div>
      <nav className="navbar">
        <h2>Projects</h2>
        <ul>
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/tasks">Tasks</a></li>
          <li>Welcome, {user?.name} ({user?.role})</li>
          <li><button className="btn" onClick={() => { localStorage.removeItem('user'); navigate('/login'); }} style={{ padding: '5px 10px', width: 'auto' }}>Logout</button></li>
        </ul>
      </nav>

      {user?.role === 'Admin' && (
        <div style={{ marginBottom: '30px', padding: '20px', background: 'white', borderRadius: '8px' }}>
          <h3>Create New Project</h3>
          <form onSubmit={createProject} style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <input type="text" className="form-control" placeholder="Project Title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required />
            <input type="text" className="form-control" placeholder="Description" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
            <button type="submit" className="btn" style={{ width: '150px' }}>Add Project</button>
          </form>
        </div>
      )}

      {loading && <p>Loading projects...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && projects.length === 0 && (
        <p>No projects found</p>
      )}

      {!loading && !error && projects.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {projects.map(project => (
            <div key={project._id} style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Projects;
