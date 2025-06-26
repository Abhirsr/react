import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import "./DashboardHome.css";

const data = [
  { name: "Jan", Leaves: 4 },
  { name: "Feb", Leaves: 2 },
  { name: "Mar", Leaves: 5 },
  { name: "Apr", Leaves: 3 },
  { name: "May", Leaves: 6 },
  { name: "Jun", Leaves: 1 },
];

const DashboardHome = () => {
  return (
    <div className="dashboard-home">
      <div className="welcome-card">
        <h2>Welcome, Abhinav 👋</h2>
        <p>This is your dashboard home.</p>
      </div>

      <div className="summary-grid">
        <div className="summary-card blue">Leaves Taken: <strong>21</strong></div>
        <div className="summary-card green">Approved: <strong>17</strong></div>
        <div className="summary-card orange">Pending: <strong>3</strong></div>
        <div className="summary-card purple">Internships: <strong>2</strong></div>
      </div>

      <div className="chart-section">
        <h3>Monthly Leave Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="Leaves" fill="#8884d8" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardHome;