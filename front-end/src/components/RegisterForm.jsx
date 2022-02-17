import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const registerObject = {
      username: username,
      password: password,
    }

    try {
      await axios.post('http://127.0.0.1:5000/register', registerObject, {headers: {"Content-Type": "application/json"}});

      setError('');
      navigate("/login");
    } catch (err) {
      setError('Oops, Error.');
    }
  };

  return (
    <div className="wrapper">
      <div className="form">
        <h1 className="title">Rejestracja</h1>
        <form onSubmit={handleSubmit}>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="input" placeholder="Username" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" placeholder="Password" required />
          <div align="center">
            <button type="submit" className="button">
              <span>Register</span>
            </button>
          </div>
        </form>
        <h1>{error}</h1>
      </div>
    </div>

  );
};

export default RegisterForm;