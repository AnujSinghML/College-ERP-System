import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './scheduleExam.module.css';

const AddExam = () => {
  const navigate = useNavigate();


  
  const [newExam, setNewExam] = useState({
    exam_id: '',
    course_id: '',
    exam_date: '',
    start_time: '',
    end_time: '',
  });

  const handleInputChange = (e) => {
    setNewExam({ ...newExam, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/exam/table', newExam)
      .then(response => {
        console.log('exam added:', response.data);
        navigate('/instructor/exam/table'); // Navigate to the table after successful addition
      })
      .catch(error => {
        console.error('There was an error adding the exam!', error);
      });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Please Enter the Exam Details</h1>
      <form className={styles.form} onSubmit={handleFormSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Exam ID:
            <input
              type="text"
              name="exam_id"
              value={newExam.exam_id}
              onChange={handleInputChange}
              required
              className={styles.inputField}
            />
          </label>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Course ID:
            <input
              type="text"
              name="course_id"
              value={newExam.course_id}
              onChange={handleInputChange}
              required
              className={styles.inputField}
            />
          </label>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Exam Date:
            <input
              type="date"
              name="exam_date"
              value={newExam.exam_date}
              onChange={handleInputChange}
              required
              className={styles.inputField}
            />
          </label>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Start Time:
            <input
              type="time"
              name="start_time"
              value={newExam.start_time}
              onChange={handleInputChange}
              required
              className={styles.inputField}
            />
          </label>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            End Time:
            <input
              type="time"
              name="end_time"
              value={newExam.end_time}
              onChange={handleInputChange}
              required
              className={styles.inputField}
            />
          </label>
        </div>

        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.addButton} onClick={() => navigate('/instructor/exam/table')}>Add Exam</button>
          <button type="button" className={styles.cancelButton} onClick={() => navigate('/admin/options')}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddExam;
