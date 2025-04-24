import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "../styles/ChartBarPrix.css";

interface ChartBarPrixProps {
  data: { range: string; count: number }[];
}

export default function ChartBarPrix({
  data,
}: ChartBarPrixProps): React.ReactElement {
  return (
    <div className="chart-prix-container">
      <h3>Distribution des prix des livres achetés</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
        >
          <XAxis dataKey="range" />
          <YAxis allowDecimals={false} />
          <Tooltip formatter={(value: number) => `${value} livres`} />
          <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
