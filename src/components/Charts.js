import React from "react";
import { useTransactions } from "../context/TransactionContext";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Charts() {
  const { transactions } = useTransactions();

  // skup kategorija i iznosa
  const categories = {};
  transactions.forEach((t) => {
    if (t.amount < 0) {
      categories[t.category] = (categories[t.category] || 0) + Math.abs(t.amount);
    }
  });

  const data = {
    labels: Object.keys(categories),
    datasets: [
      {
        label: "Rashodi po kategorijama",
        data: Object.values(categories),
        backgroundColor: [
          "#f1c40f",
          "#e74c3c",
          "#2ecc71",
          "#3498db",
          "#9b59b6",
        ],
      },
    ],
  };

  return (
    <div className="chart">
      <h3>Rashodi po kategorijama</h3>
      <Doughnut data={data} />
    </div>
  );
}
