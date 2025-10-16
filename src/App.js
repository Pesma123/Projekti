import React from "react";
import { TransactionProvider } from "./context/TransactionContext";
import BalanceCard from "./components/BalanceCard";
import Charts from "./components/Charts";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import IncomeExpenseChart from "./components/IncomeExpenseChart";
import "./index.css";

function App() {
  return (
    <TransactionProvider>
      <div className="app-wrapper">
        <h1>💸 Troškovi</h1>

        {/* Gornji red - balans i grafikoni */}
        <div className="top-row">
          <div className="balance-card">
            <BalanceCard />
          </div>
          <div className="chart">
            <Charts />
          </div>
          <div className="chart">
            <IncomeExpenseChart />
          </div>
        </div>

        {/* Donji red - forma i lista */}
        <div className="bottom-row">
          <div className="transaction-form">
            <TransactionForm />
          </div>
          <div className="transaction-list">
            <TransactionList />
          </div>
        </div>
      </div>
    </TransactionProvider>
  );
}

export default App;
