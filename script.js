// 1. Deposit some money
// 2. Determine number of lines to bet on
// 3. Collect a bet amount
// 4. Spin slot machine
// 5. Check if user won
// 6. Give user winnings
//  7. Play again

// Imports and libraries at top
const prompt = require("prompt-sync")();

// Variables to define size of slot machine and the symbols
// Global variables - good to have at top of program
const ROWS = 3;
const COLS = 3;
// Create object to hold symbols - Symbol and how many in each reel
const SYMBOLS_COUNT = {
    A: 2,
    B: 4,
    C: 6,
    D: 8,
}
// Object for values - symbol and amount to multiple bet by with line of them
const SYMBOL_VALUES = {
    A: 5,
    B: 4,
    C: 3,
    D: 2,
}

function deposit() {
    // Keep running until valid deposit amount
    while(true){
        // Get user to submit a deposit amount and save it in var
        const depositAmount = prompt("Enter a deposit amount: ");

        // Convert input to number as comes as a string
        const numberDepositAmount = parseFloat(depositAmount); // parseFloat converts string to float

        // Check if amount is a number or less than or equal to 0
        if(isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
            console.log("Invalid Deposit Amount! Try again")
        } else {
            return numberDepositAmount;
        }
    }
}

// Get number of lines user wants to bet - arrow function
const getNumberOfLines = () => {
    // Keep running until valid lines to bet on
    while(true){
        // Get user to submit a number of lines and save it in var
        const lines = prompt("Enter a lines to bet (1-3): ");

        // Convert input to number as comes as a string
        const numberOfLines = parseFloat(lines); // parseFloat converts string to float

        // Check if amount is a number or less than or equal to 0 or greater than 3
        if(isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
            console.log("Invalid Number of Lines! Please choose 1-3")
        } else {
            return numberOfLines;
        }
    }
}

// Get the bet amount from user - must not be more than current balance
const getBet = (balance, lines) => {
    // Keep running until valid bet amount
    while(true){
        // Get user to submit an amount to bet and save it in var
        const bet = prompt("Enter the bet per line: ");

        // Convert input to number as comes as a string
        const numberBet = parseFloat(bet); // parseFloat converts string to float

        // Check if amount is a number or less than or equal to 0 or greater than balance
        if(isNaN(numberBet) || numberBet <= 0 || numberBet > (balance / lines)) {
            console.log("Invalid bet amount! Please bet no more than current balance")
        } else {
            return numberBet;
        }
    }
}

// Function to spin slot machine - get random symbols
const spin = () => {
    // Create array with all possible symbols
    const symbols = [];
    // Loop through entries within symbols object and add them to the array depending on how many there is
    // E.g. A: 2 will return [A, A]
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    // Create reels - each array is a column in slot machine
    const reels = []
    for (let i = 0; i < COLS; i++) {
        reels.push([]); // For every column, add new array in reels array
        const reelSymbols = [...symbols]; // Copy available symbols into new array (spread operator)
        for (let j = 0; j < ROWS; j++) {
            // Generate random number between 0-1, multiply by length of symbols array, round down to integer
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1) // Remove symbol used from array
        }
    }

    return reels
}

// Transpose arrays from columns to rows
const transpose = (reels) => {
    const rows = [];

    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i]);
        }
    }

    return rows;
}

// Print rows for user in format A | B | C
const printRows = (rows) => {
    for (const row of rows) {
        let rowString = "";
        for (const [i, symbol] of row.entries()) {
            rowString += symbol;
            if (i != row.length - 1) {
                rowString += " | ";
            }
        }
        console.log(rowString);
    }
}

// Check if user has won and return winnings
const getWinnings = (rows, bet, lines) => {
    let winnings = 0;

    for (let row = 0 ; row < lines; row++) {
        const symbols = rows[row];
        let allSame = true;

        for (const symbol of symbols) {
            if (symbol != symbols[0]) {
                allSame = false;
                break;
            }
        }

        if (allSame) {
            winnings =+ bet * SYMBOL_VALUES[symbols[0]];
        }
    }

    return winnings
}

const game = () => {
    let balance = deposit(); // Using let as the variable can change

    while(true) {
        console.log(`Balance: £${balance}`);
        const numberOfLines = getNumberOfLines();
        const bet = getBet(balance, numberOfLines);
        balance -= bet * numberOfLines; // Remove bet from current balance
        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);
        const winnings = getWinnings(rows, bet, numberOfLines);
        balance += winnings; // Add winnings to balance
        console.log(`You won £${winnings}`);
        console.log(`Balance: £${balance}`);

        if(balance <= 0) {
            console.log("You ran out of money!");
            break
        }

        const playAgain = prompt("Do you want to play again? (y/n)?: ").toLowerCase();
        if (playAgain != "y") break;
    };
};

game();