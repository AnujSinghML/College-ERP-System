function loadAdminProfile() {
    fetch('http://localhost:3000/api/admin/profile')
    .then(response => response.json())
    .then(data => {
        document.getElementById("admin-name").innerText = data.username || 'Not Added';
        document.getElementById("admin-role").innerText = data.role || 'Admin'; 
    })
    .catch(error => {
        console.error('Error loading profile:', error);
        document.getElementById("admin-name").innerText = 'Error fetching profile';
    });
}

window.onload = function() {
    loadAdminProfile();       // Load the admin profile
    loadCounts();    // Load department count
    showSection('profile');    // Show profile section by default
};
function loadCounts() {
    // Fetch total departments
    fetch('http://localhost:3000/api/admin/department/list')
        .then(response => response.json())
        .then(departments => {
            document.getElementById('total-departments').innerText = departments.length;
        })
        .catch(error => console.error('Error loading departments count:', error));

    // Fetch total courses
    fetch('http://localhost:3000/api/admin/courses/list')
        .then(response => response.json())
        .then(courses => {
            document.getElementById('total-courses').innerText = courses.length;
        })
        .catch(error => console.error('Error loading courses count:', error));

    // Fetch total instructors
    fetch('http://localhost:3000/api/admin/instructor/all')
        .then(response => response.json())
        .then(instructors => {
            document.getElementById('total-instructors').innerText = instructors.length;
        })
        .catch(error => console.error('Error loading instructors count:', error));
}


document.getElementById("department-form").addEventListener("submit", function (event) {
    event.preventDefault();
  
    const deptData = {
      dept_name: document.getElementById("dept_name").value,
      contact_no: document.getElementById("contact_no").value,
      location: document.getElementById("location").value
    };
  
    fetch('http://localhost:3000/api/admin/department', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deptData)
    })
    .then(response => response.json())
    .then(data => {
      alert(data.message);
      document.getElementById("department-form").reset();
    })
    .catch(error => console.error('Error:', error));
});

document.getElementById("delete-department").addEventListener("click", function () {
    const modal = document.getElementById("delete-modal");
    modal.classList.remove('hidden');
    
    fetch('http://localhost:3000/api/admin/department/list')
        .then(response => response.json())
        .then(departments => {
            const deptSelect = document.getElementById('dept-select');
            deptSelect.innerHTML = '';

            if (departments.length > 0) {
                departments.forEach(dept_name => {
                    const option = document.createElement('option');
                    option.value = dept_name;
                    option.textContent = dept_name;
                    deptSelect.appendChild(option);
                });
            } else {
                const noOption = document.createElement('option');
                noOption.textContent = 'No departments available';
                noOption.disabled = true;
                deptSelect.appendChild(noOption);
            }
        })
        .catch(error => console.error('Error fetching department list:', error));
});

document.getElementById("confirm-delete").addEventListener("click", function () {
    const deptSelect = document.getElementById('dept-select');
    const selectedDept = deptSelect.value;
    
    if (!selectedDept) {
        alert('Please select a department to delete.');
        return;
    }
    
    if (confirm(`Are you sure you want to delete the ${selectedDept} department?`)) {
        fetch('http://localhost:3000/api/admin/department', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dept_name: selectedDept })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                alert(data.message);
                const optionToRemove = deptSelect.querySelector(`option[value="${selectedDept}"]`);
                if (optionToRemove) {
                    optionToRemove.remove();
                }
            }
        })
        .catch(error => console.error('Error deleting department:', error));
    }
    document.getElementById('delete-modal').classList.add('hidden');
});

document.getElementById("cancel-delete").addEventListener("click", function () {
    document.getElementById('delete-modal').classList.add('hidden');
});

//VIEW--------------------------------------------------
const viewDepartmentsButton = document.getElementById('view-departments');
viewDepartmentsButton.addEventListener('click', () => showSection('department-view'));
const viewInstructorsButton = document.getElementById('view-instructors');
viewInstructorsButton.addEventListener('click', () => showSection('instructor-view'));

function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.querySelectorAll('.sidebar-link, .sub-option').forEach(link => {
        link.classList.remove('active');
    });

    if (sectionId === 'department') {
        document.getElementById('department-sub-options').classList.remove('hidden');
        document.getElementById('department-update-section').classList.add('active');
        document.querySelector(`.sidebar-link[data-target="${sectionId}"]`).classList.add('active');
        document.querySelector('.sub-option[data-target="department-update"]').classList.add('active');
    } else if (sectionId.startsWith('department-')) {
        document.getElementById('department-sub-options').classList.remove('hidden');
        document.getElementById(`${sectionId}-section`).classList.add('active');
        document.querySelector('.sidebar-link[data-target="department"]').classList.add('active');
        document.querySelector(`.sub-option[data-target="${sectionId}"]`).classList.add('active');
    } else if (sectionId === 'department-view') {
        document.getElementById('department-sub-options').classList.remove('hidden');
        document.getElementById(`${sectionId}-section`).classList.add('active');
        document.querySelector('.sidebar-link[data-target="department"]').classList.add('active');
        document.querySelector(`.sub-option[data-target="${sectionId}"]`).classList.add('active');
        loadDepartmentTable(); // Call the function to load the department table
    } 
    else if (sectionId === 'instructor') {
        document.getElementById('instructor-sub-options').classList.remove('hidden');
        document.getElementById('instructor-update-section').classList.add('active');
        document.querySelector(`.sidebar-link[data-target="${sectionId}"]`).classList.add('active');
        document.querySelector('.sub-option[data-target="instructor-update"]').classList.add('active');
    } else if (sectionId.startsWith('instructor-')) {
        document.getElementById('instructor-sub-options').classList.remove('hidden');
        document.getElementById(`${sectionId}-section`).classList.add('active');
        document.querySelector('.sidebar-link[data-target="instructor"]').classList.add('active');
        document.querySelector(`.sub-option[data-target="${sectionId}"]`).classList.add('active');
    }
    else if (sectionId === 'instructor-view') {
        document.getElementById('instructor-sub-options').classList.remove('hidden');
        document.getElementById(`${sectionId}-section`).classList.add('active');
        document.querySelector('.sidebar-link[data-target="instructor"]').classList.add('active');
        document.querySelector(`.sub-option[data-target="${sectionId}"]`).classList.add('active');
        document.getElementById('instructor-view-section').classList.remove('hidden');
        loadInstructorTable(); }
        else {
        document.getElementById('department-sub-options').classList.add('hidden');
        document.getElementById('instructor-sub-options').classList.add('hidden');
        document.getElementById(`${sectionId}-section`).classList.add('active');
        document.querySelector(`[data-target="${sectionId}"]`).classList.add('active');
    }

    if (sectionId === 'department-view') {
        loadDepartmentTable();
    }
    
    if (sectionId === 'instructor-update') {
        populateDropdowns();
    }

    if (sectionId === 'instructor-view') {
        loadInstructorTable();
    }
}

// Function to load instructor table
function loadInstructorTable() {
    fetch('http://localhost:3000/api/admin/instructor/all')
        .then(response => response.json())
        .then(instructors => {
            const tableBody = document.getElementById('instructor-table-body');
            tableBody.innerHTML = ''; // Clear existing rows

            instructors.forEach(instructor => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="py-2 px-4">${instructor.instructor_id}</td>
                    <td class="py-2 px-4">${instructor.Name}</td>
                    <td class="py-2 px-4">${instructor.Contact || '-'}</td>
                    <td class="py-2 px-4">${instructor.email || '-'}</td>
                    <td class="py-2 px-4">${instructor.HeadOfDept || '-'}</td>
                    <td class="py-2 px-4">${instructor.Courses || '-'}</td>
                    <td class="py-2 px-4">${instructor.Department || '-'}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error loading instructors:', error));
}

document.querySelector('.sidebar-link[data-target="instructor"]').addEventListener('click', function(e) {
    e.preventDefault();
    showSection('instructor');
});
// New function to load department table
function loadDepartmentTable() {
    fetch('http://localhost:3000/api/admin/department/all')
        .then(response => response.json())
        .then(departments => {
            const tableBody = document.getElementById('department-table-body');
            tableBody.innerHTML = ''; // Clear existing rows

            departments.forEach(dept => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="py-2 px-4">${dept.Dept_Id}</td>
                    <td class="py-2 px-4">${dept.Dept_name}</td>
                    <td class="py-2 px-4">${dept.Contact_No || '-'}</td>
                    <td class="py-2 px-4">${dept.Location || '-'}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error loading departments:', error));
}

// Event listeners for sidebar links and sub-options
document.querySelectorAll('.sidebar-link, .sub-option').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = this.getAttribute('data-target');
        showSection(target);
    });
});

// Make sure the department section expands when clicked
document.querySelector('.sidebar-link[data-target="department"]').addEventListener('click', function(e) {
    e.preventDefault();
    showSection('department');
});
document.querySelector('.sidebar-link[data-target="instructor"]').addEventListener('click', function(e) {
    e.preventDefault();
    showSection('instructor');
});

function populateDropdowns() {
    // Populate departments
    fetch('http://localhost:3000/api/admin/department/list')
    .then(response => response.json())
    .then(departments => {
        const departmentSelect = document.getElementById('instructor_department');
        const headOfDeptSelect = document.getElementById('instructor_head_of_dept');
        
        // Clear existing options
        departmentSelect.innerHTML = '';
        headOfDeptSelect.innerHTML = '';

        // Add default 'Not a Head of Department' option for Head of Department dropdown
        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = "Not a Head of Department";
        headOfDeptSelect.appendChild(defaultOption);

        // Add departments to both dropdowns
        departments.forEach(dept => {
            const option = document.createElement('option');
            option.value = dept;
            option.textContent = dept;
            departmentSelect.appendChild(option);
            headOfDeptSelect.appendChild(option.cloneNode(true)); // Clone option for head of dept dropdown
        });
    })
    .catch(error => console.error('Error loading departments:', error));

    // Populate courses
    fetch('http://localhost:3000/api/admin/courses/list')
    .then(response => response.json())
    .then(courses => {
        const courseSelect = document.getElementById('instructor_courses');
        
        // Clear existing options
        courseSelect.innerHTML = ''; 

        // Add courses to dropdown
        courses.forEach(course => {
            const option = document.createElement('option');
            option.value = course.course_id;
            option.textContent = `${course.course_name} (${course.course_id})`;
            courseSelect.appendChild(option);
        });
    })
    .catch(error => console.error('Error loading courses:', error));
}

// Function to handle instructor form submission
document.getElementById('instructor-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = {
        instructor_id: document.getElementById('instructor_id').value,
        name: document.getElementById('instructor_name').value,
        contact: document.getElementById('instructor_contact').value,
        email: document.getElementById('instructor_email').value,
        department: document.getElementById('instructor_department').value,
        courses: Array.from(document.getElementById('instructor_courses').selectedOptions).map(option => option.value),
        head_of_dept: document.getElementById('instructor_head_of_dept').value
    };

    fetch('http://localhost:3000/api/admin/instructor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        loadInstructorTable();  // Refresh the instructor table
    })
    .catch(error => console.error('Error:', error));
});

// Function to handle remove instructor form submission
document.getElementById('remove-instructor-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const instructorId = document.getElementById('remove_instructor_id').value;

    if (confirm(`Are you sure you want to remove the instructor with ID ${instructorId}?`)) {
        fetch(`http://localhost:3000/api/admin/instructor/${instructorId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            loadInstructorTable();  // Refresh the instructor table
        })
        .catch(error => console.error('Error:', error));
    }
});