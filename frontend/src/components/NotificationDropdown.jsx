import React, { useState, useEffect } from 'react';
import { Bell, Check, ExternalLink } from 'lucide-react';
import API from '../services/api';
import { Link } from 'react-router-dom';

export const NotificationDropdown = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifs = () => {
    API.get('/notifications')
      .then((res) => {
        if (res.success) {
          setNotifications(res.data || []);
          setUnreadCount(res.data.filter((n) => !n.isRead).length);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (e) {}
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-[#0B132B]">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 rounded-xl glass-panel shadow-2xl z-50 border border-slate-700/60 overflow-hidden animate-fadeIn">
          <div className="p-3 border-b border-slate-700/60 flex items-center justify-between bg-slate-900/60">
            <span className="font-semibold text-sm text-slate-100 flex items-center gap-2">
              <Bell className="w-4 h-4 text-cyan-400" /> Notifications
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {unreadCount} unread
            </span>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No notifications yet
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 text-xs flex gap-3 transition-colors ${
                    n.isRead ? 'bg-slate-900/30 text-slate-400' : 'bg-slate-800/50 text-slate-200'
                  }`}
                >
                  <div className="flex-1 space-y-1">
                    <div className="font-semibold text-slate-100 flex items-center justify-between">
                      <span>{n.title}</span>
                      {!n.isRead && (
                        <button
                          onClick={() => markAsRead(n.id)}
                          className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                          title="Mark read"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <p className="text-slate-300 leading-relaxed">{n.message}</p>
                    {n.clusterId && (
                      <Link
                        to={`/citizen/issues/${n.clusterId}`}
                        onClick={() => setOpen(false)}
                        className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:underline font-medium mt-1"
                      >
                        View Details <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
