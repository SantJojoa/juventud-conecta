import React, { useState, useEffect, useRef } from 'react';
import './Chatbot.css';

const Chatbot = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Al abrir el chat, pide los mensajes iniciales al backend
    useEffect(() => {
        if (open && messages.length === 0) {
            fetchInitialMessages();
        }
    }, [open]);

    const fetchInitialMessages = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/chatbot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: '' }),
            });
            const data = await res.json();
            if (data.redirect) {
                window.open(data.redirect, '_blank');
                return;
            }
            if (Array.isArray(data.messages)) {
                setMessages(data.messages);
            } else if (data.reply) {
                setMessages([{ sender: 'bot', text: data.reply, quickReplies: data.quickReplies }]);
            }
        } catch (error) {
            setMessages([{ sender: 'bot', text: 'Lo siento, hubo un error al iniciar el chat.' }]);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (open) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, open]);

    useEffect(() => {
        if (!open) return;
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                setOpen(false);
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [open]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('http://localhost:5000/api/chatbot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input })
            });
            const data = await res.json();
            if (data.redirect) {
                window.open(data.redirect, '_blank');
                return;
            }
            if (Array.isArray(data.messages)) {
                setMessages(prev => [...prev, ...data.messages]);
            } else if (data.reply) {
                setMessages(prev => [
                    ...prev,
                    { sender: 'bot', text: data.reply, quickReplies: data.quickReplies }
                ]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { sender: 'bot', text: 'Lo siento, hubo un error al procesar tu solicitud.' }]);
        }
        setLoading(false);
    };

    const handleQuickReply = (payload) => {
        // Envía el payload como si fuera un mensaje del usuario
        setMessages(prev => [...prev, { sender: 'user', text: payload }]);
        setInput('');
        sendQuickReply(payload);
    };

    const sendQuickReply = async (payload) => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/chatbot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: payload })
            });
            const data = await res.json();
            if (data.redirect) {
                window.open(data.redirect, '_blank');
                return;
            }
            if (Array.isArray(data.messages)) {
                setMessages(prev => [...prev, ...data.messages]);
            } else if (data.reply) {
                setMessages(prev => [
                    ...prev,
                    { sender: 'bot', text: data.reply, quickReplies: data.quickReplies }
                ]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { sender: 'bot', text: 'Lo siento, hubo un error al procesar tu solicitud.' }]);
        }
        setLoading(false);
    };

    return (
        <>
            <button className='chatbot-toggle' onClick={() => setOpen(o => !o)}>
                💬
            </button>
            {open && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        Chatbot
                        <button className='chatbot-close' onClick={() => setOpen(false)} >x</button>
                    </div>
                    <div className="chatbot-messages">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`chatbot-message ${msg.sender === 'user' ? 'user' : 'bot'}`}
                            >
                                <div>{msg.text}</div>
                                {msg.quickReplies && (
                                    <div className="quick-replies">
                                        {msg.quickReplies.map((qr, i) => (
                                            <button key={i} onClick={() => handleQuickReply(qr.payload)}>
                                                {qr.title}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        {loading && <div className="chatbot-message bot">Escribiendo...</div>}
                        <div ref={messagesEndRef}></div>
                    </div>
                    <form className='chatbot-input-area' onSubmit={handleSend}>
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder='Escribe tu pregunta...'
                            disabled={loading}
                        />
                        <button type="submit" disabled={loading || !input.trim()}>Enviar</button>
                    </form>
                </div>
            )}
        </>
    );
};

export default Chatbot;