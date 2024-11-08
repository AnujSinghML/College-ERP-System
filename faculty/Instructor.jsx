import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Instructor.module.css'; // Import CSS Module

const Instructor = () => {
  const navigate = useNavigate();

  // Set fixed credentials for validation
  const fixedCredentials = {
    name: 'Instructor',
    email: 'instructor@iiitn.in',
    password: 'password123',
    id: '123'
  };

  const [formdata, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    id: ''
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formdata,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation logic
    if (
      formdata.name === fixedCredentials.name &&
      formdata.email === fixedCredentials.email &&
      formdata.password === fixedCredentials.password &&
      formdata.id === fixedCredentials.id
    ) {
      navigate('/instructor/table'); // Successful login
    } else {
      setErrorMessage('Invalid login details. Please try again.');
    }
  };

  return (
    <div>
      <div className={styles.top}>
        <header className={styles.titlePortal}>Instructor Portal</header>
        <button className={styles.btn} onClick={() => navigate('/')}>Go Back to Home</button>
      </div>
      
      <div className={styles.loginContainer}>
        <h2 className={styles.formTitle}>Instructor Login</h2>
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
          <div className={styles.formGroup}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formdata.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formdata.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="id">Instructor ID</label>
            <input
              type="text"
              id="id"
              name="id"
              value={formdata.id}
              onChange={handleChange}
              required
            />
          </div>
        
          <button type="submit" className={styles.loginBtn}>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Instructor;
