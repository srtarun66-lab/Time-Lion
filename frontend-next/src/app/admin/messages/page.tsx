'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'messages'));
      const allMessages = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      allMessages.sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setMessages(allMessages);
    } catch {
      window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: 'Failed to load messages.', type: 'error' } }));
    }
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, []);

  const toggleReadStatus = async (msgId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'read' ? 'unread' : 'read';
      await updateDoc(doc(db, 'messages', msgId), { status: newStatus });
      fetchMessages();
    } catch {
      window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: 'Failed to update status.', type: 'error' } }));
    }
  };

  const deleteMessage = async (msgId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      await deleteDoc(doc(db, 'messages', msgId));
      window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: 'Message deleted.', type: 'success' } }));
      fetchMessages();
    } catch {
      window.dispatchEvent(new CustomEvent('showToast', { detail: { msg: 'Failed to delete.', type: 'error' } }));
    }
  };

  return (
    <div className="fade-up">
      <div className="pg-title">Customer Messages</div>
      <div className="pg-sub">View and manage inquiries from the Contact page</div>

      <div className="cbox" style={{ minHeight: 'calc(100vh - 220px)' }}>
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Status</th>
                <th>Sender</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr key="loading">
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px 0' }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', margin: '0 auto 12px',
                      border: '2px solid rgba(201,168,76,0.15)',
                      borderTopColor: 'var(--teal)',
                      animation: 'spin 0.8s linear infinite',
                    }} />
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    <div style={{ color: 'var(--muted)', fontSize: 12 }}>Loading messages…</div>
                  </td>
                </tr>
              ) : messages.length === 0 ? (
                <tr key="empty">
                  <td colSpan={6} style={{ textAlign: 'center', height: '60vh', color: 'var(--muted)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 24 }}>
                      <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--teal)', opacity: 0.5 }}>
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                      <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text)', letterSpacing: '0.05em' }}>No Messages</div>
                      <div style={{ fontSize: 16, maxWidth: 450, margin: '0 auto', lineHeight: 1.5 }}>
                        There are no inquiries from customers yet.
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                messages.map((m) => (
                  <tr key={m.id} style={{ opacity: m.status === 'read' ? 0.6 : 1 }}>
                    <td>
                      <button onClick={() => toggleReadStatus(m.id, m.status)} style={{
                        background: m.status === 'read' ? 'transparent' : 'var(--teal)',
                        border: m.status === 'read' ? '1px solid var(--border)' : 'none',
                        color: m.status === 'read' ? 'var(--muted)' : '#000',
                        padding: '4px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: 'pointer',
                        textTransform: 'uppercase'
                      }}>
                        {m.status || 'unread'}
                      </button>
                    </td>
                    <td>
                      <div style={{ color: 'var(--text)', fontWeight: 600 }}>{m.name}</div>
                      <div style={{ color: 'var(--muted)', fontSize: 12 }}>{m.email}</div>
                      <div style={{ color: 'var(--muted)', fontSize: 12 }}>{m.phone}</div>
                    </td>
                    <td style={{ color: 'var(--gold)', fontWeight: 600, fontSize: 13, textTransform: 'capitalize' }}>
                      {m.subject || 'General'}
                    </td>
                    <td style={{ maxWidth: 300 }}>
                      <div style={{ color: 'var(--text-sub)', fontSize: 13, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {m.message}
                      </div>
                    </td>
                    <td style={{ color: 'var(--muted)', fontSize: 12 }}>
                      {m.createdAt ? new Date(m.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Unknown'}
                    </td>
                    <td>
                      <button
                        onClick={() => deleteMessage(m.id)}
                        style={{
                          background: 'rgba(255,68,102,0.06)', border: '1px solid rgba(255,68,102,0.2)',
                          color: '#f43f5e', padding: '6px 14px', borderRadius: 8,
                          cursor: 'pointer', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', transition: '0.2s ease',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,68,102,0.14)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,68,102,0.06)'}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
