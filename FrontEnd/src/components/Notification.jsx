import React, { useEffect } from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';
import './Notification.css';

const Notification = ({ 
  message, 
  type = 'success', 
  isOpen, 
  onClose, 
  duration = 4000,
  title = null 
}) => {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="notification-icon success" />;
      case 'error':
        return <FaExclamationTriangle className="notification-icon error" />;
      case 'warning':
        return <FaExclamationTriangle className="notification-icon warning" />;
      case 'info':
        return <FaInfoCircle className="notification-icon info" />;
      default:
        return <FaInfoCircle className="notification-icon info" />;
    }
  };

  const getTitle = () => {
    if (title) return title;
    switch (type) {
      case 'success':
        return 'Sucesso!';
      case 'error':
        return 'Erro!';
      case 'warning':
        return 'Atenção!';
      case 'info':
        return 'Informação';
      default:
        return 'Notificação';
    }
  };

  return (
    <div className={`notification notification-${type} ${isOpen ? 'show' : ''}`}>
      <div className="notification-content">
        {getIcon()}
        <div className="notification-text">
          <h4>{getTitle()}</h4>
          <p>{message}</p>
        </div>
        <button className="notification-close" onClick={onClose}>
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

export default Notification;
