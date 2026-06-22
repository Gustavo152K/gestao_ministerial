import React from 'react';
import { AlertTriangle, Info, X } from 'lucide-react';

function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirmação', 
  message = 'Deseja realmente prosseguir com esta ação?', 
  confirmText = 'Confirmar', 
  cancelText = 'Cancelar',
  variant = 'danger' 
}) {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: <AlertTriangle className="text-red-600 shrink-0" size={36} />,
          btn: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="text-yellow-600 shrink-0" size={36} />,
          btn: 'bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500',
        };
      default: // info / success
        return {
          icon: <Info className="text-blue-600 shrink-0" size={36} />,
          btn: 'bg-blue-800 hover:bg-blue-900 text-white focus:ring-blue-500',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="relative bg-white rounded-xl shadow-2xl border-2 border-gray-300 w-full max-w-md p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-10">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex gap-4 items-start mt-2">
          {styles.icon}
          <div>
            <h3 className="text-xl font-extrabold text-gray-900 leading-tight">
              {title}
            </h3>
            <p className="text-base text-gray-700 font-bold mt-2 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 border-t border-gray-200 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border-2 border-gray-300 font-bold text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2.5 rounded-lg font-black transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${styles.btn}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
