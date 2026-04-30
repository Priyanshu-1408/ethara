import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Member' });
  const navigate = useNavigate();

  const { name, email, password, role } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        navigate('/dashboard');
        window.location.reload();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Error registering');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register for Task Manager</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" className="form-control" name="name" value={name} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" className="form-control" name="email" value={email} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-control" name="password" value={password} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select className="form-control" name="role" value={role} onChange={onChange}>
              <option value="Member">Member</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="btn">Register</button>
        </form>
        <p style={{ marginTop: '15px', textAlign: 'center' }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
