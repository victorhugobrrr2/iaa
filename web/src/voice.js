export function startVoiceRecognition(setPrompt, onError) {
 const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
 if (!SpeechRecognition) {
 if (onError) onError('Reconhecimento de voz não suportado neste dispositivo.');
 else alert('Reconhecimento de voz não suportado neste dispositivo.');
 return;
 }
 const recognition = new SpeechRecognition();
 recognition.lang = 'pt-BR';
 recognition.interimResults = false;
 recognition.maxAlternatives = 1;
 recognition.onresult = (e) => setPrompt(e.results[0][0].transcript);
 recognition.onerror = (e) => {
 if (onError) onError(`Erro no reconhecimento de voz: ${e.error}`);
 };
 recognition.start();
}
