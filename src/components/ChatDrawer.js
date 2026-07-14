import React, { useState, useEffect, useRef } from 'react';
import { X, Send, MessageSquare } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { suggestChatResponse } from '../utils/aiEngine';
import './ChatDrawer.css';

const ChatDrawer = ({ orderId, isOpen, onClose, currentUser, otherPartyName, orderTitle }) => {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [role, setRole] = useState('seller');
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!orderId || !currentUser) return;

    // Mark messages as read
    const markAsRead = async () => {
      try {
        await supabase
          .from('messages')
          .update({ read: true })
          .eq('order_id', orderId)
          .neq('sender_id', currentUser.id)
          .eq('read', false);
      } catch (err) {
        console.error('Error marking messages as read:', err);
      }
    };

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
        await markAsRead();
      } catch (err) {
        console.error('Error fetching chat history:', err);
      } finally {
        setLoading(false);
      }
    };

    // Fetch product details for AI negotiation
    const fetchOrderDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            products (*)
          `)
          .eq('id', orderId)
          .single();
        if (error) throw error;
        if (data) {
          setProduct(data.products);
          if (data.buyer_id === currentUser.id) {
            setRole('buyer');
          } else {
            setRole('seller');
          }
        }
      } catch (err) {
        console.error('Error fetching order product info:', err);
      }
    };

    fetchChatHistory();
    fetchOrderDetails();

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
          // Mark as read if received from other party
          if (payload.new.sender_id !== currentUser.id) {
            markAsRead();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, currentUser]);

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

  const handleSuggestResponse = (style) => {
    if (!product) return;
    const lastMsgText = messages.length > 0 ? messages[messages.length - 1].text : '';
    const suggestion = suggestChatResponse(lastMsgText, product, role, style);
    setNewMsg(suggestion);
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

        {/* AI Copilot Suggestion Bar */}
        {product && (
          <div className="chat-drawer-ai-copilot">
            <span className="copilot-lbl">✨ AI Copilot:</span>
            <button type="button" className="copilot-btn" onClick={() => handleSuggestResponse('counter')}>Counter</button>
            <button type="button" className="copilot-btn" onClick={() => handleSuggestResponse('firm')}>Firm</button>
            <button type="button" className="copilot-btn" onClick={() => handleSuggestResponse('bundle')}>Bulk Bundle</button>
          </div>
        )}

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
