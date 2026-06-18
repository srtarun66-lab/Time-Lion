import React from 'react';

async function fetchDashboardData() {
  try {
    const [dashRes, statsRes] = await Promise.all([
      fetch('http://127.0.0.1:5000/api/admin/dashboard', { cache: 'no-store' }),
      fetch('http://127.0.0.1:5000/api/orders/stats', { cache: 'no-store' })
    ]);
    const dash = dashRes.ok ? await dashRes.json() : {};
    const stats = statsRes.ok ? await statsRes.json() : {};
    return { dash, stats };
  } catch {
    return { dash: null, stats: null };
  }
}

const StatCard = ({ label, value, accent = false, sub }: { label: string; value: string | number; accent?: boolean; sub?: string }) => (
  <div style={{
    background: 'var(--bg2)',
    border: `1px solid ${accent ? 'rgba(25,211,197,0.2)' : 'var(--border)'}`,
    borderRadius: 16,
    padding: '24px 26px',
    position: 'relative',
    overflow: 'hidden',
  }}>
    {accent && (
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: 'linear-gradient(90deg, var(--teal), transparent)',
      }} />
    )}
    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>
      {label}
    </div>
    <div style={{
      fontFamily: 'var(--font-premium)',
      fontSize: 36,
      fontWeight: 700,
      color: accent ? 'var(--teal)' : 'var(--text)',
      lineHeight: 1,
      letterSpacing: '0.02em',
    }}>
      {value}
    </div>
    {sub && <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>{sub}</div>}
  </div>
);

export default async function DashboardPage() {
  const { dash, stats } = await fetchDashboardData();

  if (!dash || !stats) {
    return (
      <div className="fade-up">
        <div className="pg-title">Dashboard</div>
        <div className="pg-sub">Live store overview</div>
        <div style={{
          background: 'rgba(255,68,102,0.06)', border: '1px solid rgba(255,68,102,0.2)',
          borderRadius: 12, padding: '16px 20px', color: 'var(--danger)', fontSize: 14,
          display: 'flex', alignItems: 'center', gap: 10
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          Backend offline — could not load dashboard data.
        </div>
      </div>
    );
  }

  const processingCount = (stats.byStatus || []).find((s: { _id: string; count: number }) => s._id === 'Processing')?.count || 0;

  return (
    <div className="fade-up">
      <div className="pg-title">Dashboard</div>
      <div className="pg-sub">Live store overview</div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 16, marginBottom: 40 }}>
        <StatCard label="Total Orders" value={dash.totalOrders || 0} accent />
        <StatCard label="Revenue" value={`₹${(dash.revenue || 0).toLocaleString('en-IN')}`} />
        <StatCard label="Products" value={dash.totalProducts || 0} />
        <StatCard label="Pending" value={processingCount} sub="awaiting confirmation" />
      </div>

      {/* Recent Orders Table */}
      <div className="cbox">
        <div className="cbox-hd">
          <h3>Recent Orders</h3>
        </div>
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {(!dash.recentOrders || dash.recentOrders.length === 0) ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '32px 0', color: 'var(--muted)' }}>No orders yet.</td>
                </tr>
              ) : (
                dash.recentOrders.map((o: { _id: string; orderId?: string; name: string; product?: string; items?: { name: string }[]; totalAmount: number; paymentMode?: string; status: string; createdAt: string }) => (
                  <tr key={o._id}>
                    <td style={{ color: 'var(--teal)', fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.05em' }}>
                      {o.orderId || o._id.slice(-8).toUpperCase()}
                    </td>
                    <td style={{ color: 'var(--text)', fontWeight: 500 }}>{o.name}</td>
                    <td style={{ fontSize: 12 }}>{o.product || o.items?.[0]?.name || '—'}</td>
                    <td style={{ color: 'var(--text)', fontWeight: 600 }}>₹{(o.totalAmount || 0).toLocaleString('en-IN')}</td>
                    <td>
                      <span style={{ color: o.paymentMode === 'Online' ? 'var(--gold)' : 'var(--muted)', fontWeight: 600, fontSize: 12 }}>
                        {o.paymentMode || 'COD'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge b-${(o.status || '').toLowerCase()}`}>{o.status}</span>
                    </td>
                    <td style={{ color: 'var(--muted)', fontSize: 12 }}>
                      {new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
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
