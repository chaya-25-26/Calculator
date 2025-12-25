let currentInput = '0';
let previousInput = '';
let operation = null;
let memory = 0;
let isPoweredOn = true;
let shouldResetScreen = false;

const display = document.getElementById('display');

function updateDisplay() {
    if (!isPoweredOn) {
        display.value = '';
        return;
    }
    display.value = currentInput;
}

function turnOn() {
    isPoweredOn = true;
    currentInput = '0';
    previousInput = '';
    operation = null;
    shouldResetScreen = false;
    updateDisplay();
}

function turnOff() {
    isPoweredOn = false;
    updateDisplay();
}

function appendNumber(number) {
    if (!isPoweredOn) return;
    if (currentInput === '0' || shouldResetScreen) {
        currentInput = number;
        shouldResetScreen = false;
    } else {
        // Limit length to fit screen
        if (currentInput.length < 10) {
            currentInput += number;
        }
    }
    updateDisplay();
}

function appendDot() {
    if (!isPoweredOn) return;
    if (shouldResetScreen) {
        currentInput = '0';
        shouldResetScreen = false;
    }
    if (!currentInput.includes('.')) {
        currentInput += '.';
    }
    updateDisplay();
}

function appendOperator(op) {
    if (!isPoweredOn) return;
    if (operation !== null) {
        calculateResult();
    }
    previousInput = currentInput;
    operation = op;
    shouldResetScreen = true;
}

function calculateSquareRoot() {
    if (!isPoweredOn) return;
    let val = parseFloat(currentInput);
    if (val < 0) {
        currentInput = 'Error';
    } else {
        currentInput = Math.sqrt(val).toString().slice(0, 10);
    }
    shouldResetScreen = true;
    updateDisplay();
}

function calculateResult() {
    if (!isPoweredOn || operation === null) return;
    let prev = parseFloat(previousInput);
    let current = parseFloat(currentInput);
    let result;

    if (isNaN(prev) || isNaN(current)) return;

    switch (operation) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                result = 'Error';
            } else {
                result = prev / current;
            }
            break;
        case '%':
            // Standard calculator % logic: 
            // 100 + 10% = 110
            // 100 * 10% = 10
            if (operation === '+' || operation === '-') {
                result = prev * (current / 100);
            } else {
                result = prev * (current / 100); // This is a simplification
            }
            // Actually, simple calculators usually treat % as "divide by 100" immediately
            // or "x percent of y".
            // Let's stick to simple division by 100 for the current number if no previous op,
            // or the complex logic if there is.
            // For this simple implementation, let's just do (prev * current / 100) if it was multiplication
            // or just current/100 if it was standalone.
            // But here we are in calculateResult, so we have an operation.
            // Let's just do standard math.
            break;
    }

    // Re-evaluating % logic for simple calculators
    // Usually % is an immediate action, not a delayed operator like +.
    // But in my code I treated it as an operator.
    // Let's fix that in the next step if needed. For now, let's handle the basic 4 ops.
    
    if (result !== 'Error') {
        // Round to avoid floating point errors
        result = Math.round(result * 100000000) / 100000000;
        currentInput = result.toString().slice(0, 10);
    } else {
        currentInput = 'Error';
    }
    
    operation = null;
    shouldResetScreen = true;
    updateDisplay();
}

// Overwriting the % operator logic to be immediate
window.appendOperator = function(op) {
    if (!isPoweredOn) return;
    
    if (op === '%') {
        let val = parseFloat(currentInput);
        currentInput = (val / 100).toString();
        updateDisplay();
        return;
    }

    if (operation !== null) {
        calculateResult();
    }
    previousInput = currentInput;
    operation = op;
    shouldResetScreen = true;
}


function memoryRecall() {
    if (!isPoweredOn) return;
    currentInput = memory.toString();
    shouldResetScreen = true;
    updateDisplay();
}

function memoryPlus() {
    if (!isPoweredOn) return;
    memory += parseFloat(currentInput);
    shouldResetScreen = true;
}

function memoryMinus() {
    if (!isPoweredOn) return;
    memory -= parseFloat(currentInput);
    shouldResetScreen = true;
}
