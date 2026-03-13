import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";

// AnalyticsPage component fetches and displays the chat statistics for a specific widget.
export default function AnalyticsPage() {
  const { id } = useParams(); // Get the widget ID from the URL link
  const [data, setData] = useState(null); // Store the analytics data here
  const [loading, setLoading] = useState(true); // Track if data is currently loading
  const [error, setError] = useState(null); // Store any errors that happen
  const [showHistory, setShowHistory] = useState(false); // Toggle to show/hide history

  // Where our backend lives
  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  // This hook runs exactly once when the page opens (or if the ID changes)
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Ask the backend for the analytics data
        const res = await fetch(`${apiBase}/analytics/widgets/${id}`, {
          credentials: "include", // Send our VIP login cookie!
        });
        const result = await res.json();
        
        // If the backend says NO or there's an error, throw it so the catch block handles it
        if (!res.ok || !result.success) {
          throw new Error(result.message || "Failed to load analytics");
        }
        
        // If successful, save the data!
        setData(result.data);
      } catch (err) {
        setError(err.message); // Set the error message to display
        toast.error(err.message); // Show a red popup notification
      } finally {
        setLoading(false); // No matter what (success or fail), stop the loading spinner
      }
    };
    
    fetchAnalytics(); // Call our new function
  }, [id, apiBase]);

  // While waiting for the backend, show a simple loading message
  if (loading) return <div className="p-4 text-center font-bold">Loading your analytics...</div>;
  
  // If there was an error, show it in red
  if (error) return <div className="p-4 text-red-500 font-bold text-center">{error}</div>;

  // Once data is loaded successfully, draw our dashboard!
  return (
    <div className="p-4 max-w-6xl mx-auto pb-16">
      {/* Header section with Title and Back button */}
      <div className="flex justify-between items-center mb-8 mt-4">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Widget Analytics</h1>
        <Link to="/dashboard" className="btn btn-outline btn-sm rounded-full shadow-sm hover:shadow-md transition-shadow delay-75">Back to Dashboard</Link>
      </div>

      {/* Two cards showing total numbers */}
      <div className="grid grid-cols-2 gap-6 mb-12">
        <div className="card bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg border border-primary/20 hover:-translate-y-1 transition-transform duration-300">
          <div className="card-body">
            <h2 className="card-title text-sm opacity-70 uppercase tracking-wider">Total Conversations</h2>
            <p className="text-5xl text-primary font-black drop-shadow-sm">{data.totalConversations}</p>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-secondary/10 to-secondary/5 shadow-lg border border-secondary/20 hover:-translate-y-1 transition-transform duration-300">
          <div className="card-body">
            <h2 className="card-title text-sm opacity-70 uppercase tracking-wider">Total Messages</h2>
            <p className="text-5xl text-secondary font-black drop-shadow-sm">{data.totalMessages}</p>
          </div>
        </div>
      </div>

      {/* Section showing daily activity */}
      <h2 className="text-2xl font-bold mb-6 text-base-content/90">Last 7 Days Activity</h2>
      <div className="bg-base-100 p-8 rounded-3xl shadow-xl border border-base-200 space-y-5">
        {data.conversationsPerDay.length === 0 ? (
          <p className="text-base-content/70">No activity in the last 7 days.</p>
        ) : (
          // We map over each day and draw a horizontal bar for it!
          data.conversationsPerDay.map((day) => {
            // Figure out the biggest day to scale the bars properly (max width 100%)
            const max = Math.max(...data.conversationsPerDay.map(d => d.count), 1);
            const widthPct = (day.count / max) * 100; // Calculate percentage for width
            
            return (
              <div key={day._id} className="flex items-center gap-4">
                <div className="w-24 text-sm font-semibold">{day._id}</div>
                {/* Gray background bar */}
                <div className="flex-1 bg-base-200 h-8 rounded-full overflow-hidden flex items-center">
                  {/* Purple filled bar based on percentage */}
                  <div 
                    className="bg-primary h-full transition-all duration-500" 
                    style={{ width: `${widthPct}%` }}
                  ></div>
                </div>
                <div className="w-8 text-right font-bold text-lg">{day.count}</div>
              </div>
            );
          })
        )}
      </div>

      {/* --- NEW SECTION: Conversation History --- */}
      <div className="flex justify-between items-center mt-16 mb-6">
          <h2 className="text-2xl font-bold text-base-content/90">Recent Conversations & Message History</h2>
          <button 
             className="btn btn-sm btn-outline rounded-full shadow-sm hover:shadow-md"
             onClick={() => setShowHistory(!showHistory)}
          >
             {showHistory ? "Hide History" : "Show History"}
          </button>
      </div>
      
      {showHistory && (
        <div className="space-y-6">
          {(!data.history || data.history.length === 0) ? (
            <div className="bg-base-100 p-6 rounded-xl shadow border-2 border-base-200">
              <p className="text-base-content/70">No conversation history available yet.</p>
            </div>
          ) : (
            data.history.map((conv) => (
              <div key={conv.id} className="bg-base-100 rounded-xl shadow border-2 border-base-200 overflow-hidden">
                {/* Conversation Header */}
                <div className="bg-base-200 p-4 flex justify-between items-center border-b border-base-300">
                  <div>
                    <span className="font-bold">Session ID:</span> <span className="text-sm opacity-80">{conv.sessionId}</span>
                  </div>
                  <div className="text-sm opacity-70">
                    {new Date(conv.startedAt).toLocaleString()}
                  </div>
                </div>
                
                {/* Messages List (The actual chat history) */}
                <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                  {(!conv.messages || conv.messages.length === 0) ? (
                     <p className="text-sm opacity-60 text-center italic">No messages sent in this session.</p>
                  ) : (
                    conv.messages.map((msg, i) => {
                      // Check if it's the bot or the user speaking to style the chat bubble position
                      const isBot = msg.sender === "bot";
                      return (
                        <div key={i} className={`chat ${isBot ? "chat-start" : "chat-end"}`}>
                           <div className="chat-header text-xs opacity-50 mb-1">
                             {isBot ? "Bot" : "User"}
                           </div>
                           <div className={`chat-bubble ${isBot ? "chat-bubble-primary" : "chat-bubble-secondary text-white"}`}>
                             {msg.content}
                           </div>
                           <div className="chat-footer opacity-50 text-xs mt-1">
                             {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                           </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
      
    </div>
  );
}
