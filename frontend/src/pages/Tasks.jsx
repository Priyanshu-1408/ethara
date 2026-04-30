import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchTasks = async () => {
      try {
        setLoading(true);
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('http://localhost:5000/api/tasks', config);
        setTasks(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tasks', err);
        setError('Failed to load tasks');
        setLoading(false);
      }
    };

    fetchTasks();
  }, [navigate, user?.token]);

  const updateStatus = async (id, status) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(`http://localhost:5000/api/tasks/${id}/status`, { status }, config);
      setTasks(tasks.map(task => task._id === id ? data : task));
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating status');
    }
  };

  return (
    <div>
      <nav className="navbar">
        <h2>All Tasks</h2>
        <ul>
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/projects">Projects</a></li>
          <li>Welcome, {user?.name} ({user?.role})</li>
          <li><button className="btn" onClick={() => { localStorage.removeItem('user'); navigate('/login'); }} style={{ padding: '5px 10px', width: 'auto' }}>Logout</button></li>
        </ul>
      </nav>

      {loading && <p>Loading tasks...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && tasks.length === 0 && (
        <div style={{ padding: '20px', background: 'white', borderRadius: '8px', textAlign: 'center', marginTop: '20px' }}>
          <h3>No tasks found</h3>
          <p style={{ color: '#666', marginTop: '10px' }}>You currently have no tasks assigned to you.</p>
        </div>
      )}

      {!loading && !error && tasks.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {tasks.map(task => (
            <div key={task._id} style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>Project: {task.projectId?.title || task.projectId}</p>
              <p style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>Assigned To: {task.assignedTo?.name || 'Unassigned'}</p>
              <p style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</p>
              
              <div style={{ marginTop: '15px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold' }}>Status:</span>
                <select 
                  value={task.status} 
                  onChange={(e) => updateStatus(task._id, e.target.value)}
                  style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Tasks;
