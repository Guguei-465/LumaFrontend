import { useEffect, useState, useCallback } from "react";
import api from "../api/api";

const Spinner = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-10 w-10 border-b-3 border-green-600"></div>
  </div>
);

const ParentMessage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMsg, setNewMsg] = useState("");

  const fetchMessages = useCallback(async () => {
    try {
      const res = await api.get("/dashboard/parent/messages/");
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    try {
      await api.post("/dashboard/parent/messages/", { message: newMsg });
      setNewMsg("");
      fetchMessages();
    } catch (err) {
      console.error("Send failed:", err);
    }
  }, [newMsg, fetchMessages]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800">Messages</h3>
        <p className="text-sm text-gray-500 mt-1">Communicate with teachers.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        {/* Message List */}
        <div className="space-y-3 max-h-[450px] overflow-y-auto mb-4">
          {messages.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No messages yet.</p>
          ) : (
            messages.map((m) => (
              <div key={m.id} className={`flex ${m.is_sent_by_parent ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] p-3 rounded-xl text-sm ${
                  m.is_sent_by_parent ? "bg-green-100 text-gray-800" : "bg-gray-100 text-gray-800"
                }`}>
                  <p>{m.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{m.created_at}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Send Form */}
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ParentMessage;