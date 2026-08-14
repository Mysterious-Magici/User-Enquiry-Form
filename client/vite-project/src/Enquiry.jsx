import { useEffect, useRef, useState, useMemo } from "react";
import axios from "axios";
import EnquiryList from "./EnquiryList.jsx";

const API_URL = "/api/website/enquiry";

const EMPTY_FORM = { name: "", email: "", phone: "", message: "" };

const SAMPLE_DATA = [
  {
    name: "Sarah Jenkins",
    email: "sarah.jenkins@example.com",
    phone: "+1 (555) 234-5678",
    message: "Hello! I am interested in exploring your enterprise licensing options. Could we schedule a brief 15-minute consultation this week?",
  },
  {
    name: "Alex Rivera",
    email: "alex.rivera@techflow.io",
    phone: "+1 (555) 891-2345",
    message: "Hi team, we are migrating our workflows and would love more details regarding your API rate limits and webhook integrations.",
  },
  {
    name: "Elena Rostova",
    email: "elena.rostova@designworks.org",
    phone: "+44 20 7946 0912",
    message: "Great application! I have a question about custom domain setup and whether multiple submission endpoints are supported.",
  },
];

export default function Enquiry() {
  const [enquiryList, setEnquiryList] = useState([]);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [alert, setAlert] = useState(null);
  const alertTimer = useRef(null);

  const showAlert = (type, msg) => {
    setAlert({ type, msg });
    clearTimeout(alertTimer.current);
    alertTimer.current = setTimeout(() => setAlert(null), 4000);
  };

  const getEnquiry = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/read`);
      if (response.data.status === 1) {
        setEnquiryList(response.data.data || []);
      } else {
        setEnquiryList([]);
        showAlert("fail", response.data.msg || "Failed to load enquiries.");
      }
    } catch (error) {
      console.error("Error fetching enquiries:", error);
      showAlert("fail", "Unable to load enquiries. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEnquiry();
    return () => clearTimeout(alertTimer.current);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setEditingId(null);
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name || "",
      email: item.email || "",
      phone: item.phone || "",
      message: item.message || "",
    });
    setEditingId(item.id || item._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
    showAlert("info", `Editing enquiry from ${item.name}`);
  };

  const handlePrefillSample = () => {
    const randomSample = SAMPLE_DATA[Math.floor(Math.random() * SAMPLE_DATA.length)];
    setFormData(randomSample);
    showAlert("info", "Sample data loaded into the form!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic frontend validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.message.trim()) {
      showAlert("fail", "Please complete all fields before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        const response = await axios.put(`${API_URL}/update/${editingId}`, formData);
        if (response.data.status === 1) {
          showAlert("success", response.data.msg || "Enquiry updated successfully!");
          resetForm();
          getEnquiry();
        } else {
          showAlert("fail", response.data.msg || "Failed to update enquiry.");
        }
      } else {
        const response = await axios.post(`${API_URL}/insert`, formData);
        if (response.data.status === 1) {
          showAlert("success", response.data.msg || "Enquiry submitted successfully!");
          resetForm();
          getEnquiry();
        } else {
          showAlert("fail", response.data.msg || "Failed to save enquiry.");
        }
      }
    } catch (error) {
      console.error("Error saving enquiry:", error);
      showAlert(
        "fail",
        error.response?.data?.msg || "Something went wrong while submitting. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const deleteEnquiry = async (id) => {
    setDeletingId(id);
    try {
      const response = await axios.delete(`${API_URL}/delete/${id}`);
      if (response.data.status === 1) {
        showAlert("success", response.data.msg || "Enquiry deleted successfully.");
        if (editingId === id) resetForm();
        getEnquiry();
      } else {
        showAlert("fail", response.data.msg || "Failed to delete enquiry.");
      }
    } catch (error) {
      console.error("Error deleting enquiry:", error);
      showAlert("fail", "Failed to delete enquiry from database.");
    } finally {
      setDeletingId(null);
    }
  };

  // Metrics summary
  const todayCount = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return enquiryList.filter((item) => item.createdAt?.startsWith(today)).length;
  }, [enquiryList]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 text-slate-800">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                User Enquiry Portal
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Public & Free
                </span>
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                Instant submission &amp; real-time management powered by Netlify
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live Database</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Toast Alert */}
        {alert && (
          <div
            className={`p-4 rounded-xl shadow-md border flex items-center justify-between gap-3 animate-fade-in ${
              alert.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : alert.type === "fail"
                ? "bg-rose-50 border-rose-200 text-rose-900"
                : "bg-blue-50 border-blue-200 text-blue-900"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {alert.type === "success" ? (
                <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : alert.type === "fail" ? (
                <svg className="w-5 h-5 text-rose-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-blue-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span className="text-sm font-semibold">{alert.msg}</span>
            </div>
            <button
              type="button"
              onClick={() => setAlert(null)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              title="Dismiss notification"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Stats Overview */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Enquiries</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">
                {loading ? "--" : enquiryList.length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Today&apos;s Submissions</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">
                {loading ? "--" : todayCount}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Access Tier</p>
              <p className="text-2xl font-extrabold text-emerald-600 mt-1">Free &amp; Open</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
        </section>

        {/* Main Grid: Form + List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Column */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 sticky top-24">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingId ? "Update Enquiry" : "Submit Enquiry"}
                </h2>
                <p className="text-xs text-slate-500">
                  {editingId
                    ? `Modifying entry #${editingId}`
                    : "Fill out the form below to submit a message"}
                </p>
              </div>

              {!editingId && (
                <button
                  type="button"
                  onClick={handlePrefillSample}
                  className="px-2.5 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1"
                  title="Click to fill sample details"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Demo Fill
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name field */}
              <div>
                <label htmlFor="name" className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Jane Doe"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 transition-all placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Email field */}
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g. jane@example.com"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 transition-all placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Phone field */}
              <div>
                <label htmlFor="phone" className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. +1 555-0199"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 transition-all placeholder-slate-400 font-mono"
                  />
                </div>
              </div>

              {/* Message field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="message" className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                    Message / Enquiry <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {formData.message.length}/1000
                  </span>
                </div>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Describe your inquiry, feedback, or request in detail..."
                  required
                  maxLength={1000}
                  rows={4}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 transition-all placeholder-slate-400 resize-none leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 shadow-sm shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                >
                  {submitting && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {submitting
                    ? editingId
                      ? "Updating..."
                      : "Saving..."
                    : editingId
                    ? "Save Changes"
                    : "Submit Enquiry"}
                </button>

                {editingId ? (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="py-2.5 px-4 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                ) : (
                  formData.name || formData.email || formData.phone || formData.message ? (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                    >
                      Clear
                    </button>
                  ) : null
                )}
              </div>
            </form>
          </div>

          {/* List Column */}
          <div className="lg:col-span-7">
            <EnquiryList
              enquiryList={enquiryList}
              loading={loading}
              editEnquiry={handleEdit}
              deleteEnquiry={deleteEnquiry}
              deletingId={deletingId}
              refreshEnquiries={getEnquiry}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
