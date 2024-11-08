import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './InstructorTable.module.css'; // Import the CSS module

const InstructorTable = () => {
  const navigate = useNavigate();
  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/instructor/table') // Assuming this route returns the instructor data
      .then(response => {
        setInstructors(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the Instructors!', error);
      });
  }, []);

  return (
    <div className={styles.tableContainer}>
      <h1 className={styles.tableTitle}>Instructor Table</h1>
      <table className={styles.instructorTable}>
        <thead>
          <tr>
            <th>Instructor ID</th>
            <th>Name</th>
            <th>Contact</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {instructors.map((instructor, index) => (
            <tr key={index}>
              <td>{instructor.instructor_id}</td>
              <td>{instructor.Name}</td>
              <td>{instructor.Contact}</td>
              <td>{instructor.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.boxBtn}>
         <button className={styles.adminBtn} onClick={() => navigate('/student/table/add')}>Add Student</button>
        <button className={styles.adminBtn} onClick={() => navigate('/student/table/remove')}>Remove Student</button>
        <button className={styles.adminBtn} onClick={() => navigate('/courses/add')}>Add Courses</button>
        <button className={styles.adminBtn} onClick={() => navigate('/courses/remove')}>Remove Courses</button>
        <button className={styles.adminBtn} onClick={() => navigate('/instructor/schedule')}>Schedule Exam</button>
      </div>
    </div>
  );
}

export default InstructorTable;
