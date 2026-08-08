import React, { useState, useEffect } from "react";
import api from "../api/api";

const ButtonSpinner = () => (
  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
);

const AccountantNotice = () => {
  const [parents, setParents] = useState([]);
  const [filteredParents, setFilteredParents] = useState([]);
  const [searchParent, setSearchParent] = useState("");
  const [sendMode, setSendMode] = useState("single");
  const [selectedParentId, setSelectedParentId] = useState("");

  const [formData, setFormData] = useState({ title: "", message: "" });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // ✅ Load parents safely
  useEffect(() => {
    const fetchParents = async () => {
      try {
        console.log("Fetching parents from: parents/");
        const res = await api.get("parents/");
        console.log(res)
  

        const parentList = Array.isArray(res.data) 
          ? res.data 
          : res.data?.results || [];

        console.log("Parsed parent list:", parentList);
        setParents(parentList);
      } catch (err) {
        console.error("Failed to load parents:", err);
        setError("Could not load parent list. Check API endpoint.");
      }
    };
    fetchParents();
  }, []);

  // Filter parents safely
  useEffect(() => {
    if (!searchParent.trim() || !parents.length) {
      setFilteredParents([]);
      return;
    }
    const term = searchParent.toLowerCase();
    const filtered = parents.filter(p =>
      p.parent_name?.toLowerCase().includes(term) || p.parent_phone?.includes(term)
    );
    setFilteredParents(filtered);
  }, [searchParent, parents]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccess("");
    setError("");
  };

  const handleSelectParent = (parent) => {
    setSelectedParentId(parent.parent_user_id);
    setSearchParent(parent.parent_name);
    setFilteredParents([]);
  };

  const handleReset = () => {
    setFormData({ title: "", message: "" });
    setSearchParent("");
    setSelectedParentId("");
    setSendMode("single");
    setSuccess("");
    setError("");
  };

const handleSubmit = async (e) => {
    e.preventDefault();

    // Resolve the recipient: use the clicked parent, or auto-match the typed name
    let recipientId = selectedParentId;
    if (sendMode === "single") {
      if (!recipientId && searchParent.trim()) {
        const term = searchParent.trim().toLowerCase();
        const match = parents.find(
          (p) =>
            p.parent_name?.toLowerCase() === term ||
            p.parent_phone === searchParent.trim()
        );
        if (match) recipientId = match.parent_user_id;
      }
      if (!recipientId) {
        setError("Please select a parent from the list first.");
        return;
      }
    }
    if (!formData.title.trim() || !formData.message.trim()) {
      setError("Title and message are required.");
      return;
    }

    setSubmitting(true);
    setSuccess("");
    setError("");

    try {
      console.log("Sending announcement to: anouncements/");
      console.log("Send Mode:", sendMode, "| Selected Parent ID:", recipientId);

      // ✅ Build payload: single mode sends `recipient`, broadcast mode sends target only
      const payload = {
        title: formData.title,
        message: formData.message,
        priority: "Normal",
        target: "Parents", // Both modes target Parents
        recipient: sendMode === "single" ? recipientId : null // ✅ Specific parent user id or null for broadcast
      };

      console.log("📤 Final Payload Sent:", payload);
      const res = await api.post("anouncements/", payload);

      console.log("✅ Send response status:", res.status);
      console.log("✅ Send response data:", res.data);

      if (res.status === 200 || res.status === 201) {
        const successText = sendMode === "all"
          ? "✅ Announcement broadcast to ALL Parents successfully!"
          : "✅ Announcement sent to selected parent successfully!";
        setSuccess(successText);
        handleReset();
      } else {
        throw new Error(`Unexpected status code: ${res.status}`);
      }

    } catch (err) {
      console.error("❌ Send failed:", err);
      const msg = err.response?.data?.detail 
        || err.response?.data?.message 
        || err.message 
        || "❌ Failed to send announcement. Try again.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="card">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Send Fee Announcement</h1>
        <p className="text-gray-500 mt-2 text-sm">Send fee reminders & finance notices to parents</p>
      </div>

      {error && <div className="card bg-red-50 border border-red-200 text-red-700 p-4 rounded font-medium">{error}</div>}
      {success && <div className="card bg-green-50 border border-green-200 text-green-700 p-4 rounded font-medium">{success}</div>}

      <div className="card max-w-2xl mx-auto relative">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Send Mode Toggle */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="sendMode"
                checked={sendMode === "single"}
                onChange={() => setSendMode("single")}
              /> Targeted Parent Notice
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="sendMode"
                checked={sendMode === "all"}
                onChange={() => setSendMode("all")}
              /> Broadcast All Parents
            </label>
          </div>

          {/* Parent Search — only when single mode */}
          {sendMode === "single" && (
            <div>
              <label className="form-label">Select Parent *</label>
              <input
                type="text"
                placeholder="Search by parent name or phone..."
                className="milk-input w-full"
                value={searchParent}
                onChange={(e) => {
                  setSearchParent(e.target.value);
                  setSelectedParentId("");
                }}
onFocus={() => {
                  if (parents.length) {
                    const term = searchParent.toLowerCase().trim();
                    setFilteredParents(
                      parents.filter(p =>
                        !term ||
                        p.parent_name?.toLowerCase().includes(term) ||
                        p.parent_phone?.includes(term)
                      )
                    );
                  }
                }}
                onBlur={() => setTimeout(() => setFilteredParents([]), 200)}
                required
              />
              {filteredParents.length > 0 && (
                <div className="absolute z-20 w-full bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto mt-1">
{filteredParents.map((p) => (
                    <button
                      key={p.parent_user_id}
                      type="button"
                      className="w-full text-left p-3 hover:bg-blue-50 border-b last:border-b-0"
                      onClick={() => handleSelectParent(p)}
                    >
                      <p className="font-medium">{p.parent_name}</p>
                      <p className="text-sm text-gray-500">{p.parent_phone || "No phone"}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div>
            <label className="form-label">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Example: Term 2 Fee Payment Reminder"
              className="milk-input w-full"
              required
            />
          </div>

          <div>
            <label className="form-label">Message Content *</label>
            <textarea
              name="message"
              rows="8"
              value={formData.message}
              onChange={handleChange}
              placeholder="Dear Parent, kindly clear your pending fees..."
              className="milk-input w-full resize-none"
              required
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
            >
              Clear
            </button>
<button
              type="submit"
              className="px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition"
              disabled={submitting}
            >
              {submitting && <ButtonSpinner />}
              {submitting ? "Sending..." : "Send Announcement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountantNotice;