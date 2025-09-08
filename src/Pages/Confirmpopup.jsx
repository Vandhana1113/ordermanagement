import React from "react";
import { XCircle, AlertTriangle, Info } from "lucide-react"; // ✅ icons

const ConfirmPopup = ({ title, message, onConfirm, onCancel, danger }) => {
  return (
    <div className="fixed inset-0  bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
      {/* Popup Card */}
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-96 transform transition-all duration-300 scale-95 hover:scale-100 animate-fadeIn">
        
        {/* Icon + Title */}
        <div className="flex items-center gap-3 mb-4">
          {danger ? (
            <AlertTriangle className="w-8 h-8 text-red-600" />
          ) : (
            <Info className="w-8 h-8 text-blue-600" />
          )}
          <h2
            className={`text-xl font-bold ${
              danger ? "text-red-600" : "text-gray-800"
            }`}
          >
            {title}
          </h2>
        </div>

        {/* Message */}
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">{message}</p>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium shadow-sm transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-5 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-medium shadow hover:from-green-600 hover:to-green-700 transition ${
              danger
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPopup;
