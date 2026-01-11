// src/services/api.ts
const API_URL = 'http://localhost:8000';

// Helper to get headers with token
const getHeaders = () => {
    // In a real app, store token in localStorage or Cookie. 
    // Here we assume AuthContext sets a user, but api.ts is separate.
    // For MVP, since we don't have global state access inside api.ts easily without interceptors:
    // We will retrieve from localStorage if we saved it there.
    const userStr = localStorage.getItem('bjj_user');
    const token = userStr ? JSON.parse(userStr).token : '';
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export async function login(email: string, password: string) {
    const response = await fetch(`${API_URL}/?action=login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    if (!response.ok) throw new Error('Falha no login');
    const data = await response.json();
    // Save to localStorage so we can use token later
    if (data.token) {
        localStorage.setItem('bjj_user', JSON.stringify(data));
    }
    return data;
}

export async function fetchStudentDashboard(userId: string) {
    const response = await fetch(`${API_URL}/?action=student_dashboard&user_id=${userId}`, { headers: getHeaders() });
    return response.json();
}

export async function checkInClass(userId: string) {
    const response = await fetch(`${API_URL}/?action=check_in&user_id=${userId}`, {
        method: 'POST',
        headers: getHeaders()
    });
    return response.json();
}

export async function fetchStudentVideos(userId: string) {
    const response = await fetch(`${API_URL}/?action=student_videos&user_id=${userId}`, { headers: getHeaders() });
    return response.json();
}

export async function fetchStudentEvents(userId: string) {
    const response = await fetch(`${API_URL}/?action=student_events&user_id=${userId}`, { headers: getHeaders() });
    return response.json();
}

export async function fetchStudentFinancial(userId: string) {
    const response = await fetch(`${API_URL}/?action=student_financial&user_id=${userId}`, { headers: getHeaders() });
    return response.json();
}

// Professor
export async function fetchProfessorStats() {
    const response = await fetch(`${API_URL}/?action=professor_stats`, { headers: getHeaders() });
    return response.json();
}

export async function fetchProfessorStudents() {
    const response = await fetch(`${API_URL}/?action=professor_students`, { headers: getHeaders() });
    return response.json();
}

export async function fetchProfessorVideos() {
    const response = await fetch(`${API_URL}/?action=professor_videos`, { headers: getHeaders() });
    return response.json();
}

export async function fetchProfessorEvents() {
    const response = await fetch(`${API_URL}/?action=professor_events`, { headers: getHeaders() });
    return response.json();
}

// Professor Actions
export async function createStudent(data: { name: string; email: string; belt: string }) {
    const response = await fetch(`${API_URL}/?action=add_student`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    return response.json();
}

export async function deleteStudent(userId: number | string) {
    const response = await fetch(`${API_URL}/?action=delete_student`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ user_id: userId })
    });
    return response.json();
}

export async function createVideo(data: any) {
    const response = await fetch(`${API_URL}/?action=add_video`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    return response.json();
}

export async function deleteVideo(id: number | string) {
    const response = await fetch(`${API_URL}/?action=delete_video`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ id })
    });
    return response.json();
}

export async function createEvent(data: any) {
    const response = await fetch(`${API_URL}/?action=add_event`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    return response.json();
}

export async function deleteEvent(id: number | string) {
    const response = await fetch(`${API_URL}/?action=delete_event`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ id })
    });
    return response.json();
}
// ... add others as needed
