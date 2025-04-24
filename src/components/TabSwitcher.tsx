// TabSwitcher.tsx
import React, { useState } from "react";
import "../styles/TabSwitcher.css";

interface TabSwitcherProps {
  tabs: { label: string; content: React.ReactNode }[];
}

export default function TabSwitcher({
  tabs,
}: TabSwitcherProps): React.ReactElement {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="tab-switcher">
      <div className="tab-buttons">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`tab-button ${index === activeIndex ? "active" : ""}`}
            onClick={() => setActiveIndex(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-content">{tabs[activeIndex].content}</div>
    </div>
  );
}
