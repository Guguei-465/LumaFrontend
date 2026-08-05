import React, { useState } from "react";

const AccountantNotice = () => {
  const [formData, setFormData] = useState({
    parentName: "",
    title: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);

    // TODO:
    // POST to your Django notification endpoint
    // axios.post("/api/notifications/", formData)

    alert("Notice sent successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Send Fee Notice
        </h1>
        <p className="text-gray-500 mt-2">
          Send fee reminders, payment instructions, and other finance-related
          notices directly to parents.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Parent */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Parent Name
            </label>

            <input
              type="text"
              name="parentName"
              value={formData.parentName}
              onChange={handleChange}
              placeholder="Enter parent's name"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
              required
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notice Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Example: Fee Payment Reminder"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
              required
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>

            <textarea
              name="message"
              rows="8"
              value={formData.message}
              onChange={handleChange}
              placeholder="Dear Parent,

Your child's school fee balance for this term is due on or before 15th August 2026.

Kindly make payment through the school's approved payment methods.

Thank you for your cooperation."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 resize-none focus:ring-2 focus:ring-green-500 focus:outline-none"
              required
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="reset"
              className="px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
            >
              Clear
            </button>

            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition"
            >
              <i className="bi bi-send-fill mr-2"></i>
              Send Notice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountantNotice;