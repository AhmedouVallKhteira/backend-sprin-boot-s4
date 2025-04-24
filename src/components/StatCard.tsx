import "../styles/StatCard.css";
import { BarChart2, BookOpen, DollarSign } from "lucide-react";

interface StatCardProps {
  icon: string
  label: string;
  value: string | number;
}

export default function StatCard({ icon, label, value }: StatCardProps) {
  const renderIcon = () => {
    switch (icon) {
      case "book":
        return <BookOpen size={28} />;
      case "price":
        return <DollarSign size={28} />;
      case "chart":
        return <BarChart2 size={28} />;
      default:
        return null;
    }
  };

  return (
    <div className="stat-card">
      <div className="stat-icon">{renderIcon()}</div>
      <div className="stat-info">
        <p className="stat-label">{label}</p>
        <p className="stat-value">{value}</p>
      </div>
    </div>
  );
}
