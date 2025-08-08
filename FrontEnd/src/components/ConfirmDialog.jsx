import React from 'react';
import { FaQuestionCircle, FaTimes } from 'react-icons/fa';
import './ConfirmDialog.css';

const ConfirmDialog = ({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  title = "Confirmar ação", 
  message, 
  confirmText = "Confirmar", 
  cancelText = "Cancelar",
  type = "warning" // warning, danger, info
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className="confirm-dialog-overlay">
      <div className="confirm-dialog">
        <div className="confirm-dialog-header">
          <div className={`confirm-dialog-icon ${type}`}>
            <FaQuestionCircle />
          </div>
          <button className="confirm-dialog-close" onClick={handleCancel}>
            <FaTimes />
          </button>
        </div>
        
        <div className="confirm-dialog-content">
          <h3 className="confirm-dialog-title">{title}</h3>
          <p className="confirm-dialog-message">{message}</p>
        </div>
        
        <div className="confirm-dialog-actions">
          <button 
            className="confirm-dialog-button cancel" 
            onClick={handleCancel}
          >
            {cancelText}
          </button>
          <button 
            className={`confirm-dialog-button confirm ${type}`} 
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
