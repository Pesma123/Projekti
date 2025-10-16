import React from "react";
import { useTransactions } from "../context/TransactionContext";

export default function BalanceCard() {
  const { transactions } = useTransactions();

  const amounts = transactions.map((t) => t.amount);
  const income = amounts.filter((a) => a > 0).reduce((acc, item) => acc + item, 0);
  const expense = amounts.filter((a) => a < 0).reduce((acc, item) => acc + item, 0) * -1;
  const total = income - expense;

  return (
    <div className="balance-card">
      <h2>Ukupan balans: ${total}</h2>
      <div className="balance-details">
        <div>
          <h4>Prihod</h4>
          <p className="plus">+${income}</p>
        </div>
        <div>
          <h4>Rashod</h4>
          <p className="minus">-${expense}</p>
        </div>
      </div>
    </div>
  );
}
