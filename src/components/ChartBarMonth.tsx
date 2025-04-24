import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "../styles/ChartBarMonth.css";

interface BarData {
  mois: string;
  count: number;
}

interface Props {
  data: BarData[];
}

export default function ChartBarMonth({ data }: Props): React.ReactElement {
  return (
    <div className="chart-bar-month">
      <h4 className="chart-title">📊 Fréquence des achats par mois</h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mois" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
