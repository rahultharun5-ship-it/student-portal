// Student data array
let students = [];
let editId = null;

// Load students when page loads
window.onload = function() {
    loadStudents();
    updateStats();
    
    // Search functionality
    document.getElementById('search').addEventListener('input', function(e) {
        searchStudents(e.target.value);
    });
    
    // Form submit
    document.getElementById('studentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveStudent();
    });
};

// Load from localStorage
function loadStudents() {
    const saved = localStorage.getItem('students');
    if (saved) {
        students = JSON.parse(saved);
    }
    displayStudents(students);
}

// Save to localStorage
function saveToStorage() {
    localStorage.setItem('students', JSON.stringify(students));
}

// Display students
function displayStudents(data) {
    const list = document.getElementById('studentList');
    const empty = document.getElementById('noData');
    
    if (data.length === 0) {
        list.classList.add('hidden');
        empty.classList.remove('hidden');
        return;
    }
    
    list.classList.remove('hidden');
    empty.classList.add('hidden');
    
    list.innerHTML = '';
    
    data.forEach(student => {
        const card = document.createElement('div');
        card.className = 'student-card';
        
        card.innerHTML = `
            <span class="roll-badge">${student.rollNo}</span>
            <h3>${student.name}</h3>
            <div class="student-info">
                <div>📧 ${student.email}</div>
                <div>🎓 ${student.dept}</div>
                ${student.phone ? `<div>📱 ${student.phone}</div>` : ''}
                <div><span class="gpa-badge">GPA: ${student.gpa}</span></div>
            </div>
            <div class="card-buttons">
                <button class="edit-btn" onclick="editStudent('${student.id}')">Edit</button>
                <button class="delete-btn" onclick="deleteStudent('${student.id}')">Delete</button>
            </div>
        `;
        
        list.appendChild(card);
    });
}

// Open modal
function openModal(id = null) {
    const modal = document.getElementById('modal');
    const form = document.getElementById('studentForm');
    
    editId = id;
    
    if (id) {
        document.getElementById('modalTitle').textContent = 'Edit Student';
        const student = students.find(s => s.id === id);
        
        document.getElementById('rollNo').value = student.rollNo;
        document.getElementById('name').value = student.name;
        document.getElementById('email').value = student.email;
        document.getElementById('dept').value = student.dept;
        document.getElementById('gpa').value = student.gpa;
        document.getElementById('phone').value = student.phone || '';
    } else {
        document.getElementById('modalTitle').textContent = 'Add Student';
        form.reset();
    }
    
    modal.classList.add('show');
}

// Close modal
function closeModal() {
    document.getElementById('modal').classList.remove('show');
    document.getElementById('studentForm').reset();
    editId = null;
}

// Save student
function saveStudent() {
    const rollNo = document.getElementById('rollNo').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const dept = document.getElementById('dept').value;
    const gpa = document.getElementById('gpa').value;
    const phone = document.getElementById('phone').value;
    
    if (editId) {
        // Update existing
        const index = students.findIndex(s => s.id === editId);
        students[index] = {
            id: editId,
            rollNo: rollNo,
            name: name,
            email: email,
            dept: dept,
            gpa: gpa,
            phone: phone
        };
    } else {
        // Add new
        const newStudent = {
            id: Date.now().toString(),
            rollNo: rollNo,
            name: name,
            email: email,
            dept: dept,
            gpa: gpa,
            phone: phone
        };
        students.push(newStudent);
    }
    
    saveToStorage();
    displayStudents(students);
    updateStats();
    closeModal();
}

// Edit student
function editStudent(id) {
    openModal(id);
}

// Delete student
function deleteStudent(id) {
    if (confirm('Are you sure you want to delete this student?')) {
        students = students.filter(s => s.id !== id);
        saveToStorage();
        displayStudents(students);
        updateStats();
    }
}

// Search students
function searchStudents(query) {
    query = query.toLowerCase();
    
    if (!query) {
        displayStudents(students);
        return;
    }
    
    const filtered = students.filter(s => 
        s.name.toLowerCase().includes(query) || 
        s.rollNo.toLowerCase().includes(query)
    );
    
    displayStudents(filtered);
}

// Update statistics
function updateStats() {
    const total = students.length;
    document.getElementById('total').textContent = total;
    
    if (total === 0) {
        document.getElementById('avgGpa').textContent = '0.0';
        document.getElementById('toppers').textContent = '0';
        return;
    }
    
    // Calculate average
    let sum = 0;
    for (let i = 0; i < students.length; i++) {
        sum += parseFloat(students[i].gpa);
    }
    const avg = (sum / total).toFixed(1);
    document.getElementById('avgGpa').textContent = avg;
    
    // Count top students
    const toppers = students.filter(s => parseFloat(s.gpa) > 8.5).length;
    document.getElementById('toppers').textContent = toppers;
}
