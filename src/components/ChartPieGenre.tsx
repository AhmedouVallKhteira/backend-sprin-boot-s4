import React from "react";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import "../styles/ChartPieGenre.css";

interface DataPoint {
  genre: string;
  count: number;
}

interface ChartPieGenreProps {
  data: DataPoint[];
}

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7f50",
  "#00c49f",
  "#ffb6b9",
];

export default function ChartPieGenre({
  data,
}: ChartPieGenreProps): React.ReactElement {
  return (
    <div className="chart-genre-container">
      <h3>Répartition des Livres par Genre</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="genre"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
