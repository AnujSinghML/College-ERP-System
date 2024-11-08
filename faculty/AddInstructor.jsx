import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './AddInstructor.module.css'; // Assuming you're using a CSS module

const AddInstructor = () => {
  const navigate = useNavigate();

  const [newInstructor, setNewInstructor] = useState({
    id: '',
    name: '',
    ishead: '',
    dept_id: '',
    gender: '',
    email: '',
    phone: '',
  });

  const handleInputChange = (e) => {
    setNewInstructor({ ...newInstructor, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3000/instructor/table', newInstructor);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Please Enter the Instructor Details</h1>
      <form className={styles.form} onSubmit={handleFormSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Instructor ID:
            <input
              type="text"
              name="id"
              value={newInstructor.id}
              onChange={handleInputChange}
              required
              className={styles.inputField}
            />
          </label>
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Instructor Name:
            <input
              type="text"
              name="name"
              value={newInstructor.name}
              onChange={handleInputChange}
              required
              className={styles.inputField}
            />
          </label>
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Is Head:
            <input
              type="text"
              name="ishead"
              value={newInstructor.ishead}
              onChange={handleInputChange}
              required
              className={styles.inputField}
            />
          </label>
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Department ID:
            <input
              type="text"
              name="dept_id"
              value={newInstructor.dept_id}
              onChange={handleInputChange}
              required
              className={styles.inputField}
            />
          </label>
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Gender:
            <input
              type="text"
              name="gender"
              value={newInstructor.gender}
              onChange={handleInputChange}
              required
              className={styles.inputField}
            />
          </label>
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Email:
            <input
              type="email"
              name="email"
              value={newInstructor.email}
              onChange={handleInputChange}
              required
              className={styles.inputField}
            />
          </label>
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Phone Number:
            <input
              type="text"
              name="phone"
              value={newInstructor.phone}
              onChange={handleInputChange}
              required
              className={styles.inputField}
            />
          </label>
        </div>
        
        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.addButton}>Add</button>
          <button type="button" className={styles.cancelButton} onClick={() => navigate('/admin/options')}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddInstructor;
