// Get DOM elements
const startBudget = document.getElementById("startBudget");
const calculateBudgetBtn = document.getElementById("calculateBudget");
const calculateBudgetElement = document.getElementById("BudgetResult");
const clearBudgetElement = document.getElementById("clearBudget");

// Event listeners
startBudget.addEventListener("click", getExpenses);
calculateBudgetBtn.addEventListener("click", handleCalculateBudget);
clearBudgetElement.addEventListener("click", clearBudget);

// Function to generate expense input fields based on user input
function getExpenses() {
  const numberOfExpenses = parseInt(
    document.getElementById("numOfexpenses").value
  );
  const expensesInputDiv = document.getElementById("expensesInputDiv");
  expensesInputDiv.innerHTML = "";
  if (isNaN(numberOfExpenses) || numberOfExpenses < 0) {
    alert("Enter a valid number of expense");
    return;
  }

  for (let i = 0; i < numberOfExpenses; i++) {
    let expenseLabel = document.createElement("label");
    expenseLabel.textContent = `enter expense ${i + 1}: `;

    let expenseInput = document.createElement("input");
    expenseInput.type = "number";
    expenseInput.classList.add("expensevalue");

    expensesInputDiv.appendChild(expenseLabel);
    expensesInputDiv.appendChild(expenseInput);
    expensesInputDiv.appendChild(document.createElement("br"));
  }

  document.getElementById("calculateBudget").style.display = "inline-block";
  clearBudgetElement.style.display = "inline-block";
}

// Function to handle overall budget calculation and storage
function handleCalculateBudget() {
  let userBudget = {
    userName: document.getElementById("userName").value,
    income: parseFloat(document.getElementById("income").value),
    expenses: [],
    numberOfExpenses: parseInt(document.getElementById("numOfexpenses").value),
    totalExpenses: 0,
    tax: 0,
    net_income: 0,
    balance: 0,
    savings: 0,
    finalStatus: "",
    overspendingMessage: "", // to store overspending message
  };

  if (
    !userBudget.userName ||
    isNaN(userBudget.income) ||
    userBudget.income <= 0
  ) {
    alert("Enter a valid name and income");
    return;
  }

  let expenseInput = document.getElementsByClassName("expensevalue");
  for (let i = 0; i < expenseInput.length; i++) {
    let expense = parseFloat(expenseInput[i].value);
    userBudget.expenses.push(isNaN(expense) || expense < 0 ? 0 : expense);
  }

  calculateBudget(userBudget);
  userBudget.overspendingMessage = checkOverspending(userBudget); // get overspending message
  displayResult(userBudget);
  saveBudgetToLocal(userBudget);
}

// Function to calculate all budget-related values
function calculateBudget(userBudget) {
  userBudget.totalExpenses = calculateTotalExpenses(userBudget.expenses);
  userBudget.tax = calculateTax(userBudget.income, 0.1);
  userBudget.net_income = calculateNetIncome(userBudget.income, userBudget.tax);
  userBudget.balance = calculateBalance(
    userBudget.net_income,
    userBudget.totalExpenses
  );
  userBudget.savings = calculateSavings(userBudget.balance, 0.2);
  userBudget.finalStatus = getFinancialStatus(userBudget.savings);
}

// Function to calculate total expenses from the expenses array
function calculateTotalExpenses(expenses) {
  let totalExpenses = 0;
  for (let i = 0; i < expenses.length; i++) {
    totalExpenses += expenses[i];
  }
  return totalExpenses;
}

// Function to calculate tax based on income and tax rate
function calculateTax(income, taxRate) {
  return income * taxRate;
}

// Function to calculate net income after tax
function calculateNetIncome(income, tax) {
  return income - tax;
}

// Function to calculate balance after expenses are deducted
function calculateBalance(net_income, totalExpenses) {
  return net_income - totalExpenses;
}

// Function to calculate savings based on a saving percentage
function calculateSavings(balance, savingAmount) {
  return balance * savingAmount;
}

// Function to determine financial status based on savings
function getFinancialStatus(savings) {
  let finalStatus = "";

  if (savings >= 1000) {
    finalStatus = "You are saving excellently.";
  } else if (savings >= 500 && savings < 1000) {
    finalStatus = "You are saving well.";
  } else if (savings >= 100 && savings < 500) {
    finalStatus = "You need improvement.";
  } else {
    finalStatus = "Critical: your savings are too low.";
  }
  return finalStatus;
}

// Function to check if the user is overspending
function checkOverspending(userBudget) {
  return userBudget.totalExpenses > userBudget.income
    ? "⚠️ Warning: You are spending more than your income!"
    : "";
}

// Function to display final budget calculation results in the DOM
function displayResult(userBudget) {
  calculateBudgetElement.innerHTML = `
    <p>User: ${userBudget.userName}</p>
    <p>Total income: ${userBudget.income}</p>
    <p>Total Expenses: ${userBudget.totalExpenses}</p>
    <p>Tax deducted: ${userBudget.tax}</p>
    <p>Net income After Tax: ${userBudget.net_income}</p>
    <p>Remaining Balance: ${userBudget.balance}</p>
    <p>Savings: ${userBudget.savings}</p>
    <p>${userBudget.finalStatus}</p>
    <p style="color: red;"><strong>${userBudget.overspendingMessage}</strong></p>
  `;
}

// Function to save the user's budget to localStorage
function saveBudgetToLocal(userBudget) {
  localStorage.setItem("userBudget", JSON.stringify(userBudget));
}

// Function to retrieve saved budget data from localStorage
function getBudgetFromLocal() {
  const savedBudget = localStorage.getItem("userBudget");
  return savedBudget ? JSON.parse(savedBudget) : null;
}

// Function to clear budget data from localStorage
function clearBudgetFromLocal() {
  localStorage.removeItem("userBudget");
  alert("budget data cleared from the local storage");
}

// celar element:
function clearBudget() {
  clearBudgetFromLocal();
  calculateBudgetElement.innerHTML = "";
}

// onload
function runbudgetTracker() {
  const saveBudget = getBudgetFromLocal();
  if (saveBudget) {
    displayResult(saveBudget);
  }
}
window.addEventListener("load", runbudgetTracker);
