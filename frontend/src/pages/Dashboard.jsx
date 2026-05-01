import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [summary, setSummary] = useState(null);
  const [projects, setProjects] = useState([]);
  const [systemUsers, setSystemUsers] = useState([]);
  
  // Create task state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskProjectId, setNewTaskProjectId] = useState('');
  const [newTaskAssignedTo, setNewTaskAssignedTo] = useState('');

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        
        // Fetch tasks
        const { data: tasksData } = await axios.get('/api/tasks', config);
        setTasks(tasksData);

        // Fetch summary
        const { data: summaryData } = await axios.get('/api/tasks/summary', config);
        setSummary(summaryData);

        // Fetch projects for dropdown
        const { data: projectsData } = await axios.get('/api/projects', config);
        setProjects(projectsData);

        // Fetch users for assign dropdown (Admin only)
        if (user.role === 'Admin') {
          const { data: usersData } = await axios.get('/api/auth/users', config);
          setSystemUsers(usersData);
        }
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, [navigate, user?.token]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  const createTask = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      const payload = { 
        title: newTaskTitle, 
        description: newTaskDesc,
        projectId: newTaskProjectId,
        assignedTo: newTaskAssignedTo || undefined
      };

      const { data } = await axios.post('/api/tasks', payload, config);
      
      setTasks([...tasks, data]);
      setNewTaskTitle('');
      setNewTaskDesc('');
      setNewTaskProjectId('');
      setNewTaskAssignedTo('');
      
      // Update summary manually for immediate feedback or re-fetch
      setSummary((prev) => ({
        ...prev,
        total: prev.total + 1,
        status: { ...prev.status, todo: prev.status.todo + 1 }
      }));
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating task');
    }
  };

  const deleteTask = async (id) => {
    if(user.role !== 'Admin') return alert("Only Admin can delete tasks");
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`/api/tasks/${id}`, config);
      setTasks(tasks.filter(task => task._id !== id));
      
      // We could re-fetch summary here for accuracy
      const { data: summaryData } = await axios.get('/api/tasks/summary', config);
      setSummary(summaryData);
    } catch (error) {
      alert('Error deleting task');
    }
  };

  return (
    <div>
      <nav className="navbar">
        <h2>Dashboard</h2>
        <ul>
          <li><a href="/projects">Projects</a></li>
          <li><a href="/tasks">Tasks</a></li>
          <li>Welcome, {user?.name} ({user?.role})</li>
          <li><button className="btn" onClick={handleLogout} style={{ padding: '5px 10px', width: 'auto' }}>Logout</button></li>
        </ul>
      </nav>

      {/* DASHBOARD SUMMARY CARDS */}
      {summary && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <div style={cardStyle}>
            <h4>Total Tasks</h4>
            <p style={numberStyle}>{summary.total}</p>
          </div>
          <div style={cardStyle}>
            <h4>Todo</h4>
            <p style={{...numberStyle, color: '#856404'}}>{summary.status.todo}</p>
          </div>
          <div style={cardStyle}>
            <h4>In Progress</h4>
            <p style={{...numberStyle, color: '#004085'}}>{summary.status.inProgress}</p>
          </div>
          <div style={cardStyle}>
            <h4>Done</h4>
            <p style={{...numberStyle, color: '#155724'}}>{summary.status.done}</p>
          </div>
          <div style={{...cardStyle, borderLeft: '4px solid red'}}>
            <h4 style={{ color: 'red' }}>Overdue</h4>
            <p style={{...numberStyle, color: 'red'}}>{summary.overdue}</p>
          </div>
        </div>
      )}

      {user?.role === 'Admin' && (
        <div style={{ marginBottom: '30px', padding: '20px', background: 'white', borderRadius: '8px' }}>
          <h3>Create New Task</h3>
          <form onSubmit={createTask} style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
            <input type="text" className="form-control" placeholder="Task Title" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} required style={{flex: 1}} />
            <select className="form-control" value={newTaskProjectId} onChange={(e) => setNewTaskProjectId(e.target.value)} required style={{flex: 1}}>
              <option value="" disabled>
                {projects.length === 0 ? "No projects found - Create one first" : "Select Project"}
              </option>
              {projects.map(proj => (
                <option key={proj._id} value={proj._id}>{proj.title}</option>
              ))}
            </select>
            <select className="form-control" value={newTaskAssignedTo} onChange={(e) => setNewTaskAssignedTo(e.target.value)} style={{flex: 1}}>
              <option value="">Assign To (Optional)</option>
              {systemUsers.map(u => (
                <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
              ))}
            </select>
            <input type="text" className="form-control" placeholder="Description" value={newTaskDesc} onChange={(e) => setNewTaskDesc(e.target.value)} style={{flex: 2}} />
            <button type="submit" className="btn" style={{ width: '150px' }} disabled={!newTaskProjectId}>Add Task</button>
          </form>
        </div>
      )}

      <div className="task-list">
        {tasks.map(task => (
          <div key={task._id} className="task-card">
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>Project: {task.projectId?.title || task.projectId}</p>
            <p style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>Assigned To: {task.assignedTo?.name || 'Unassigned'}</p>
            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className={`task-status status-${task.status.toLowerCase().replace(' ', '')}`}>{task.status}</span>
              {user.role === 'Admin' && <button onClick={() => deleteTask(task._id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Delete</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const cardStyle = {
  background: 'white',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  textAlign: 'center'
};

const numberStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  marginTop: '10px'
};

export default Dashboard;
