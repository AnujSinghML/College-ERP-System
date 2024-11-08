// ExamTable.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './examTable.module.css';

const ExamTable = () => {

  const exams = [
    { exam_id: '002', course_id: '201', exam_date: '2024-11-10', start_time: '09:00', end_time: '12:00' },
    { exam_id: '003', course_id: '202', exam_date: '2024-11-12', start_time: '14:00', end_time: '17:00' },
    { exam_id: '004', course_id: '203', exam_date: '2024-11-14', start_time: '08:30', end_time: '11:30' },
    { exam_id: '005', course_id: '204', exam_date: '2024-11-16', start_time: '13:00', end_time: '16:00' },
    { exam_id: '006', course_id: '205', exam_date: '2024-11-18', start_time: '15:30', end_time: '18:30' },
    { exam_id: '007', course_id: '204', exam_date: '2024-11-20', start_time: '10:00', end_time: '13:00' },
  ];

  useEffect(() => {
    axios.get('http://localhost:3001/exam/table') // Update this to your actual endpoint
      .then(response => setExams(response.data))
      .catch(error => console.error("There was an error fetching exam data:", error));
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Exam Details</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Exam ID</th>
            <th>Course ID</th>
            <th>Exam Date</th>
            <th>Start Time</th>
            <th>End Time</th>
          </tr>
        </thead>
        <tbody>
          {exams.map((exam, index) => (
            <tr key={index}>
              <td>{exam.exam_id}</td>
              <td>{exam.course_id}</td>
              <td>{exam.exam_date}</td>
              <td>{exam.start_time}</td>
              <td>{exam.end_time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExamTable;
