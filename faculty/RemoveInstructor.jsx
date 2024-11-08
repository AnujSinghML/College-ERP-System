import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import styles from './RemoveInstructor.module.css'

const RemoveInstructor = () => {
  const navigate = useNavigate();
  const [deleteInstructor, setDeleteInstructor] = useState({
    id :'',
  })

  const handleInputChange = ((e) => {
    setDeleteInstructor({...deleteInstructor, [e.target.name]: e.target.value})
  })

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log(deleteInstructor);
    axios.post('http://localhost:3000/instructor/table/delete', deleteInstructor)    
  };
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Remove Instructor</h1>
      <form className={styles.form} onSubmit={handleFormSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Instructor ID:
            <input
              type="text"
              name="id"
              value={deleteInstructor.id}
              onChange={handleInputChange}
              required
              className={styles.inputField}
            />
          </label>
        </div>
        
        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.deleteButton}>Delete</button>
          <button type="button" className={styles.cancelButton} onClick={() => navigate('/admin/options')}>Cancel</button>
        </div>
      </form>
    </div>
  )
}

export default RemoveInstructor
