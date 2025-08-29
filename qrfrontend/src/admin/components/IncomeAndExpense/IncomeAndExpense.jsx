import React, { useState, useEffect } from 'react';

const IncomeAndExpense = ({ workshops, courses, internships }) => {
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    amount: '',
    category: '',
    description: '',
    spentAt: new Date().toISOString().split('T')[0]
  });

  // Fetch actual income and expense data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [incomesResponse, expensesResponse] = await Promise.all([
          fetch('http://localhost:7700/api/incomes'),
          fetch('http://localhost:7700/api/expenses')
        ]);

        if (incomesResponse.ok) {
          const incomesData = await incomesResponse.json();
          setIncomes(incomesData);
        }

        if (expensesResponse.ok) {
          const expensesData = await expensesResponse.json();
          setExpenses(expensesData);
        }
      } catch (error) {
        console.error('Error fetching income/expense data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate actual income from payments
  const calculateActualIncome = () => {
    return incomes.reduce((total, income) => total + (income.amount || 0), 0);
  };

  // Calculate total expenses
  const calculateTotalExpenses = () => {
    return expenses.reduce((total, expense) => total + (expense.amount || 0), 0);
  };

  // Calculate net income
  const calculateNetIncome = () => {
    return calculateActualIncome() - calculateTotalExpenses();
  };

  // Handle expense form submission
  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:7700/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expenseForm)
      });

      if (response.ok) {
        const newExpense = await response.json();
        setExpenses([...expenses, newExpense]);
        setExpenseForm({
          amount: '',
          category: '',
          description: '',
          spentAt: new Date().toISOString().split('T')[0]
        });
        setShowExpenseForm(false);
      }
    } catch (error) {
      console.error('Error creating expense:', error);
      alert('Failed to create expense. Please try again.');
    }
  };

  // Handle expense deletion
  const handleDeleteExpense = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        const response = await fetch(`http://localhost:7700/api/expenses/${expenseId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          setExpenses(expenses.filter(expense => expense.id !== expenseId));
        }
      } catch (error) {
        console.error('Error deleting expense:', error);
        alert('Failed to delete expense. Please try again.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-white shadow-md rounded-lg">
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-500">Loading financial data...</p>
        </div>
      </div>
    );
  }

  const actualIncome = calculateActualIncome();
  const totalExpenses = calculateTotalExpenses();
  const netIncome = calculateNetIncome();

  return (
    <div className="space-y-6">
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-green-100 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800">Actual Income</h3>
          <p className="text-2xl font-bold text-green-600">₹{actualIncome.toFixed(2)}</p>
          <p className="text-sm text-green-600">From payments</p>
        </div>
        <div className="p-4 bg-red-100 rounded-lg">
          <h3 className="text-lg font-semibold text-red-800">Total Expenses</h3>
          <p className="text-2xl font-bold text-red-600">₹{totalExpenses.toFixed(2)}</p>
          <p className="text-sm text-red-600">Admin entered</p>
        </div>
        <div className="p-4 bg-blue-100 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800">Net Income</h3>
          <p className="text-2xl font-bold text-blue-600">₹{netIncome.toFixed(2)}</p>
          <p className="text-sm text-blue-600">Income - Expenses</p>
        </div>
        <div className="p-4 bg-yellow-100 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-800">Potential Income</h3>
          <p className="text-2xl font-bold text-yellow-600">₹{(workshops.reduce((sum, w) => sum + (w.price || 0), 0) + 
                                                              courses.reduce((sum, c) => sum + (c.price || 0), 0) + 
                                                              internships.reduce((sum, i) => sum + (i.stipend || 0), 0)).toFixed(2)}</p>
          <p className="text-sm text-yellow-600">If all seats filled</p>
        </div>
      </div>

      {/* Expense Management Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Expense Management</h2>
          <button
            onClick={() => setShowExpenseForm(!showExpenseForm)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            {showExpenseForm ? 'Cancel' : 'Add Expense'}
          </button>
        </div>

        {/* Expense Form */}
        {showExpenseForm && (
          <form onSubmit={handleExpenseSubmit} className="mb-6 p-4 border rounded-lg bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount (₹) *</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
                  required
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({...expenseForm, category: e.target.value})}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Select Category</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Venue Rent">Venue Rent</option>
                  <option value="Software">Software</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Travel">Travel</option>
                  <option value="Food">Food</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="spentAt" className="block text-sm font-medium text-gray-700">Date *</label>
                <input
                  type="date"
                  id="spentAt"
                  name="spentAt"
                  value={expenseForm.spentAt}
                  onChange={(e) => setExpenseForm({...expenseForm, spentAt: e.target.value})}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                name="description"
                value={expenseForm.description}
                onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})}
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Add Expense
              </button>
            </div>
          </form>
        )}

        {/* Expenses List */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No expenses recorded yet
                  </td>
                </tr>
              ) : (
                expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(expense.spentAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {expense.description || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                      ₹{expense.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Income Details Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Income Details</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {incomes.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                    No income recorded yet
                  </td>
                </tr>
              ) : (
                incomes.map((income) => (
                  <tr key={income.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(income.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {income.source}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      ₹{income.amount.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default IncomeAndExpense;
