// Create variables
const calorieCounter = document.getElementById('calorie-counter');
const budgetNumberInput = document.getElementById('budget');
const entryDropdown = document.getElementById('entry-dropdown');
const addEntryButton = document.getElementById('add-entry');
const clearButton = document.getElementById('clear');
const output = document.getElementById('output');

// Function to clean and validate input
function cleanInputString(str) {
  return str.replace(/[+\-\s]/g, '');
}

function isInvalidInput(str) {
  return /\d+e\d+/i.test(str);
}

// Function to add entry fields
function addEntry() {
  const container = document.querySelector(`#${entryDropdown.value} .input-container`);
  const entryNumber = container.querySelectorAll('input[type="text"]').length + 1;
  container.insertAdjacentHTML('beforeend', `
    <label for="${entryDropdown.value}-${entryNumber}-name">Entry ${entryNumber} Name</label>
    <input type="text" id="${entryDropdown.value}-${entryNumber}-name" placeholder="Name" />
    <label for="${entryDropdown.value}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
    <input type="number" min="0" id="${entryDropdown.value}-${entryNumber}-calories" placeholder="Calories" />
  `);
}

// Function to calculate calories
function calculateCalories(e) {
  e.preventDefault();
  let isError = false;

  const categories = ['breakfast', 'lunch', 'dinner', 'snacks', 'exercise'];
  let totalCalories = { consumed: 0, burned: 0, budget: Number(budgetNumberInput.value) || 0 };

  categories.forEach(category => {
    document.querySelectorAll(`#${category} input[type=number]`).forEach(input => {
      const value = cleanInputString(input.value);
      if (isInvalidInput(value)) {
        alert(`Invalid Input: ${value}`);
        isError = true;
      }
      const calories = Number(value);
      if (category === 'exercise') {
        totalCalories.burned += calories;
      } else {
        totalCalories.consumed += calories;
      }
    });
  });

  if (isError) return;

  const remainingCalories = totalCalories.budget - totalCalories.consumed + totalCalories.burned;
  const status = remainingCalories < 0 ? 'Surplus' : 'Deficit';

  output.innerHTML = `
    <span class="${status.toLowerCase()}">${Math.abs(remainingCalories)} Calorie ${status}</span>
    <hr>
    <p>${totalCalories.budget} Calories Budgeted</p>
    <p>${totalCalories.consumed} Calories Consumed</p>
    <p>${totalCalories.burned} Calories Burned</p>
  `;
  output.classList.remove('hide');
}

// Function to clear the form
function clearForm() {
  document.querySelectorAll('.input-container').forEach(container => container.innerHTML = '');
  budgetNumberInput.value = '';
  output.innerHTML = '';
  output.classList.add('hide');
}

addEntryButton.addEventListener('click', addEntry);
calorieCounter.addEventListener('submit', calculateCalories);
clearButton.addEventListener('click', clearForm);
