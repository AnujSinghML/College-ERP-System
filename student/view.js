// Load Admin Profile
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

// Load Counts for Dashboard (Total Departments, Courses, and Instructors)
function loadCounts() {
    // Fetch total departments count
    fetch('http://localhost:3000/api/admin/department/list')
        .then(response => response.json())
        .then(departments => {
            document.getElementById('total-departments').innerText = departments.length || 0;
        })
        .catch(error => console.error('Error loading departments count:', error));

    // Fetch total courses count
    fetch('http://localhost:3000/api/admin/courses/list')
        .then(response => response.json())
        .then(courses => {
            document.getElementById('total-courses').innerText = courses.length || 0;
        })
        .catch(error => console.error('Error loading courses count:', error));

    // Fetch total instructors count
    fetch('http://localhost:3000/api/admin/instructor/all')
        .then(response => response.json())
        .then(instructors => {
            document.getElementById('total-instructors').innerText = instructors.length || 0;
        })
        .catch(error => console.error('Error loading instructors count:', error));
}

// Function to load department table
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

// Function to display the active section
function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.querySelectorAll('.sidebar-link, .sub-option').forEach(link => {
        link.classList.remove('active');
    });

    if (sectionId === 'department-view') {
        document.getElementById('department-view-section').classList.add('active');
        loadDepartmentTable();
    } else if (sectionId === 'instructor-view') {
        document.getElementById('instructor-view-section').classList.add('active');
        loadInstructorTable();
    } else {
        document.getElementById(`${sectionId}-section`).classList.add('active');
    }

    document.querySelector(`[data-target="${sectionId}"]`).classList.add('active');
}

// Event listeners for sidebar navigation
document.querySelectorAll('.sidebar-link, .sub-option').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = this.getAttribute('data-target');
        showSection(target);
    });
});

// Initial Load
window.onload = function() {
    loadAdminProfile();
    loadCounts();
    showSection('profile'); // Show profile section by default
};
