const API_URL = process.env.REACT_APP_API_URL || 'https://api.brasilia.app';

function getToken() {
 return localStorage.getItem('brasilia_token');
}

async function request(path, options = {}) {
 const res = await fetch(`${API_URL}${path}`, {
 ...options,
 headers: {
 'Content-Type': 'application/json',
 ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
 ...options.headers
 }
 });
 const data = await res.json().catch(() => ({}));
 if (!res.ok) {
 throw new Error(data.error || 'Erro na requisição');
 }
 return data;
}

export async function register(email, password) {
 const data = await request('/api/auth/register', {
 method: 'POST',
 body: JSON.stringify({ email, password })
 });
 localStorage.setItem('brasilia_token', data.token);
 return data;
}

export async function login(email, password) {
 const data = await request('/api/auth/login', {
 method: 'POST',
 body: JSON.stringify({ email, password })
 });
 localStorage.setItem('brasilia_token', data.token);
 return data;
}

export function logout() {
 localStorage.removeItem('brasilia_token');
}

export function isAuthenticated() {
 return !!getToken();
}

export async function generateContent(prompt) {
 return request('/api/generate', {
 method: 'POST',
 body: JSON.stringify({ prompt })
 });
}

export async function getHistory() {
 return request('/api/generate/history');
}

export async function getYoutubeAuthUrl() {
 return request('/api/youtube/auth-url');
}

export async function getMyYoutubeVideos() {
 return request('/api/youtube/videos');
}

export async function downloadYoutubeVideo(videoId, title) {
 const res = await fetch(`${API_URL}/api/youtube/download/${videoId}`, {
 headers: { Authorization: `Bearer ${getToken()}` }
 });
 if (!res.ok) {
 const data = await res.json().catch(() => ({}));
 throw new Error(data.error || 'Erro ao baixar vídeo');
 }
 const blob = await res.blob();
 const url = window.URL.createObjectURL(blob);
 const a = document.createElement('a');
 a.href = url;
 a.download = `${(title || 'video').replace(/[^\w\s-]/g, '')}.mp4`;
 document.body.appendChild(a);
 a.click();
 a.remove();
 window.URL.revokeObjectURL(url);
}

export async function disconnectYoutube() {
 return request('/api/youtube/disconnect', { method: 'DELETE' });
}
