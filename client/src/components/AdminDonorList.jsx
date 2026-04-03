import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import "../styles/adminDashboard.css"; // CSS already included

const AdminDonorList = () => {
  const { token } = useContext(AuthContext);
  const [donations, setDonations] = useState([]);

  const fetchDonations = async () => {
    try {
      const res = await fetch(
        "https://blood-bank-m-system.onrender.com/api/collections/all",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (data.success) {
        setDonations(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  return (
    <div className="donor-list-container">
      <h3>🩸 Blood Donor List</h3>

      <table>
        <thead>
          <tr>
            <th>Donor Name</th>
            <th>Blood Group</th>
            <th>Units</th>
            <th>Location</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {donations.length > 0 ? (
            donations.map((d) => (
              <tr key={d._id}>
                <td>
                  <strong>{d.donorName}</strong>
                </td>

                <td>
                  <span className="blood-badge">{d.bloodGroup}</span>
                </td>

                <td>
                  <span className="units">{d.quantityUnits} Units</span>
                </td>

                <td>{d.location}</td>

                <td>
                  {new Date(d.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                No Donor Data Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDonorList;