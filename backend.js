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
        faculty: 'http://localhost:5500/faculty/faculty.html',
        student: 'http://localhost:5500/student/student.html',
        account_personal: 'http://localhost:5500/personal/personal.html',
      };
      res.json({ success: true, redirectUrl: redirectUrls[role] || 'http://localhost:5500/login.html' });
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
