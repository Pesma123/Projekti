import React from "react";
import { useTransactions } from "../context/TransactionContext";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function IncomeExpenseChart() {
  const { transactions } = useTransactions();

  // Izračunaj ukupni prihod i rashod
  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter((t) => t.amount < 0)
    .reduce((acc, t) => acc + Math.abs(t.amount), 0);

  const data = {
    labels: ["Prihod", "Rashod"],
    datasets: [
      {
        data: [income, expense],
        backgroundColor: ["#27ae60", "#c0392b"], // zelena i crvena
        hoverBackgroundColor: ["#2ecc71", "#e74c3c"],
      },
    ],
  };

  return (
    <div className="chart">
      <h3>Odnos prihoda i rashoda</h3>
      <Doughnut data={data} />
    </div>
  );
}
