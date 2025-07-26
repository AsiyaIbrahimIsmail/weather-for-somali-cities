// API Key and Base URL
const API_KEY = "dc97e78f0b62f7f88262688658641799";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// Get Weather Function
async function getWeather() {
    const city = document.getElementById("city").value;
    const weatherDetails = document.getElementById("weatherDetails");

    // Fetch weather data
    try {
        const response = await fetch(`${BASE_URL}?q=${city}&units=metric&appid=${API_KEY}`);
        if (!response.ok) throw new Error("City not found");

        const data = await response.json();

        // Extract data
        const temp = data.main.temp;
        const condition = data.weather[0].description;
        const humidity = data.main.humidity;
        const wind = data.wind.speed;
        const now = new Date();

        // Display weather details
        weatherDetails.innerHTML = `
            <h3>Weather in ${city}</h3>
            <p><strong>Temperature:</strong> ${temp}°C</p>
            <p><strong>Condition:</strong> ${condition}</p>
            <p><strong>Humidity:</strong> ${humidity}%</p>
            <p><strong>Wind Speed:</strong> ${wind} km/h</p>
            <p><strong>Date & Time:</strong> ${now.toLocaleString()}</p>
        `;
    } catch (error) {
        // Display error message
        weatherDetails.innerHTML = `<p>Error: ${error.message}</p>`;
    }
}

const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

async function getWeatherForecast() {
  const city = document.getElementById("city").value;
  const weatherDetails = document.getElementById("weatherDetails");

  try {
    const response = await fetch(`${FORECAST_URL}?q=${city}&units=metric&appid=${API_KEY}`);
    if (!response.ok) throw new Error("City not found");

    const data = await response.json();
    const forecast = data.list.slice(0, 7); // Get 7 days of data

    // Display forecast
    weatherDetails.innerHTML = forecast
      .map((day) => {
        const date = new Date(day.dt_txt).toLocaleDateString();
        const temp = day.main.temp;
        const condition = day.weather[0].description;
        return `
          <div>
            <h4>${date}</h4>
            <p>Temperature: ${temp}°C</p>
            <p>Condition: ${condition}</p>
          </div>
        `;
      })
      .join("");
  } catch (error) {
    weatherDetails.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}


function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 5,
      center: { lat: 2.0469, lng: 45.3182 }, // Center on Somalia
    });

    const cities = [
      { name: "Mogadishu", lat: 2.0469, lng: 45.3182 },
      { name: "Hargeisa", lat: 9.5624, lng: 44.0770 },
      { name: "Kismayo", lat: -0.3582, lng: 42.5454 } // Added new city
    ];

    cities.forEach(async (city) => {
      const response = await fetch(`${BASE_URL}?q=${city.name}&units=metric&appid=${API_KEY}`);
      const data = await response.json();
      const marker = new google.maps.Marker({
        position: { lat: city.lat, lng: city.lng },
        map,
        title: `${city.name}: ${data.weather[0].description}, ${data.main.temp}°C`,
      });
    });
  }

// Toggle Hamburger Menu
const hamburgerBtn = document.getElementById("hamburgerBtn");
const navLinks = document.getElementById("navLinks");

hamburgerBtn.addEventListener("click", () => {
    navLinks.classList.toggle("show");
});

// Form Validation
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!validateEmail(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
        return;
    }

    alert("Log In successful!");
});

document.getElementById("signupForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!validateEmail(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    alert("Sign Up successful!");
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Toggle Password Visibility
document.getElementById("togglePassword").addEventListener("click", function() {
    const password = document.getElementById("password");
    const type = password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", type);
    this.classList.toggle("fa-eye-slash");
});

document.getElementById("toggleConfirmPassword").addEventListener("click", function() {
    const confirmPassword = document.getElementById("confirmPassword");
    const type = confirmPassword.getAttribute("type") === "password" ? "text" : "password";
    confirmPassword.setAttribute("type", type);
    this.classList.toggle("fa-eye-slash");
});


//Chapter one examples.
// dispaying hello world
function displayHelloWorld() {
    const messageElement = document.getElementById("message");
    messageElement.textContent = "Hello, World!";
}
function sumOf10PositiveNumbers() {
    let sum = 0;
    for (let i = 1; i <= 11; i++) {
        const number = parseFloat(prompt(`Enter positive number ${i}:`));
        while (number < 0) {
            alert("Please enter a positive number.");
            const number = parseFloat(prompt(`Enter positive number ${i}:`));
        }
        sum += number;
    }
    document.getElementById('spn').innerText = `Sum of 10 positive numbers: ${sum}`;

}

//chapter two.

/// 1. Arithmetic Operations 
function clearOutput() {
    document.getElementById('output').innerHTML = '';
}

function arithmeticOperators() {
    let a = 100;
    let b = 50;
    let output = `
        <p>Arithmetic Operations: a = 100; b = 50</p>
        <p>Addition of a + b = ${a + b}</p>
        <p>Subtraction of a - b = ${a - b}</p>
        <p>Multiplication of a * b = ${a * b}</p>
        <p>Division of a / b = ${a / b}</p>
        <p>Remainder of a % b = ${a % b}</p>
    `;
    document.getElementById('output').innerHTML = output;
}

// 2. Relational Operations
function comparisonOperators() {
    let a = 100; 
    let b = 50;
    let output = `
        <p>Relational Operations: a = 100; b = 50</p>
        <p>a > b? ${a > b}</p>
        <p>a < b? ${a < b}</p>
        <p>a == b? ${a == b}</p>
        <p>a != b? ${a != b}</p>
    `;
    document.getElementById('output').innerHTML = output;
}

// 3. Logical Operations 
function logicalOperators() {
    let x = true;
    let y = false;
    let output = `
        <p>Logical Operations: x = true, y = false</p>
        <p>x AND y: ${x && y}</p>
        <p>x OR y: ${x || y}</p>
        <p>NOT x: ${!x}</p>
    `;
    document.getElementById('output').innerHTML = output;
}

// 4. Assignment Operations 
function assignmentOperators() {
    let c = 10;
    let output = `
        <p>Assignment Operations: c = 10</p>
        <p>c += 5, c = ${c += 5}</p>
        <p>c -= 4, c = ${c -= 4}</p>
        <p>c *= 4, c = ${c *= 4}</p>
        <p>c /= 4, c = ${c /= 4}</p>
        <p>c %= 4, c = ${c %= 4}</p>
    `;
    document.getElementById('output').innerHTML = output;
}

// operations
function operations() {
    let choice;
    const outputElement = document.getElementById('output'); // Assuming there's an element with id 'output' to display messages

    do {
        choice = prompt("Operater Programs:\n1. Arithmetic Operations\n2. Relational Operations\n3. Logical Operations\n4. Assignment Operations\n5. Go back main menue\nChoose a number (1-5):");
        
        switch (choice) {
            case '1':
                arithmeticOperators();
                break;
            case '2':
                comparisonOperators();
                break;
            case '3':
                logicalOperators();
                break;
            case '4':
                assignmentOperators();
                break;
            case '5':
                mainMenu();
                break;
            default:
                outputElement.innerText = "Invalid choice!!"; // Display message in the output element
                break;
        }
    } while (choice !== '5'); 
}

//chapter three conditions and loops.

 function doubleNumber(number) {
    const result = number * 2;
    document.getElementById('output').innerHTML = `Double of ${number} is: ${result}`;
}

function greetUser(name) {
    document.getElementById('output').innerHTML = `Hello, ${name}!`;
}

function addNumbers(a, b) {
    const result = a + b;
    document.getElementById('output').innerHTML = `Sum of ${a} and ${b} is: ${result}`;
}

function swapUsingTemp() {
    let a = 5;
    let b = 10;
    let temp = a;
    a = b;
    b = temp;
    document.getElementById('output').innerHTML = `After swapping using temp: a = ${a}, b = ${b}`;
}

function swapWithoutTemp() {
    let a = 5;
    let b = 10;
    a = a + b; 
    b = a - b; 
    a = a - b; 
    document.getElementById('output').innerHTML = `After swapping without temp: a = ${a}, b = ${b}`;
}

function checkAdultAge(age) {
    const message = age >= 18 ? "You are an adult." : "You are a minor.";
    document.getElementById('output').innerHTML = message;
}

function assignGrade(grade) {
    let result;
    if (grade >= 90) {
        result = "A";
    } else if (grade >= 80) {
        result = "B";
    } else {
        result = "C";
    }
    document.getElementById('output').innerHTML = `Grade: ${result}`;
}

function isAdult(age) {
    const result = age >= 18 ? "True" : "False";
    document.getElementById('output').innerHTML = `Is adult: ${result}`;
}

function dayMessage(day) {
    let message;
    switch (day) {
        case "Saturday":
            message = "It's the start of the week.";
            break;
        case "Wednesday":
            message = "It's almost the weekend!";
            break;
        default:
            message = "It's a regular day.";
    }
    document.getElementById('output').innerHTML = message;
}

function printNumbersForLoop() {
    let output = "";
    for (let i = 1; i <= 5; i++) {
        output += i + " ";
    }
    document.getElementById('output').innerHTML = output;
}

function printNumbersWhileLoop() {
    let i = 1;
    let output = "";
    while (i <= 5) {
        output += i + " ";
        i++;
    }
    document.getElementById('output').innerHTML = output;
}

function printNumbersDoWhileLoop() {
    let i = 1;
    let output = "";
    do {
        output += i + " ";
        i++;
    } while (i <= 5);
    document.getElementById('output').innerHTML = output;
}

function skipNumberInLoop() {
    let output = "";
    for (let i = 0; i < 5; i++) {
        if (i === 2) {
            continue; // Skip the iteration when i equals 2
        }
        output += i + " ";
    }
    document.getElementById('output').innerHTML = output;
}

function nestedLoops() {
    let output = "";
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            output += `(${i}, ${j}) `;
        }
    }
    document.getElementById('output').innerHTML = output;
}

function multiplicationTable(size) {
    let output = "";
    for (let i = 1; i <= size; i++) {
        for (let j = 1; j <= size; j++) {
            const product = i * j;
            output += `${i} * ${j} = ${product}<br>`;
        }
    }
    document.getElementById('output').innerHTML = output;
}

// Chapter 4 Functions
function greetChapter4() {
    const name = "Mohamed";
    document.getElementById('output').innerHTML = `Hello, ${name}!`;
}

function addNumbersChapter4() {
    const result = add(3, 5);
    document.getElementById('output').innerHTML = `The sum is: ${result}`;
}

function add(a, b) {
    return a + b;
}

function sayHello() {
    var globalVariable = "I'm in global scope";
    document.getElementById('output').innerHTML = globalVariable;
}

function localScopeExample() {
    var localVariable = "I'm in local scope";
    document.getElementById('output').innerHTML = localVariable;
}

function blockScopeExample() {
    let blockVariable;
    if (true) {
        blockVariable = "I'm in block scope";
        document.getElementById('output').innerHTML = blockVariable;
    }
}

function doSomething(callback) {
    return "Doing something... " + callback(); 
}

function onComplete() {
    return "Operation complete!";
}

function callbackExample() {
    document.getElementById('output').innerHTML = doSomething(onComplete);
}

function setTimeoutArrow() {
    setTimeout(() => {
        document.getElementById('output').innerHTML = "This is an arrow function callback executed after 2 seconds.";
    }, 2000);
}

function setTimeoutRegular() {
    setTimeout(function() {
        document.getElementById('output').innerHTML = "This is a callback executed after 2 seconds.";
    }, 2000);
}

function doubleNumberExample() {
    const result = doubleNumber(3);
    document.getElementById('output').innerHTML = `Double of 3 is: ${result}`;
}

// this is Assignment program page.

function mainMenu() {
    const menuHtml = `
        <button onclick="examplesMenu()">1. Examples Programs</button>
        <button onclick="selectionMenu()">2. Selection Programs</button>
        <button onclick="loopMenu()">3. Loop Programs</button>
        <button onclick="exitProgram()">4. Exit</button>
    `;
    document.getElementById('menu').innerHTML = menuHtml;
    document.getElementById('output').innerText = '';
}


function examplesMenu() {
    const menuHtml = `
        <button onclick="basicArithmetic()">1. Basic Arithmetic Operations</button>
        <button onclick="exponentiation()">2. Exponentiation</button>
        <button onclick="squareRoot()">3. Square Root</button>
        <button onclick="employeeSalary()">4. Employee Salary Calculation</button>
        <button onclick="swapProgram()">5. Swap Program</button>
        <button onclick="calculateArea()">6. Calculate Area of a Circle</button>
        <button onclick="absoluteValue()">7. Absolute Value Calculation</button>
        <button onclick="mainMenu()">8. Back to Main Menu</button>
    `;
    document.getElementById('menu').innerHTML = menuHtml;
}

function basicArithmetic() {
    const num1 = parseFloat(prompt("Enter first number:"));
    const num2 = parseFloat(prompt("Enter second number:"));
    const operation = prompt(`Select operation:\n1. Addition (+)\n2. Subtraction (-)\n3. Multiplication (*)\n4. Division (/)`);
    let result;

    switch (operation) {
        case '1':
            result = num1 + num2;
            break;
        case '2':
            result = num1 - num2;
            break;
        case '3':
            result = num1 * num2;
            break;
        case '4':
            result = num1 / num2;
            break;
        default:
            document.getElementById('output').innerText = "Invalid operation.";
            return;
    }
    document.getElementById('output').innerText = `The result is: ${result}`;
}

function exponentiation() {
    const base = parseFloat(prompt("Enter the base number:"));
    const exponent = parseFloat(prompt("Enter the exponent:"));
    const result = Math.pow(base, exponent);
    document.getElementById('output').innerText = `Result: ${base} raised to the power of ${exponent} is ${result}`;
}

function squareRoot() {
    const number = parseFloat(prompt("Enter a number:"));
    if (number < 0) {
        document.getElementById('output').innerText = "Cannot calculate the square root of a negative number.";
    } else {
        const result = Math.sqrt(number);
        document.getElementById('output').innerText = `The square root of ${number} is ${result}`;
    }
}

function employeeSalary() {
    const hoursWorked = parseFloat(prompt("Enter hours worked:"));
    const hourlyRate = parseFloat(prompt("Enter hourly rate:"));
    const salary = hoursWorked * hourlyRate;
    document.getElementById('output').innerText = `The employee's salary is: $${salary.toFixed(2)}`;
}

function swapProgram() {
    const a = parseFloat(prompt("Enter first number (a):"));
    const b = parseFloat(prompt("Enter second number (b):"));
    document.getElementById('output').innerText = `Before Swap: a = ${a}, b = ${b}`;
    let temp = a;
    a = b;
    b = temp;
    document.getElementById('output').innerText += `\nAfter Swap: a = ${a}, b = ${b}`;
}

function calculateArea() {
    const radius = parseFloat(prompt("Enter the radius of the circle:"));
    const area = Math.PI * Math.pow(radius, 2);
    document.getElementById('output').innerText = `The area of the circle is: ${area.toFixed(2)}`;
}

function absoluteValue() {
    const number = parseFloat(prompt("Enter a number:"));
    const absValue = Math.abs(number);
    document.getElementById('output').innerText = `The absolute value of ${number} is: ${absValue}`;
}

function selectionMenu() {
    const menuHtml = `
        <button onclick="profitLossProgram()">1. Profit and Loss Program</button>
        <button onclick="temperatureProgram()">2. Temperature Conversion</button>
        <button onclick="pizzaOrder()">3. Pizza Order Program</button>
        <button onclick="monthsOfYear()">4. Months of the Year</button>
        <button onclick="boysGirlsInClass()">5. Boys and Girls in Class</button>
        <button onclick="waterIntake()">6. Daily Water Intake</button>
        <button onclick="planningOfDay()">7. Planning of the Day</button>
        <button onclick="mainMenu()">8. Back to Main Menu</button>
    `;
    document.getElementById('menu').innerHTML = menuHtml;
}

function profitLossProgram() {
    const costPrice = parseFloat(prompt("Enter Cost Price:"));
    const sellingPrice = parseFloat(prompt("Enter Selling Price:"));
    let message;
    if (sellingPrice > costPrice) {
        const profit = sellingPrice - costPrice;
        message = `Profit: $${profit.toFixed(2)}`;
    } else if (sellingPrice < costPrice) {
        const loss = costPrice - sellingPrice;
        message = `Loss: $${loss.toFixed(2)}`;
    } else {
        message = "No Profit No Loss";
    }
    document.getElementById('output').innerText = message;
}

function temperatureProgram() {
    const celsius = parseFloat(prompt("Enter temperature in Celsius:"));
    const fahrenheit = (celsius * 9/5) + 32;
    document.getElementById('output').innerText = `${celsius}°C is equal to ${fahrenheit.toFixed(2)}°F`;
}

function pizzaOrder() {
    const size = prompt("Enter pizza size (small, medium, large):").toLowerCase();
    let price;
    if (size === "small") {
        price = 8;
    } else if (size === "medium") {
        price = 10;
    } else if (size === "large") {
        price = 12;
    } else {
        document.getElementById('output').innerText = "Invalid size.";
        return;
    }
    document.getElementById('output').innerText = `The price for a ${size} pizza is $${price}.`;
}

function monthsOfYear() {
    const monthNumber = parseInt(prompt("Enter month number (1-12):"));
    let monthName;
    switch (monthNumber) {
        case 1: monthName = "January"; break;
        case 2: monthName = "February"; break;
        case 3: monthName = "March"; break;
        case 4: monthName = "April"; break;
        case 5: monthName = "May"; break;
        case 6: monthName = "June"; break;
        case 7: monthName = "July"; break;
        case 8: monthName = "August"; break;
        case 9: monthName = "September"; break;
        case 10: monthName = "October"; break;
        case 11: monthName = "November"; break;
        case 12: monthName = "December"; break;
        default: monthName = "Invalid month.";
    }
    document.getElementById('output').innerText = `Month: ${monthName}`;
}

function boysGirlsInClass() {
    const boys = parseInt(prompt("Enter the number of boys in the class:"));
    const girls = parseInt(prompt("Enter the number of girls in the class:"));
    const total = boys + girls;
    document.getElementById('output').innerText = `Total students in class: ${total} (Boys: ${boys}, Girls: ${girls})`;
}

function waterIntake() {
    const waterIntake = parseFloat(prompt("How much water do you drink a day (in liters)?"));
    document.getElementById('output').innerText = `You drink ${waterIntake} liters of water a day.`;
}

function planningOfDay() {
    const plan = prompt("What is your plan for the day? (Work, Study, Relax)");
    let message;
    if (plan === "Work") {
        message = "Stay focused and keep your productivity high!";
    } else if (plan === "Study") {
        message = "Make sure to take breaks and stay hydrated!";
    } else if (plan === "Relax") {
        message = "Enjoy your time and recharge!";
    } else {
        message = "That's a great plan!";
    }
    document.getElementById('output').innerText = message;
}

function loopMenu() {
    const menuHtml = `
        <button onclick="sumOf10PositiveNumbers()">1. Sum of 10 Positive Numbers</button>
        <button onclick="firstTenOddNumbers()">2. First 10 Odd Numbers</button>
        <button onclick="factorialProgram()">3. Factorial of a Number</button>
        <button onclick="countVowelsInString()">4. Count Vowels in a String</button>
        <button onclick="mainMenu()">5. Back to Main Menu</button>
    `;
    document.getElementById('menu').innerHTML = menuHtml;
}

function sumOf10PositiveNumbers() {
    let sum = 0;
    for (let i = 1; i <= 11; i++) {
        const number = parseFloat(prompt(`Enter positive number ${i}:`));
        while (number < 0) {
            alert("Please enter a positive number.");
            const number = parseFloat(prompt(`Enter positive number ${i}:`));
        }
        sum += number;
    }
    document.getElementById('output').innerText = `Sum of 10 positive numbers: ${sum}`;
}

function firstTenOddNumbers() {
    let oddNumbers = "";
    for (let i = 1; i <= 20; i += 2) {
        oddNumbers += `${i}\n`;
    }
    document.getElementById('output').innerText = `First 10 odd numbers:\n${oddNumbers}`;
}

function factorialProgram() {
    const number = parseInt(prompt("Enter a number to calculate its factorial:"));
    let factorial = 1;
    for (let i = 1; i <= number; i++) {
        factorial *= i;
    }
    document.getElementById('output').innerText = `Factorial of ${number} is ${factorial}`;
}

function countVowelsInString() {
    const str = prompt("Enter a string:");
    const vowels = "aeiouAEIOU";
    let count = 0;
    for (const char of str) {
        if (vowels.includes(char)) {
            count++;
        }
    }
    document.getElementById('output').innerText = `Number of vowels in the string: ${count}`;
}

function exitProgram() {
    document.getElementById('menu').innerHTML = '';
    document.getElementById('output').innerText = 'Exiting the program. Goodbye!';
}

// Start the program
mainMenu();



//exam lap questions
function fullName(){
    document.getElementById('name').innerText = 'Asiya\nIbrahim\nIsmail';
};


// the calculator program


function calculator() {
    let result;
    const outputElement = document.getElementById('calculatorOutput'); // Assuming there's an element with id 'calculatorOutput' to display messages

    while (true) {
        const operation = prompt("Enter operation (+, -, *, /) or 1 to quit:");

        if (operation === '1') {
            outputElement.innerText = "Exiting the calculator.";
            break;
        }

        const num1 = parseFloat(prompt("Enter the first number:"));
        const num2 = parseFloat(prompt("Enter the second number:"));

        switch (operation) {
            case '+':
                result = num1 + num2;
                break;
            case '-':
                result = num1 - num2;
                break;
            case '*':
                result = num1 * num2;
                break;
            case '/':
                if (num2 !== 0) {
                    result = num1 / num2;
                } else {
                    outputElement.innerText = "Cannot divide by zero.";
                    continue;
                }
                break;
            default:
                outputElement.innerText = "Invalid operation. Please try again.";
                continue;
        }

        outputElement.innerText = `Result: ${result}`;
    }
}

// daily routine program

function logDailyRoutine() {
    let activitiesText = ''; // Variable to hold the activities text

    for (let hour = 4; hour <= 15; hour++) { // Loop from 4 AM (4) to 3 PM (15)
        let activity;

        switch (hour) {
            case 4:
                activity = "Wake up, prepare for prayer, and read the Quran.";
                break;
            case 5:
                activity = "Doing something from home.";
                break;
            case 6:
                activity = "Preparing to go to university.";
                break;
            case 7:
                activity = "Travel to university.";
                break;
            case 8:
                activity = "Attend classes.";
                break;
            case 9:
                activity = "Study or do assignments.";
                break;
            case 10:
                activity = "Have a break and going duha prayer.";
                break;
            case 11:
                activity = "Continue with classes or study.";
                break;
            case 12:
                activity = "Lunch break.";
                break;
            case 13:
                activity = "Complete afternoon classes.";
                break;
            case 14:
                activity = "Wrap up studies or assignments.";
                break;
            case 15:
                activity = "Prepare to return home.";
                break;
            default:
                activity = "Free time or other activities.";
        }

        // Append each activity to the activitiesText string
        activitiesText += `At ${hour % 12 || 12} ${hour < 12 ? 'AM' : 'PM'}: ${activity}<br>`;
    }

    // Display all activities in the activityDisplay div
    document.getElementById('activityDisplay').innerHTML = activitiesText;
}


// chapte five.


function showNames() {
    const names = ["Ahmed", "mohamed", "Ali"];
    document.getElementById('output').innerHTML = `Literal Names: ${names.join(', ')}`;
}

function showNamesConstructor() {
    const namesC = new Array("Ahmed", "mohamed", "Ali");
    document.getElementById('output').innerHTML = `Constructor Names: ${namesC.join(', ')}`;
}

function showEmptyArray() {
    const myArray = [];
    myArray[0] = "first";
    myArray[1] = "second";
    document.getElementById('output').innerHTML = `Empty Array Example: ${myArray.join(', ')}`;
}

function showArrayFrom() {
    const arrayFormStr = Array.from("hello");
    document.getElementById('output').innerHTML = `Array.from Example: ${arrayFormStr.join(', ')}`;
}

function showArrayInitializer() {
    const newArray = new Array(3);
    document.getElementById('output').innerHTML = `Array Initializer Example: ${newArray}`;
}

function showSpreadOperator() {
    const sourceArray = [1, 2, 3];
    document.getElementById('output').innerHTML = `Array Spread Operator Example: ${sourceArray.join(', ')}`;
}

function showArrayOf() {
    const myArray2 = Array.of(1, 2, 3);
    document.getElementById('output').innerHTML = `Array.of Example: ${myArray2.join(', ')}`;
}

function addElementsPush() {
    const fruits = ["Apple", "Banana"];
    fruits.push("Mango");
    document.getElementById('output').innerHTML = `Adding Elements using Push: ${fruits.join(', ')}`;
}

function addElementsUnshift() {
    const fruits2 = ["Banana", "Mango"];
    fruits2.unshift("Apple");
    document.getElementById('output').innerHTML = `Adding Elements using Unshift: ${fruits2.join(', ')}`;
}

function addElementsIndex() {
    const fruits3 = ["Apple", "Banana", "Mango"];
    fruits3[1] = "Mango";
    document.getElementById('output').innerHTML = `Adding Elements using Index: ${fruits3.join(', ')}`;
}

function removeElementsPop() {
    const fruits4 = ["Apple", "Banana", "Cherry"];
    fruits4.pop();
    document.getElementById('output').innerHTML = `Removing Elements using Pop: ${fruits4.join(', ')}`;
}

function removeElementsShift() {
    const fruits5 = ["Apple", "Banana", "Mango"];
    fruits5.shift();
    document.getElementById('output').innerHTML = `Removing Elements using Shift: ${fruits5.join(', ')}`;
}

function removeElementsSplice() {
    const fruits6 = ["Apple", "Banana", "Mango", "Tomato"];
    fruits6.splice(1, 2);
    document.getElementById('output').innerHTML = `Removing Elements using Splice: ${fruits6.join(', ')}`;
}

function showStudents() {
    const students = [
        { name: "Asiya", gender: "female", university: "Jazeera" },
        { name: "Amina", gender: "female", university: "Jazeera" },
        { name: "Omar", gender: "male", university: "Jazeera" },
        { name: "Abdi", gender: "male", university: "Jazeera" }
    ];
    const studentNames = students.map(std => std.name).join(', ');
    document.getElementById('output').innerHTML = `Students: ${studentNames}`;
}

function countVowelsAndConsonants() {
    const name = "Asiya";
    const vowelsList = [];
    const consonantsList = [];
    const vowels = "aeiouAEIOU";

    for (const char of name) {
        if (vowels.includes(char)) {
            vowelsList.push(char);
        } else if (char.match(/[a-zA-Z]/)) { // Check if it's a letter
            consonantsList.push(char);
        }
    }

    const vowelCount = vowelsList.length;
    const consonantCount = consonantsList.length;
    document.getElementById('output').innerHTML = `Count Vowels and Consonants for "${name}":<br>
               Vowels (${vowelCount}): ${vowelsList.join(', ')}<br>
               Consonants (${consonantCount}): ${consonantsList.join(', ')}`;
}

function separateEvenOdd() {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const evenNumbers = [];
    const oddNumbers = [];
    for (const number of numbers) {
        if (number % 2 === 0) {
            evenNumbers.push(number);
        } else {
            oddNumbers.push(number);
        }
    }
    document.getElementById('output').innerHTML = `Even Numbers: ${evenNumbers.join(', ')}<br>Odd Numbers: ${oddNumbers.join(', ')}`;
}

function showJsonExample() {
    const jsonExample = {
        "name": "Asiya",
        "Age": 30,
        "city": "Mogadishu"
    };
    document.getElementById('output').innerHTML = `JSON Example: ${JSON.stringify(jsonExample, null, 2)}`;
}

function showNestingJson() {
    const nestingJson = {
        "person": { "name": "Aisha", "grade": 90 },
        "hobbies": ["Reciting Quran", "Praying", "Reading", "Swimming"]
    };
    document.getElementById('output').innerHTML = `Nesting JSON Example: ${JSON.stringify(nestingJson, null, 2)}`;
}

function createPerson() {
    const PERSON = { "name": "Asiya", "Age": 30, "city": "Mogadishu" };
    document.getElementById('output').innerHTML = `Person Object: ${JSON.stringify(PERSON, null, 2)}`;
}

function createPersonClass() {
    class Person {
        constructor(fname, lname, grades) {
            this.firstName = fname;
            this.lastName = lname;
            this.grades = grades;
        }
    }
    const person5 = new Person("Fatima", "Abdi", 100);
    document.getElementById('output').innerHTML = `Person Class Instance: ${JSON.stringify(person5, null, 2)}`;
}





//chapter six DOM EXAMPLES

// example 1:
function example1() {
    let contentElement = document.getElementById("content");

   
    contentElement.style.background = "#ed11df";
    contentElement.style.color = "white";
}

// Example 2
function example2() {
    let boxElements = document.getElementsByClassName("box");

    for (let i = 0; i < boxElements.length; i++) {
        boxElements[i].style.border = "3px dashed blue";
        boxElements[i].style.color="blue";


    }

    let paragraphElements = document.getElementsByTagName("p");

    for (let i = 0; i < paragraphElements.length; i++) {
        paragraphElements[i].style.fontStyle = "italic";
        paragraphElements[i].style.margin = "10px";
    }
}

// Example 3:
function example3() {
    let firsth5 = document.querySelector("h5");

    // Modifying first h5 style
    firsth5.style.color = "#ed11df";
    
}

// Example 4:
function example4() {
    let allh4 = document.querySelectorAll("h4");
    let allBoxes = document.querySelectorAll("div.box4");

    allh4.forEach((paragraph) => {
        paragraph.style.textDecoration = "underline";
    });

    allBoxes.forEach((box4) => {
        box4.style.backgroundColor = "#ed11df";
        box4.style.Color = "white";

    });
}




// Example 5: Using innerHTML and href
function example5() {
    let element = document.getElementById("myId").innerHTML;
    console.log("Element content: " + element);

    
}




// Example 6: Modifying text using innerText and textContent
function example6() {
    let paragraph = document.getElementById("paragraph");
    paragraph.innerText = "Setting p tag text using innerText property";
    paragraph.textContent = "Setting p tag text using textContent property";
}

// Example 7: Get anchor by ID
function example7() {
    let anchor = document.getElementById("my-link2");
    console.log("Anchor element: ", anchor);
}

// Example 8: setAttribute and createElement
function example8() {
    let newElement = document.createElement("p");
    
    newElement.innerText = "This is a dynamically created paragraph.";

    newElement.setAttribute("class", "dynamic-paragraph");

    // Append the new element to a specific container (not the entire body)
    let container = document.getElementById("output-container");
    if (container) {
        container.appendChild(newElement);
    } else {
        alert("Output container not found!");
    }
}



// Example 9: Remove child and append child
function example9() {
    let element = document.getElementById("paragraphToRemove");
    let span = document.getElementById("spanToRemove");

    // Removing element or child
    element.remove();
    span.remove();

    let createdElement = document.createElement("p");
    createdElement.innerText = "This is a new created element";
    document.body.appendChild(createdElement);
}

// Example 10: Replace child element
function example10() {
    let oldElement = document.getElementById("paragraphToReplace");

    if (oldElement) {
        let newElement = document.createElement("p");
        newElement.innerText = ""
        
        let parent = oldElement.parentNode; // Get the parent
        parent.replaceChild(newElement, oldElement); // Replace old with new
    } else {
        alert("Element to replace not found!");
    }
}

// Example 11: Insert before and replace child
function example11() {
    // Find elements
    let parentElement = document.getElementById("paragraphToInsertBefore").parentNode; // Get the parent
    let existingSpan = document.getElementById("spanToInsertBefore");

    // Step 1: Insert a new span before the existing span
    let newSpan = document.createElement("span");
    newSpan.innerText = "🔹New span element🔹";

    if (parentElement && existingSpan) {
        parentElement.insertBefore(newSpan, existingSpan);
    } else {
        alert("Required elements for insertion not found!");
    }

    // Step 2: Replace the paragraph
    let oldParagraph = document.getElementById("paragraphToInsertBefore");
    let newParagraph = document.createElement("p");
    newParagraph.innerText = "This is a new paragraph replacing the old one.✔️";

    if (parentElement && oldParagraph) {
        parentElement.replaceChild(newParagraph, oldParagraph);
    } else {
        alert("Required elements for replacement not found!");
    }
}

    



let paragraph = null; // Global variable 

function example13() {
    const button = document.querySelector("button[onclick='example13()']"); 
    if (!paragraph) {
        paragraph = document.createElement("p");
        paragraph.innerText = "This is a new appended paragraph.";

    } else {
        paragraph.remove();
        
    }
}







// chapter seven7

const element1 = document.getElementById("myButton");
element1.addEventListener("click", myFunction);
function myFunction(){
  alert("Button clicked!");
}

//example2
let element2 = document.getElementById("myElement");

//mouseover event

element2.addEventListener("mouseover", function(){
    element2.style.backgroundColor = "green";
});

//mouseover event
element2.addEventListener("mouseout", function(){
  element2.style.backgroundColor = "blue";
});


//example3

const textInput = document.getElementById("textInput");
const outputDiv = document.getElementById("output1");

textInput.addEventListener("keydown", function (event) {
    outputDiv.innerText = `- Keydown: ${event.key}`;
});

textInput.addEventListener("keypress", function (event) {
    outputDiv.innerText += `\n Keypress: ${event.key}`;
});

textInput.addEventListener("keyup", function (event) {
    outputDiv.innerText += `\n Keyup: ${event.key}`;
});

//example4

const textInput2 = document.getElementById("textInput2");
const outputDiv2 = document.getElementById("output2");

textInput.addEventListener("focus", function () {
    updateOutput("Element focused!", "focused");
});

textInput.addEventListener("blur", function () {
    updateOutput("Element blurred!", "blurred");
});

function updateOutput(message, className) {
  outputDiv2.innerText = message;
  outputDiv2.className = className;
}

//example five

const textInput3 = document.getElementById("input3");
const outputDiv3 = document.getElementById("output3");
const form = document.getElementById("myform");

textInput3.addEventListener("input", function () {
  if (textInput3.value != "") {
    updateOutput2("Input changed!", "valid");
  } else {
    updateOutput2("Input changed with empty!", "invalid");
  }
});


form.addEventListener("submit", function (event) {
  event.preventDefault(); 
  updateOutput2("Form submitted!", "valid");
});

function updateOutput2(message2, className2) {
  outputDiv3.innerText = message2;
  outputDiv3.className = className2;
}


let Button =document.querySelector("button1");

Button.addEventListener("mouseover",()=> {
     document.body.style = "background color: cyan";
});
Button.addEventListener("mouseleave",()=> {
  document.body.style = "background color: gray";
});




