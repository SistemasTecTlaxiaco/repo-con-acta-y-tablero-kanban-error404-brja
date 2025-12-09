import React from 'react';

interface Notification {
  id: string;
  type: "warning" | "info" | "success" | "error";
  title: string;
  message: string;
  date: Date;
  read: boolean;
}

interface NotificationsProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
}

const Notifications: React.FC<NotificationsProps> = ({ 
  notifications, 
  onMarkAsRead, 
  onClearAll 
}) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-MX', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      case 'success': return '✅';
      case 'error': return '❌';
      default: return '📢';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'warning': return '#ffaa00';
      case 'info': return '#00aaff';
      case 'success': return '#00ff88';
      case 'error': return '#ff4444';
      default: return '#888';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notifications-page">
      <div className="section-header">
        <h1>Notificaciones</h1>
        <p>Mantente informado sobre tus actividades</p>
        
        <div className="notifications-actions">
          <button 
            className="btn-secondary"
            onClick={onClearAll}
            disabled={unreadCount === 0}
          >
            Marcar todas como leídas
          </button>
          <span className="unread-count">
            {unreadCount} no leídas
          </span>
        </div>
      </div>

      <div className="notifications-list">
        {notifications.map((notification) => (
          <div 
            key={notification.id} 
            className={`notification-item ${notification.read ? 'read' : 'unread'}`}
            onClick={() => !notification.read && onMarkAsRead(notification.id)}
          >
            <div 
              className="notification-icon"
              style={{ backgroundColor: getNotificationColor(notification.type) }}
            >
              {getNotificationIcon(notification.type)}
            </div>
            
            <div className="notification-content">
              <h3>{notification.title}</h3>
              <p>{notification.message}</p>
              <span className="notification-time">
                {formatDate(notification.date)}
              </span>
            </div>

            {!notification.read && (
              <div className="unread-indicator"></div>
            )}
          </div>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🔔</div>
          <h3>No hay notificaciones</h3>
          <p>Las notificaciones importantes aparecerán aquí</p>
        </div>
      )}
    </div>
  );
};

export default Notifications;