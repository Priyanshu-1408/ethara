import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/login', formData);
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        navigate('/dashboard');
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Error logging in');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login to Task Manager</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" className="form-control" name="email" value={email} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-control" name="password" value={password} onChange={onChange} required />
          </div>
          <button type="submit" className="btn">Login</button>
        </form>
        <p style={{ marginTop: '15px', textAlign: 'center' }}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
