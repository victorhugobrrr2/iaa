import React, { useState, useEffect } from 'react';
import './styles.css';
import { generateContent, login, register, logout, isAuthenticated } from './api';
import { startVoiceRecognition } from './voice';
import MyVideos from './MyVideos';

export default function App() {
 const [authed, setAuthed] = useState(isAuthenticated());
 const [tab, setTab] = useState(() => new URLSearchParams(window.location.search).get('tab') === 'videos' ? 'videos' : 'criar');
 const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [authError, setAuthError] = useState('');
 const [prompt, setPrompt] = useState('');
 const [result, setResult] = useState('');
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState('');

 useEffect(() => {
 setAuthed(isAuthenticated());
 }, []);

 const handleAuth = async (e) => {
 e.preventDefault();
 setAuthError('');
 try {
 if (authMode === 'login') {
 await login(email, password);
 } else {
 await register(email, password);
 }
 setAuthed(true);
 } catch (err) {
 setAuthError(err.message);
 }
 };

 const handleLogout = () => {
 logout();
 setAuthed(false);
 };

 const handleGenerate = async () => {
 if (!prompt.trim()) return;
 setLoading(true);
 setError('');
 try {
 const data = await generateContent(prompt);
 setResult(data.result);
 } catch (err) {
 setError(err.message);
 } finally {
 setLoading(false);
 }
 };

 if (!authed) {
 return (
 <div className="container">
 <header className="hero">
 <img src="/logo192.png" alt="BrasilIA" className="logo" />
 <h1>BrasilIA</h1>
 <p>IA 100% Gratuita e Livre</p>
 </header>
 <form className="auth-form" onSubmit={handleAuth}>
 <h2>{authMode === 'login' ? 'Entrar' : 'Criar conta'}</h2>
 <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
 <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
 {authError && <p className="error">{authError}</p>}
 <button type="submit">{authMode === 'login' ? 'Entrar' : 'Cadastrar'}</button>
 <button type="button" className="link-button" onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}>
 {authMode === 'login' ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entrar'}
 </button>
 </form>
 </div>
 );
 }

 return (
 <div className="container">
 <header className="hero">
 <img src="/logo192.png" alt="BrasilIA" className="logo" />
 <h1>BrasilIA</h1>
 <p>IA 100% Gratuita e Livre</p>
 <button className="logout-button" onClick={handleLogout}>Sair</button>
 </header>
 <nav className="tabs">
 <button className={tab === 'criar' ? 'tab active' : 'tab'} onClick={() => setTab('criar')}>
 ✨ Criar Conteúdo
 </button>
 <button className={tab === 'videos' ? 'tab active' : 'tab'} onClick={() => setTab('videos')}>
 🎬 Meus Vídeos
 </button>
 </nav>
 {tab === 'criar' ? (
 <div className="content">
 <div className="input-group">
 <textarea
 className="prompt-input"
 placeholder="Descreva o que você quer criar..."
 value={prompt}
 onChange={(e) => setPrompt(e.target.value)}
 rows={4}
 />
 <div className="button-group">
 <button className="primary-button" onClick={handleGenerate} disabled={loading}>
 {loading ? 'Gerando...' : '🚀 Gerar'}
 </button>
 <button className="secondary-button" onClick={() => startVoiceRecognition(setPrompt)}>
 🎤 Voz
 </button>
 </div>
 </div>
 {error && <p className="error">{error}</p>}
 {result && (
 <div className="result">
 <h3>Resultado:</h3>
 <p>{result}</p>
 </div>
 )}
 </div>
 ) : (
 <MyVideos />
 )}
 </div>
 );
}
