const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

app.use(express.json());

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'institue'
});

function connectToDatabase() {
  return new Promise((resolve, reject) => {
    conn.connect((err) => {
      if (err) {
        console.error('Error connecting to MySQL:', err);
        reject(err);
      } else {
        console.log('Connected to MySQL');
        resolve();
      }
    });
  });
}
app.post('/', (req, res) => {
  const { str } = req.body; // Destructure 'str' from the request body
  

  // Log the incoming request body
  console.log(`Received data: ${str}`);
  
  // Send a response back
  return res.status(200).json({ message: `Hello, ${str}!` });
});

app.get('/student/table',(req, res) => {
  db.query('select * from student', (err, data) => {
    if(err) console.log(err);
    return res.json(data)
  })
})

app.get('/instructor/table',(req, res) => {
  db.query('select * from instructor', (err, data) => {
    if(err) console.log(err);
    return res.json(data)
  })
})

app.get('/instructor/exam/table', (req, res) => {
  const sql = 'SELECT * FROM exam_schedule'; // Adjust the table name if it's different

  db.query(sql, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error retrieving exam data' });
    }
    res.status(200).json(data); // Respond with the retrieved exam data
  });
});


app.get('/department',(req, res) => {
  db.query('select * from department', (err, data) => {
    if(err) console.log(err);
    return res.json(data)
  })
})

app.get('/courses',(req, res) => {
  db.query('select * from courses', (err, data) => {
    if(err) console.log(err);
    return res.json(data)
  })
})

app.post('/student/table',(req, res) => {
  const {name,roll_no}= req.body;
  console.log(req.body);
  db.query('insert into student values(?,?)',[name,roll_no], (err, data) => {
    if(err) console.log(err);
    // return res.json(data)
    res.status(200).send({
      message: 'Student added successfully',
      student: { name, roll_no }
    });
  })
})

app.post('/student/table/delete',(req, res) => {
  const {roll_no} = req.body;
  console.log(req.body);
  db.query('DELETE FROM student WHERE roll_no = ?',[roll_no], (err,data)=>{
    if (err) {
      console.error('Error deleting the student:', err);
      res.status(500).send('Server error');
      return;
    }

    res.status(200).send({ success: true, message: 'Student deleted successfully' });
  });
})


app.post('/instructor/table',(req, res) => {
  const {id,name,ishead,dept_id,gender,email,phone} = req.body;
  db.query('insert into instructor values(?,?,?,?,?,?,?)',[id,name,ishead,dept_id,gender,email,phone], (err, data) => {
    if(err) console.log(err);
    // return res.json(data)
    res.status(200).send({
      message: 'instructor added successfully',
      student: {id, name, ishead, dept_id, gender, email, phone}
    });
  })

})

app.post('/instructor/table/delete',(req, res) => {
  const {id} = req.body;
  console.log(req.body);
  db.query('DELETE FROM instructor WHERE id = ?',[id], (err,data)=>{
    if (err) {
      console.error('Error deleting the instructor:', err);
      res.status(500).send('Server error');
      return;
    }
    res.status(200).send({ success: true, message: 'instructor deleted successfully' });
  });
})


app.post('/department',(req, res) => {
  const {id,name,head_id}= req.body;
  console.log(req.body);
  db.query('insert into department values(?,?,?)',[id,name,head_id], (err, data) => {
    if(err) console.log(err);
    // return res.json(data)
    res.status(200).send({
      message: 'Deparment added successfully',
      student: {id,name,head_id}
    });
  })
})

app.post('/department/delete',(req, res) => {
  const {id} = req.body;
  console.log(req.body);
  db.query('DELETE FROM department WHERE id = ?',[id], (err,data)=>{
    if (err) {
      console.error('Error deleting the department:', err);
      res.status(500).send('Server error');
      return;
    }
    res.status(200).send({ success: true, message: 'department deleted successfully' });
  });
})

app.post('/courses',(req, res) => {
  const {id,name,instructor_id,dept_id}= req.body;
  console.log(req.body);
  db.query('insert into courses values(?,?,?)',[id,course_name,credits], (err, data) => {
    if(err) console.log(err);
    // return res.json(data)
    res.status(200).send({
      message: 'course added successfully',
      student: {id,name,instructor_id,dept_id}
    });
  })
})

app.post('/courses/delete',(req, res) => {
  const {course_id} = req.body;
  console.log(req.body);
  db.query('DELETE FROM courses WHERE course_id = ?',[course_id], (err,data)=>{
    if (err) {
      console.error('Error deleting the course:', err);
      res.status(500).send('Server error');
      return;
    }
    res.status(200).send({ success: true, message: 'department deleted successfully' });
  });
})


app.post('/exam/table', (req, res) => {
  const { exam_id, course_id, exam_date, start_time, end_time } = req.body;
  const sql = 'INSERT INTO exams (exam_id, course_id, exam_date, start_time, end_time) VALUES (?, ?, ?, ?, ?)';

  db.query(sql, [exam_id, course_id, exam_date, start_time, end_time], (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error adding exam' });
    }
    res.status(200).json({ message: 'Exam added successfully', exam: { exam_id, course_id, exam_date, start_time, end_time } });
  });
});


// Login API-----------------------------------------------------------------------------------------------------------------
app.post('/login', (req, res) => {
  const { username, password, role } = req.body;
  
  if (!username || !password || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const query = `SELECT * FROM Users WHERE username = ? AND password = ? AND role = ?`;
  conn.query(query, [username, password, role], (err, results) => {
    if (err) {
      console.error('Error querying MySQL:', err);
      return res.status(500).json({ error: 'Database error occurred' });
    }

    if (results.length > 0) {
      const redirectUrls = {
        admin: 'http://localhost:5500/admin/admin.html',
        faculty: 'http://localhost:5173/instructor/table',
        student: 'http://localhost:5500/student/student.html',
        account_personal: 'http://localhost:5500/personal/personal.html',
      };
      res.json({ success: true, redirectUrl: redirectUrls[role] || 'http://localhost:5500//login/login.html' });
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  });
});

// Admin Profile Route-----------------------------------------------------------------------------------------------------------------------------
app.get('/api/admin/profile', (req, res) => {
  const query = `SELECT username, role FROM Users WHERE user_id = 5`; // Static for now , as not using json web tokens for verified login.
  conn.query(query, (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'An error occurred while fetching the profile' });
    }
    if (result.length === 0) {
      console.log("No user found");
      return res.status(404).json({ error: "User not found" });
    }
    res.json(result[0]);
  });
});

// Add/Update Department------------------------------------------------------------------------------------------------------ 
app.post('/api/admin/department', (req, res) => {
  const { dept_name, contact_no, location } = req.body;

  // Check for missing required fields
  if (!dept_name || !contact_no || !location) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Step 1: Check if the department already exists
  const checkQuery = 'SELECT Dept_Id FROM Department WHERE Dept_name = ?';
  conn.query(checkQuery, [dept_name], (checkErr, checkResult) => {
    if (checkErr) {
      console.error('Database error:', checkErr);
      return res.status(500).json({ error: 'An error occurred while checking for existing department' });
    }

    // If the department exists, update it
    if (checkResult.length > 0) {
      const updateQuery = `
        UPDATE Department 
        SET Contact_No = ?, Location = ?
        WHERE Dept_Id = ?`;
      
      conn.query(updateQuery, [contact_no, location, checkResult[0].Dept_Id], (updateErr, updateResult) => {
        if (updateErr) {
          console.error('Database error:', updateErr);
          return res.status(500).json({ error: 'An error occurred while updating the department' });
        }
        return res.json({ message: 'Department updated successfully', affectedRows: updateResult.affectedRows });
      });

    } else {
      // Step 2: Find the next available Dept_Id (to avoid gaps in ID sequence)
      const getNextIdQuery = `
        SELECT COALESCE(MIN(t1.Dept_Id + 1), 1) AS nextId
        FROM Department t1
        WHERE NOT EXISTS (SELECT 1 FROM Department t2 WHERE t2.Dept_Id = t1.Dept_Id + 1)
      `;

      conn.query(getNextIdQuery, (nextIdErr, nextIdResult) => {
        if (nextIdErr) {
          console.error('Database error:', nextIdErr);
          return res.status(500).json({ error: 'An error occurred while fetching the next Dept_Id' });
        }

        const nextDeptId = nextIdResult[0].nextId;

        // Step 3: Insert new department with the next available Dept_Id
        const insertQuery = `
          INSERT INTO Department (Dept_Id, Dept_name, Contact_No, Location)
          VALUES (?, ?, ?, ?)
        `;

        conn.query(insertQuery, [nextDeptId, dept_name, contact_no, location], (insertErr, insertResult) => {
          if (insertErr) {
            console.error('Database error:', insertErr);
            return res.status(500).json({ error: 'An error occurred while adding the department' });
          }
          return res.json({ 
            message: 'Department added successfully', 
            affectedRows: insertResult.affectedRows, 
            insertId: nextDeptId 
          });
        });
      });
    }
  });
});


app.delete('/api/admin/department', (req, res) => {
  const { dept_name } = req.body;

  if (!dept_name) {
    return res.status(400).json({ error: 'Department name is required' });
  }

  // Start a transaction to ensure atomicity
  conn.beginTransaction((err) => {
    if (err) {
      console.error('Transaction error:', err);
      return res.status(500).json({ error: 'Transaction error' });
    }

    // Pre-check for any other dependencies before deleting
    const checkWorksQuery = `
      SELECT COUNT(*) as count 
      FROM Works w
      JOIN Department d ON w.Dept_Id = d.Dept_Id
      WHERE d.Dept_name = ?`;

    conn.query(checkWorksQuery, [dept_name], (checkErr, checkResult) => {
      if (checkErr) {
        console.error('Database error during pre-check:', checkErr);
        return conn.rollback(() => {
          res.status(500).json({ error: 'An error occurred while checking department references' });
        });
      }

      // If department is referenced in the Works table, return error
      if (checkResult[0].count > 0) {
        return conn.rollback(() => {
          res.status(400).json({ error: 'Cannot delete department. It is referenced by instructors in the Works table.' });
        });
      }

      // Proceed with the deletion
      const deleteQuery = `DELETE FROM Department WHERE Dept_name = ?`;

      conn.query(deleteQuery, [dept_name], (deleteErr, deleteResult) => {
        if (deleteErr) {
          console.error('Database error during deletion:', deleteErr);
          return conn.rollback(() => {
            res.status(500).json({ error: 'An error occurred while deleting the department' });
          });
        }

        if (deleteResult.affectedRows === 0) {
          return conn.rollback(() => {
            res.status(404).json({ error: 'Department not found' });
          });
        }

        // Commit the transaction if everything goes well
        conn.commit((commitErr) => {
          if (commitErr) {
            console.error('Commit error:', commitErr);
            return conn.rollback(() => {
              res.status(500).json({ error: 'An error occurred while committing the transaction' });
            });
          }

          res.json({ message: 'Department deleted successfully', affectedRows: deleteResult.affectedRows });
        });
      });
    });
  });
});


// Get Department List----------------------------------------- 
app.get('/api/admin/department/list', (req, res) => {
  const getDeptQuery = 'SELECT Dept_name FROM Department';
  
  conn.query(getDeptQuery, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'An error occurred while fetching departments' });
    }

    const departmentNames = results.map(row => row.Dept_name);
    res.json(departmentNames);  
  });
});
 // get entire department table -----------------------------------------
app.get('/api/admin/department/all', (req, res) => {
  const getAllDeptQuery = 'SELECT * FROM Department';
  
  conn.query(getAllDeptQuery, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'An error occurred while fetching departments' });
    }

    res.json(results);  
  });
});

// GET INSTRUCTOR DATA -------------------------------------------------------------------------------------------------------------------------
// Get all instructors with their details

app.get('/api/admin/instructor/all', (req, res) => {
  const query = `
    SELECT 
      i.instructor_id,
      i.Name,
      i.Contact,
      i.email,
      d.Dept_name AS HeadOfDept,
      GROUP_CONCAT(DISTINCT c.course_name SEPARATOR ', ') AS Courses,
      GROUP_CONCAT(DISTINCT wd.Dept_name SEPARATOR ', ') AS Department
    FROM 
      Instructor i
    LEFT JOIN 
      Head h ON i.instructor_id = h.instructor_id
    LEFT JOIN 
      Department d ON h.Dept_Id = d.Dept_Id
    LEFT JOIN 
      Takes t ON i.instructor_id = t.instructor_id
    LEFT JOIN 
      Courses c ON t.course_id = c.course_id
    LEFT JOIN 
      Works w ON i.instructor_id = w.instructor_id
    LEFT JOIN 
      Department wd ON w.Dept_Id = wd.Dept_Id
    GROUP BY 
      i.instructor_id, i.Name, i.Contact, i.email, d.Dept_name
  `;
  
  conn.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'An error occurred while fetching instructors' });
    }

    res.json(results);  
  });
});
//  UPDATE INSTRUCTORS-------------------------------------- 
// Add/Update Instructor
app.post('/api/admin/instructor', (req, res) => {
  const { instructor_id, name, contact, email, department, courses, head_of_dept } = req.body;

  // Start transaction
  conn.beginTransaction(err => {
    if (err) {
      console.error('Transaction error:', err);
      return res.status(500).json({ error: 'Transaction error' });
    }

    // Check if instructor exists
    const checkQuery = 'SELECT * FROM Instructor WHERE instructor_id = ?';
    conn.query(checkQuery, [instructor_id], (checkErr, checkResult) => {
      if (checkErr) {
        return conn.rollback(() => {
          res.status(500).json({ error: 'Database error' });
        });
      }

      let query;
      let params;

      if (checkResult.length > 0) {
        // Update existing instructor
        query = 'UPDATE Instructor SET Name = ?, Contact = ?, email = ? WHERE instructor_id = ?';
        params = [name, contact, email, instructor_id];
      } else {
        // Insert new instructor
        query = 'INSERT INTO Instructor (instructor_id, Name, Contact, email) VALUES (?, ?, ?, ?)';
        params = [instructor_id, name, contact, email];
      }

      conn.query(query, params, (updateErr, updateResult) => {
        if (updateErr) {
          return conn.rollback(() => {
            res.status(500).json({ error: 'Database error' });
          });
        }

        // Update Works relationship
        const deleteWorksQuery = 'DELETE FROM Works WHERE instructor_id = ?';
        conn.query(deleteWorksQuery, [instructor_id], (deleteErr) => {
          if (deleteErr) {
            return conn.rollback(() => {
              res.status(500).json({ error: 'Database error' });
            });
          }

          const insertWorksQuery = 'INSERT INTO Works (instructor_id, Dept_Id) VALUES (?, (SELECT Dept_Id FROM Department WHERE Dept_name = ?))';
          conn.query(insertWorksQuery, [instructor_id, department], (insertErr) => {
            if (insertErr) {
              return conn.rollback(() => {
                res.status(500).json({ error: 'Database error' });
              });
            }

            // Update Takes relationship
            const deleteTakesQuery = 'DELETE FROM Takes WHERE instructor_id = ?';
            conn.query(deleteTakesQuery, [instructor_id], (deleteErr) => {
              if (deleteErr) {
                return conn.rollback(() => {
                  res.status(500).json({ error: 'Database error' });
                });
              }

              const insertTakesQuery = 'INSERT INTO Takes (instructor_id, course_id) VALUES ?';
              const takesValues = courses.map(course_id => [instructor_id, course_id]);
              conn.query(insertTakesQuery, [takesValues], (insertErr) => {
                if (insertErr) {
                  return conn.rollback(() => {
                    res.status(500).json({ error: 'Database error' });
                  });
                }

                // Update Head relationship
                const deleteHeadQuery = 'DELETE FROM Head WHERE instructor_id = ?';
                conn.query(deleteHeadQuery, [instructor_id], (deleteErr) => {
                  if (deleteErr) {
                    return conn.rollback(() => {
                      res.status(500).json({ error: 'Database error' });
                    });
                  }

                  if (head_of_dept) {
                    const insertHeadQuery = 'INSERT INTO Head (instructor_id, Dept_Id) VALUES (?, (SELECT Dept_Id FROM Department WHERE Dept_name = ?))';
                    conn.query(insertHeadQuery, [instructor_id, head_of_dept], (insertErr) => {
                      if (insertErr) {
                        return conn.rollback(() => {
                          res.status(500).json({ error: 'Database error' });
                        });
                      }

                      conn.commit(commitErr => {
                        if (commitErr) {
                          return conn.rollback(() => {
                            res.status(500).json({ error: 'Commit error' });
                          });
                        }
                        res.json({ message: 'Instructor added/updated successfully' });
                      });
                    });
                  } else {
                    conn.commit(commitErr => {
                      if (commitErr) {
                        return conn.rollback(() => {
                          res.status(500).json({ error: 'Commit error' });
                        });
                      }
                      res.json({ message: 'Instructor added/updated successfully' });
                    });
                  }
                });
              });
            });
          });
        });
      });
    });
  });
});
// Get Course List
app.get('/api/admin/courses/list', (req, res) => {
  const query = 'SELECT course_id, course_name FROM Courses'; // Modify as per your database structure
  conn.query(query, (err, results) => {
      if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'An error occurred while fetching courses' });
      }
      res.json(results);
  });
});

// Remove Instructor
app.delete('/api/admin/instructor/:id', (req, res) => {
  const instructorId = req.params.id;

  // Start transaction
  conn.beginTransaction(err => {
    if (err) {
      console.error('Transaction error:', err);
      return res.status(500).json({ error: 'Transaction error' });
    }

    // Delete from Works table
    const deleteWorksQuery = 'DELETE FROM Works WHERE instructor_id = ?';
    conn.query(deleteWorksQuery, [instructorId], (deleteErr) => {
      if (deleteErr) {
        return conn.rollback(() => {
          res.status(500).json({ error: 'Database error' });
        });
      }

      // Delete from Takes table
      const deleteTakesQuery = 'DELETE FROM Takes WHERE instructor_id = ?';
      conn.query(deleteTakesQuery, [instructorId], (deleteErr) => {
        if (deleteErr) {
          return conn.rollback(() => {
            res.status(500).json({ error: 'Database error' });
          });
        }

        // Delete from Head table
        const deleteHeadQuery = 'DELETE FROM Head WHERE instructor_id = ?';
        conn.query(deleteHeadQuery, [instructorId], (deleteErr) => {
          if (deleteErr) {
            return conn.rollback(() => {
              res.status(500).json({ error: 'Database error' });
            });
          }

          // Delete from Instructor table
          const deleteInstructorQuery = 'DELETE FROM Instructor WHERE instructor_id = ?';
          conn.query(deleteInstructorQuery, [instructorId], (deleteErr, result) => {
            if (deleteErr) {
              return conn.rollback(() => {
                res.status(500).json({ error: 'Database error' });
              });
            }

            if (result.affectedRows === 0) {
              return conn.rollback(() => {
                res.status(404).json({ error: 'Instructor not found' });
              });
            }

            conn.commit(commitErr => {
              if (commitErr) {
                return conn.rollback(() => {
                  res.status(500).json({ error: 'Commit error' });
                });
              }
              res.json({ message: 'Instructor removed successfully' });
            });
          });
        });
      });
    });
  });
});
//  --------------------------------------------------------------------------------------------------------------------------------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'An unexpected error occurred' });
});
const port = 3000;
async function startServer() {
  try {
    await connectToDatabase();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}
startServer();
process.on('SIGINT', () => {
  conn.end((err) => {
    if (err) {
      console.error('Error closing MySQL connection:', err);
    }
    console.log('MySQL connection closed');
    process.exit(0);
  });
});
