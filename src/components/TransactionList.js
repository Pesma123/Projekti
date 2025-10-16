import React, { useState } from "react";
import { useTransactions } from "../context/TransactionContext";

export default function TransactionList() {
  const { transactions, deleteTransaction } = useTransactions();
  const [filterType, setFilterType] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = transactions.filter((t) => {
    const matchesType =
      filterType === "all" ? true : t.type === filterType;
    const matchesSearch = t.text.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="transaction-list">
      <h3>Historija transakcija</h3>
      <input
        type="text"
        placeholder="Pretraži..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
        <option value="all">Sve</option>
        <option value="income">Prihod</option>
        <option value="expense">Rashod</option>
      </select>
      <ul>
        {filtered.map((t) => (
          <li key={t.id} className={t.amount > 0 ? "plus" : "minus"}>
            {t.text} ({t.category}) <span>{t.amount} KM</span>
            <button onClick={() => deleteTransaction(t.id)}>x</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
