import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";

const CampaignList = () => {
  const { token, user } = useContext(AuthContext);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch(
          "https://blood-bank-m-system.onrender.com/api/campaigns/active",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (data.success) {
          setCampaigns(data.data || []);
        }
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [token]);

  const handleJoin = async (id) => {
    try {
      const response = await fetch(
        `https://blood-bank-m-system.onrender.com/api/campaigns/${id}/join`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setCampaigns((prev) =>
          prev.map((camp) => (camp._id === id ? data.data : camp))
        );
      }
    } catch (error) {
      console.error("Error joining campaign:", error);
    }
  };

  if (loading) return <div>Loading campaigns...</div>;

  return (
    <div className="campaign-section">
      <h3>📢 Active Campaigns</h3>

      {campaigns.length === 0 ? (
        <p>No active donation drives nearby.</p>
      ) : (
        <div className="campaign-grid" style={{ display: "grid", gap: "15px" }}>
          {campaigns.map((camp) => {
            const participants = camp.participants || [];

            const isJoined = participants.some((participant) => {
              const participantId =
                typeof participant === "object"
                  ? participant._id
                  : participant;

              return participantId === user._id;
            });

            return (
              <div
                key={camp._id}
                style={{
                  border: "1px solid #2196f3",
                  padding: "15px",
                  borderRadius: "8px",
                  backgroundColor: "#e3f2fd",
                }}
              >
                <h4 style={{ color: "#1565c0" }}>{camp.title}</h4>

                <p>{camp.description}</p>

                <p>
                  <strong>📍 {camp.location}</strong>
                </p>

                <p>
                  📅 {new Date(camp.date).toLocaleDateString()}
                </p>

                <p>
                  <strong>Total Joined:</strong> {participants.length}
                </p>

                {participants.length > 0 && (
                  <div>
                    <strong>Joined Donors:</strong>
                    <ul>
                      {participants.map((participant, index) => {
                        if (typeof participant === "object") {
                          return (
                            <li key={participant._id}>
                              {participant.name} - {participant.email}
                            </li>
                          );
                        }

                        return <li key={index}>User Joined</li>;
                      })}
                    </ul>
                  </div>
                )}

                <button
                  onClick={() => handleJoin(camp._id)}
                  disabled={isJoined}
                  style={{
                    backgroundColor: isJoined ? "#4caf50" : "#2196f3",
                    color: "#fff",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    cursor: isJoined ? "default" : "pointer",
                  }}
                >
                  {isJoined ? "Joined ✅" : "Join Campaign"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CampaignList;