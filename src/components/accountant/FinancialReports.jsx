import React, { useState } from "react";
import api from "../api/api";

// --- Reusable Spinners ---
const Spinner = () => (
  <div className="flex justify-center items-center h-80">
    <div className="animate-spin rounded-full h-12 w-12 border-b-3 border-green-600"></div>
  </div>
);

const ButtonSpinner = () => (
  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
);

const FinancialReports = () => {
  const [reportType, setReportType] = useState("income"); // income / expenses / collection / profit-loss
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [term, setTerm] = useState("");
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // --- Generate Report ---
  const generateReport = async (e) => {
    e.preventDefault();
    if (!dateFrom || !dateTo) return setError("Please select start & end date.");

    try {
      setLoading(true);
      setError(""); setSuccess("");
      setReportData(null);

      const params = new URLSearchParams({
        type: reportType,
        date_from: dateFrom,
        date_to: dateTo,
        ...(term && { term })
      });

      const res = await api.get(`reports/generate/?${params}`);
      console.log("Generated report:", res.data);
      setReportData(res.data);
      setSuccess("Report generated successfully!");
    } catch (err) {
      console.error("Report failed:", err);
      setError("Could not generate report. Check your filters.");
    } finally {
      setLoading(false);
    }
  };

  // --- Export Report ---
  const exportReport = async (format) => {
    try {
      setExporting(true);
      setSuccess(""); setError("");

      const params = new URLSearchParams({
        type: reportType,
        date_from: dateFrom,
        date_to: dateTo,
        ...(term && { term }),
        format
      });

      const res = await api.get(`reports/export/?${params}`, { responseType: "blob" });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${reportType}_report_${dateFrom}_${dateTo}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setSuccess(`Report exported as ${format.toUpperCase()} successfully!`);
    } catch (err) {
      setError(`Failed to export as ${format}. Try again.`);
    } finally {
      setExporting(false);
    }
  };

  // --- Summary Card Component ---
  const SummaryCard = ({ label, value, color }) => (
    <div className={`card p-4 border-l-4 ${color}`}>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-xl font-bold mt-1">{value}</p>
    </div>
  );

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="card">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Financial Reports</h1>
        <p className="text-gray-500 mt-1 text-sm">Generate, preview & download official financial statements</p>
      </div>

      {/* Status Messages */}
      {error && <div className="card bg-red-50 border border-red-200 text-red-700 p-4">{error}</div>}
      {success && <div className="card bg-green-50 border border-green-200 text-green-700 p-4">{success}</div>}

      {/* --- Report Filter Form --- */}
      <div className="card">
        <form onSubmit={generateReport} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="form-lable">Report Type *</label>
              <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="milk-input w-full">
                <option value="income">💰 Income / Fee Collections</option>
                <option value="expenses">💸 Expense Summary</option>
                <option value="collection">📊 Fee Collection Status</option>
                <option value="profit-loss">📉 Profit & Loss Statement</option>
              </select>
            </div>

            <div>
              <label className="form-lable">Start Date *</label>
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="milk-input w-full" required />
            </div>

            <div>
              <label className="form-lable">End Date *</label>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="milk-input w-full" required />
            </div>

            <div>
              <label className="form-lable">Academic Term</label>
              <select value={term} onChange={(e) => setTerm(e.target.value)} className="milk-input w-full">
                <option value="">All Terms</option>
                <option value="Term 1">Term 1</option>
                <option value="Term 2">Term 2</option>
                <option value="Term 3">Term 3</option>
              </select>
            </div>
          </div>

          <button type="submit" className="milk-btn" disabled={loading}>
            {loading && <ButtonSpinner />} {loading ? "Generating..." : "🔍 Generate Report"}
          </button>
        </form>
      </div>

      {/* --- Export Buttons --- */}
      {reportData && (
        <div className="card flex flex-wrap gap-3 items-center">
          <p className="font-medium text-gray-700">Export as:</p>
          <button onClick={() => exportReport("pdf")} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700" disabled={exporting}>
            {exporting ? <ButtonSpinner /> : null} PDF Document
          </button>
          <button onClick={() => exportReport("xlsx")} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700" disabled={exporting}>
            {exporting ? <ButtonSpinner /> : null} Excel Spreadsheet
          </button>
          <button onClick={() => exportReport("csv")} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" disabled={exporting}>
            {exporting ? <ButtonSpinner /> : null} CSV File
          </button>
        </div>
      )}

      {/* --- Report Preview --- */}
      {loading ? <Spinner /> : reportData && (
        <div className="card space-y-6">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
            {reportType.replace("-"," ").toUpperCase()} — {new Date(dateFrom).toLocaleDateString()} to {new Date(dateTo).toLocaleDateString()}
            {term && ` | ${term}`}
          </h2>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reportData.total_income && <SummaryCard label="Total Income" value={`KSh ${reportData.total_income.toLocaleString()}`} color="border-green-500 bg-green-50" />}
            {reportData.total_expenses && <SummaryCard label="Total Expenses" value={`KSh ${reportData.total_expenses.toLocaleString()}`} color="border-red-500 bg-red-50" />}
            {reportData.net_balance && <SummaryCard label="Net Balance" value={`KSh ${reportData.net_balance.toLocaleString()}`} color={reportData.net_balance >=0 ? "border-blue-500 bg-blue-50" : "border-red-500 bg-red-50"} />}
            {reportData.collected && <SummaryCard label="Amount Collected" value={`KSh ${reportData.collected.toLocaleString()}`} color="border-green-500" />}
            {reportData.pending && <SummaryCard label="Amount Pending" value={`KSh ${reportData.pending.toLocaleString()}`} color="border-yellow-500" />}
            {reportData.collection_rate && <SummaryCard label="Collection Rate" value={`${reportData.collection_rate}%`} color="border-indigo-500" />}
          </div>

          {/* Detailed Table */}
          {reportData.details && reportData.details.length > 0 && (
            <div className="overflow-x-auto mt-6">
              <h3 className="font-medium text-gray-700 mb-3">Detailed Breakdown</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    {Object.keys(reportData.details[0]).map(key => (
                      <th key={key} className="p-3 text-left border-b capitalize">{key.replace("_"," ")}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {reportData.details.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      {Object.values(row).map((val, i) => (
                        <td key={i} className="p-3 border-b">{typeof val === "number" ? `KSh ${val.toLocaleString()}` : val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FinancialReports;