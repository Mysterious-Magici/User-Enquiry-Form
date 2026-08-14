import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  Label,
  Spinner,
  TextInput,
  Textarea,
} from "flowbite-react";
import axios from "axios";
import EnquiryList from "./EnquiryList.jsx";

const API_URL = "http://localhost:8000/api/website/enquiry";

const EMPTY_FORM = { name: "", email: "", phone: "", message: "" };

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
    alertTimer.current = setTimeout(() => setAlert(null), 3500);
  };

  const getEnquiry = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/read`);
      setEnquiryList(response.data.status === 1 ? response.data.data : []);
      if (response.data.status !== 1) {
        showAlert("fail", response.data.msg || "Failed to load enquiries.");
      }
    } catch (error) {
      console.error("Error fetching enquiries:", error);
      showAlert("fail", "Unable to load enquiries. Please try again.");
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      email: item.email,
      phone: item.phone,
      message: item.message,
    });
    setEditingId(item._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        const response = await axios.put(
          `${API_URL}/update/${editingId}`,
          formData
        );
        if (response.data.status === 1) {
          showAlert("success", response.data.msg || "Enquiry updated successfully.");
          resetForm();
          getEnquiry();
        } else {
          showAlert("fail", response.data.msg || "Failed to update enquiry.");
        }
      } else {
        const response = await axios.post(`${API_URL}/insert`, formData);
        if (response.data.status === 1) {
          showAlert("success", response.data.msg || "Enquiry saved successfully.");
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
        error.response?.data?.msg || "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const deleteEnquiry = async (id) => {
    if (!window.confirm("Are you sure you want to delete this enquiry?")) {
      return;
    }
    setDeletingId(id);
    try {
      const response = await axios.delete(`${API_URL}/delete/${id}`);
      if (response.data.status === 1) {
        showAlert("success", response.data.msg || "Enquiry deleted successfully.");
        getEnquiry();
      } else {
        showAlert("fail", response.data.msg || "Failed to delete enquiry.");
      }
    } catch (error) {
      console.error("Error deleting enquiry:", error);
      showAlert("fail", "Failed to delete enquiry.");
    } finally {
      setDeletingId(null);
    }
  };
return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {alert && (
        <div className="mx-auto mb-2 max-w-6xl">
          <Alert
            color={alert.type === "success" ? "success" : "failure"}
            onDismiss={() => setAlert(null)}
          >
            {alert.msg}
          </Alert>
        </div>
      )}

      <h1 className="py-6 text-center text-[40px] font-extrabold tracking-tight text-[#0A2A92]">
        User Enquiry
      </h1>

      <div className="mx-auto grid grid-cols-1 gap-10 md:grid-cols-2 max-w-6xl">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 self-start">
          <h2 className="mb-4 text-[20px] font-bold text-[#0A2A92]">
            {editingId ? "Edit Enquiry" : "Enquiry Form"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="py-3">
              <Label
                htmlFor="name"
                value="Name"
                className="mb-1 block font-semibold text-slate-700"
              />
              <TextInput
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="py-3">
              <Label
                htmlFor="email"
                value="Email"
                className="mb-1 block font-semibold text-slate-700"
              />
              <TextInput
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="py-3">
              <Label
                htmlFor="phone"
                value="Phone"
                className="mb-1 block font-semibold text-slate-700"
              />
              <TextInput
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div className="py-3">
              <Label
                htmlFor="message"
                value="Message"
                className="mb-1 block font-semibold text-slate-700"
              />
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Write your message"
                required
                rows={5}
              />
            </div>
<div className="flex flex-col gap-3 py-3">
              <Button
                type="submit"
                color="success"
                disabled={submitting}
                className="w-full font-bold"
              >
                {submitting && <Spinner size="sm" className="mr-2" />}
                {submitting
                  ? editingId
                    ? "Updating..."
                    : "Saving..."
                  : editingId
                  ? "Update Enquiry"
                  : "Submit"}
              </Button>

              {editingId && (
                <Button
                  type="button"
                  color="gray"
                  onClick={resetForm}
                  className="w-full font-bold"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </div>

        <EnquiryList
          enquiryList={enquiryList}
          loading={loading}
          editEnquiry={handleEdit}
          deleteEnquiry={deleteEnquiry}
          deletingId={deletingId}
        />
      </div>
    </div>
  );
}
