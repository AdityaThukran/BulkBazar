import React, { useState, useEffect, useRef } from 'react';
import { X, Send, MessageSquare } from 'lucide-react';
import { supabase } from '../supabaseClient';
import './ChatDrawer.css';

const ChatDrawer = ({ orderId, isOpen, onClose, currentUser, otherPartyName, orderTitle }) => {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!orderId) return;

    // Fetch initial chat history
    const fetchChatHistory = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('order_id', orderId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setMessages(data || []);
      } catch (err) {
        console.error('Error fetching chat history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChatHistory();

    // Subscribe to new realtime messages
    const channel = supabase
      .channel(`order-chat-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `order_id=eq.${orderId}`
        },
        (payload) => {
          // Prevent duplicates
          setMessages((prev) => {
            if (prev.some(m => m.id === payload.new.id)) return prev;
            return [...prev, payload.new];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  // Scroll to bottom helper
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMsg.trim() || !currentUser) return;

    const messageText = newMsg.trim();
    setNewMsg('');

    try {
      const { error } = await supabase
        .from('messages')
        .insert([{
          order_id: orderId,
          sender_id: currentUser.id,
          text: messageText
        }]);

      if (error) throw error;
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message: ' + err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="chat-drawer-overlay" onClick={onClose}>
      <div className="chat-drawer card" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="chat-drawer-header">
          <div className="chat-drawer-header-left">
            <MessageSquare size={18} />
            <div>
              <h3>Chat with {otherPartyName}</h3>
              <p className="chat-drawer-subtitle">{orderTitle}</p>
            </div>
          </div>
          <button className="chat-drawer-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Message Container */}
        <div className="chat-drawer-messages">
          {loading ? (
            <div className="chat-loading">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="chat-empty">
              <MessageSquare size={32} />
              <p>No messages yet. Send a message to start coordinating!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender_id === currentUser.id;
              return (
                <div key={msg.id} className={`chat-bubble-row ${isMe ? 'chat-me' : 'chat-other'}`}>
                  <div className="chat-bubble">
                    <p className="chat-bubble-text">{msg.text}</p>
                    <span className="chat-bubble-time">
                      {new Date(msg.created_at).toLocaleTimeString('en-IN', {
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Message Input Box */}
        <form onSubmit={handleSendMessage} className="chat-drawer-input-form">
          <input
            type="text"
            placeholder="Type your message..."
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            required
          />
          <button type="submit" className="chat-send-btn" disabled={!newMsg.trim()}>
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatDrawer;
