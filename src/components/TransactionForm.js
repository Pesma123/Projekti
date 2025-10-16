import React, { useState } from "react";
import { useTransactions } from "../context/TransactionContext";

export default function TransactionForm() {
  const { addTransaction } = useTransactions();
  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [category, setCategory] = useState("Hrana");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text || !amount) return;

    const newTransaction = {
      id: Date.now(),
      text,
      amount: type === "expense" ? -Math.abs(+amount) : +amount,
      type,
      category,
    };

    addTransaction(newTransaction);
    setText("");
    setAmount("");
    setType("income");
    setCategory("Hrana");
  };

  return (
    <form onSubmit={handleSubmit} className="transaction-form">
      <h3>Dodaj novu transakciju</h3>
      <input
        type="text"
        placeholder="Opis..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <input
        type="number"
        placeholder="Iznos..."
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="income">Prihod</option>
        <option value="expense">Rashod</option>
      </select>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option>Hrana</option>
        <option>Transport</option>
        <option>Računi</option>
        <option>Zabava</option>
        <option>Razno</option>
      </select>
      <button className="rounded-2xl border-2 border-dashed border-black bg-white px-6 py-3 font-semibold uppercase text-black transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none">
      DODAJ
    </button>
    </form>
  );
}
