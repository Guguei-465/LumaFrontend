import React, { useEffect, useState } from "react";
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

const StudentLedger = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchStudent, setSearchStudent] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [ledgerData, setLedgerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingLedger, setFetchingLedger] = useState(false);
  const [error, setError] = useState("");

  // --- Load student list ---
  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true);
        const res = await api.get("students/");
        setStudents(res.data || []);
      } catch (err) {
        setError("Could not load student list.");
      } finally {
        setLoading(false);
      }
    };
    loadStudents();
  }, []);

  // --- Filter students as typing ---
  useEffect(() => {
    if (!searchStudent.trim()) return setFilteredStudents([]);
    const term = searchStudent.toLowerCase();
    const filtered = students.filter(s =>
      s.name?.toLowerCase().includes(term) || s.admission_number?.toLowerCase().includes(term)
    );
    setFilteredStudents(filtered);
  }, [searchStudent, students]);

  // --- Fetch ledger when student selected ---
  const fetchLedger = async (student) => {
    setSelectedStudent(student);
    setSearchStudent(student.name);
    setError(""); setLedgerData(null);

    try {
      setFetchingLedger(true);
      const res = await api.get(`fees/student-ledger/${student.id}/`);
      setLedgerData(res.data);
    } catch (err) {
      setError("Failed to load student financial history.");
    } finally {
      setFetchingLedger(false);
    }
  };

  // --- Print statement ---
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="card">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Student Financial Ledger</h1>
        <p className="text-gray-500 mt-1 text-sm">Full history of fees, payments & running balance</p>
      </div>

      {error && <div className="card bg-red-50 border border-red-200 text-red-700 p-4">{error}</div>}

      {/* --- Search & Select Student --- */}
      <div className="card max-w-xl relative">
        <label className="form-lable">Search Student (Name / Admission No)</label>
        <input
          type="text"
          className="milk-input w-full"
          placeholder="Start typing..."
          value={searchStudent}
          onChange={(e) => { setSearchStudent(e.target.value); setSelectedStudent(null); setLedgerData(null); }}
        />
        {searchStudent && filteredStudents.length > 0 && (
          <div className="absolute z-20 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto mt-1">
            {filteredStudents.map(s => (
              <button
                key={s.id}
                type="button"
                className="w-full text-left p-3 hover:bg-blue-50 border-b last:border-b-0"
                onClick={() => fetchLedger(s)}
              >
                <p className="font-medium">{s.name}</p>
                <p className="text-sm text-gray-500">Adm: {s.admission_number} | Class: {s.class_name}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {fetchingLedger ? <Spinner /> : ledgerData && (
        <>
          {/* --- Student Info & Summary --- */}
          <div className="card">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-800">{selectedStudent.name}</h2>
                <p className="text-gray-500">Admission No: {selectedStudent.admission_number} | Class: {selectedStudent.class_name}</p>
              </div>
              <button onClick={handlePrint} className="milk-btn">🖨️ Print Statement</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
                <p className="text-sm text-gray-600">Total Expected Fees</p>
                <p className="text-xl font-bold text-blue-700">KSh {ledgerData.total_expected.toLocaleString()}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
                <p className="text-sm text-gray-600">Total Amount Paid</p>
                <p className="text-xl font-bold text-green-700">KSh {ledgerData.total_paid.toLocaleString()}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-center">
                <p className="text-sm text-gray-600">Current Outstanding Balance</p>
                <p className="text-xl font-bold text-red-700">KSh {ledgerData.balance.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* --- Ledger Transaction Table --- */}
          <div className="card overflow-x-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Transaction History</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left border-b">Date</th>
                  <th className="p-3 text-left border-b">Description / Particulars</th>
                  <th className="p-3 text-left border-b">Debit (Charges)</th>
                  <th className="p-3 text-left border-b">Credit (Payments)</th>
                  <th className="p-3 text-left border-b">Running Balance</th>
                  <th className="p-3 text-left border-b">Receipt No</th>
                </tr>
              </thead>
              <tbody>
                {ledgerData.transactions.map((tx, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="p-3 border-b">{new Date(tx.date).toLocaleDateString()}</td>
                    <td className="p-3 border-b">{tx.description}</td>
                    <td className="p-3 border-b text-red-600">{tx.debit ? `KSh ${tx.debit.toLocaleString()}` : "—"}</td>
                    <td className="p-3 border-b text-green-600">{tx.credit ? `KSh ${tx.credit.toLocaleString()}` : "—"}</td>
                    <td className="p-3 border-b font-medium">KSh {tx.running_balance.toLocaleString()}</td>
                    <td className="p-3 border-b">{tx.receipt_number || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentLedger;