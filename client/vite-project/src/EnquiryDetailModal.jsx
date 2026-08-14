import { useState } from "react";

export default function EnquiryDetailModal({ enquiry, onClose, onEdit }) {
  const [copiedField, setCopiedField] = useState(null);

  if (!enquiry) return null;

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 px-6 py-5 text-white flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-blue-200">
              Enquiry #{enquiry.id || enquiry._id}
            </span>
            <h3 className="text-xl font-bold text-white mt-0.5">{enquiry.name}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
            title="Close modal"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Contact info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">
                Email Address
              </span>
              <div className="flex items-center justify-between gap-2">
                <a
                  href={`mailto:${enquiry.email}`}
                  className="text-sm font-medium text-blue-600 hover:underline truncate"
                >
                  {enquiry.email}
                </a>
                <button
                  type="button"
                  onClick={() => copyToClipboard(enquiry.email, "email")}
                  className="text-xs text-slate-500 hover:text-slate-800 shrink-0 p-1 rounded hover:bg-slate-200/60 transition-colors"
                  title="Copy email"
                >
                  {copiedField === "email" ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">
                Phone Number
              </span>
              <div className="flex items-center justify-between gap-2">
                <a
                  href={`tel:${enquiry.phone}`}
                  className="text-sm font-medium text-slate-800 hover:text-blue-600 truncate"
                >
                  {enquiry.phone}
                </a>
                <button
                  type="button"
                  onClick={() => copyToClipboard(enquiry.phone, "phone")}
                  className="text-xs text-slate-500 hover:text-slate-800 shrink-0 p-1 rounded hover:bg-slate-200/60 transition-colors"
                  title="Copy phone"
                >
                  {copiedField === "phone" ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          </div>

          {/* Submitted Date */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>Submitted on: {formatDate(enquiry.createdAt)}</span>
            {enquiry.updatedAt && enquiry.updatedAt !== enquiry.createdAt && (
              <span>Updated: {formatDate(enquiry.updatedAt)}</span>
            )}
          </div>

          {/* Message Box */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">
              Message / Request
            </label>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-800 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
              {enquiry.message}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(enquiry);
            }}
            className="px-4 py-2 text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors"
          >
            Edit Enquiry
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl shadow-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
