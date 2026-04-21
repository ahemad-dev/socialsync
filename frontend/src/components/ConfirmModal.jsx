import React from "react";

export default function ConfirmModal({ isOpen, onClose, onConfirm, eventTitle }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-xl w-96 animate-fadeInUp">
        <h3 className="text-xl font-semibold text-white mb-3">Confirm Delete</h3>
        <p className="text-white/80 mb-6">
          ⚠️ Are you sure you want to delete{" "}
          <span className="font-bold text-red-400">"{eventTitle}"</span>?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-500/30 hover:bg-gray-500/50 text-white transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-700 hover:opacity-90 text-white shadow-lg transition"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}
