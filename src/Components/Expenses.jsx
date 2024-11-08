import React, { useState, useEffect } from "react";

const Expenses = () => {
  const [budget, setBudget] = useState(2000);
  const [remaining, setRemaining] = useState(0);
  const [spent, setSpent] = useState(0);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [newBudget, setNewBudget] = useState("");

  // Expense list
  const [expenses, setExpenses] = useState([]);
  const [expenseName, setExpenseName] = useState("");
  const [expenseCost, setExpenseCost] = useState("");

  // Load expenses from local storage on component mount
  useEffect(() => {
    const savedExpenses = JSON.parse(localStorage.getItem("expenses")) || [];
    setExpenses(savedExpenses);
    calculateBudget(savedExpenses);
  }, []);

  // Update local storage whenever expenses change
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
    calculateBudget(expenses);
  }, [expenses]);

  const calculateBudget = (expensesList) => {
    const totalSpent = expensesList.reduce(
      (sum, expense) => sum + expense.cost,
      0
    );
    setSpent(totalSpent);
    setRemaining(budget - totalSpent);
  };

  const addExpense = () => {
    if (expenseName && expenseCost) {
      const cost = parseInt(expenseCost);
      const newExpense = {
        name: expenseName,
        cost: cost,
        date: new Date().toLocaleDateString(), // Add date to the expense
      };
      const newSpent = spent + cost;

      if (newSpent > budget) {
        const excessSpent = budget - newSpent;
        setRemaining(0); // Remaining should be 0
        setBudget(excessSpent);
        alert("Your budget is negative");
      } else {
        setRemaining(budget - newSpent); // Update remaining normally
      }

      setSpent(newSpent); // Update spent amount
      setExpenses([...expenses, newExpense]); // Add new expense

      // Clear input fields
      setExpenseName("");
      setExpenseCost("");
    }
  };

  const deleteExpense = (index) => {
    const updatedExpenses = expenses.filter((_, i) => i !== index);
    setExpenses(updatedExpenses);
  };

  const handleExpenseCostChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setExpenseCost(value);
    }
  };

  const handleEditBudget = () => {
    const budgetAmount = parseInt(newBudget);
    if (!isNaN(budgetAmount) && budgetAmount >= spent) {
      setBudget(budgetAmount);
      setRemaining(budgetAmount - spent);
      setIsEditingBudget(false);
      setNewBudget("");
    } else {
      alert(
        "Please enter a valid budget amount greater than or equal to spent amount."
      );
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md">
        <h1 className="font-bold text-2xl py-3 text-center">Your Expenses</h1>
        <div className="flex gap-4 py-2 justify-between items-center">
          <div
            className={`p-3 w-[200px] text-center rounded-md ${
              budget < 0 ? "bg-red-500" : "bg-gray-400"
            }`}
          >
            Budget: ${budget}
          </div>
          <button
            className="bg-blue-400 text-white py-1 px-3 rounded-md"
            onClick={() => setIsEditingBudget(true)}
          >
            Edit Budget
          </button>
          <div className="bg-green-400 p-3 w-[200px] text-center rounded-md">
            Remaining: ${remaining}
          </div>
          <div className="bg-red-500 p-3 w-[200px] text-center rounded-md">
            Spent: ${spent}
          </div>
        </div>

        {isEditingBudget && (
          <div className="flex gap-2 my-4">
            <input
              type="number"
              value={newBudget}
              onChange={(e) => setNewBudget(e.target.value)}
              placeholder="Enter new budget"
              className="border-2 w-full py-2 px-1 rounded-md"
            />
            <button
              className="bg-green-500 text-white py-2 px-4 rounded-md"
              onClick={handleEditBudget}
            >
              Save
            </button>
          </div>
        )}

        <h2 className="font-bold text-xl py-3">Expenses List</h2>
        <div
          className="flex flex-col gap-3 my-3 overflow-y-auto"
          style={{ maxHeight: "250px" }}
        >
          {expenses.length === 0 ? (
            <p className="text-gray-500 text-center">No expenses added</p>
          ) : (
            expenses.map((expense, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-100 p-3 rounded-md shadow-sm"
              >
                <div>
                  <span className="font-medium">{expense.name}</span>
                  <span className="text-gray-500 text-sm ml-2">
                    ({expense.date})
                  </span>
                </div>
                <span className="text-gray-600">${expense.cost}</span>
                <button
                  className="text-red-500"
                  onClick={() => deleteExpense(index)}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>

        <h2 className="font-bold text-xl py-3">Add Expense</h2>
        <div className="flex flex-col gap-4">
          <input
            onChange={(e) => setExpenseName(e.target.value)}
            value={expenseName}
            className="border-2 w-full py-2 px-1 rounded-md"
            type="text"
            placeholder="Name:"
          />
          <input
            onChange={handleExpenseCostChange}
            value={expenseCost}
            className="border-2 w-full py-2 px-1 rounded-md"
            type="number"
            placeholder="Cost:"
          />
          <button
            className="bg-blue-400 text-white py-3 rounded-md"
            onClick={addExpense}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
