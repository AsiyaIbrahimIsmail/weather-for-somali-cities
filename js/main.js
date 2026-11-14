// ============================================
// Weather App - Enhanced Features
// ============================================

const API_KEY = window.OPENWEATHERMAP_API_KEY || "";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

function getApiKey() {
  if (!API_KEY || API_KEY === "YOUR_OPENWEATHERMAP_API_KEY") {
    throw new Error("Add your OpenWeatherMap API key to js/config.local.js.");
  }
  return API_KEY;
}

// Toast Notification System
function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  const icons = { success: "fa-check-circle", error: "fa-exclamation-circle", info: "fa-info-circle" };
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i> ${message}`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("toast-remove");
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Weather icon mapping
function getWeatherIcon(condition) {
  const map = {
    clear: "fa-sun", sunny: "fa-sun", "clear sky": "fa-sun",
    clouds: "fa-cloud", cloudy: "fa-cloud", "few clouds": "fa-cloud-sun",
    "scattered clouds": "fa-cloud", "broken clouds": "fa-cloud",
    "overcast clouds": "fa-cloud",
    rain: "fa-cloud-rain", "light rain": "fa-cloud-rain",
    "moderate rain": "fa-cloud-showers-heavy", "heavy rain": "fa-cloud-showers-heavy",
    drizzle: "fa-cloud-rain",
    thunderstorm: "fa-bolt", storm: "fa-bolt",
    snow: "fa-snowflake",
    mist: "fa-smog", fog: "fa-smog", haze: "fa-smog",
    smoke: "fa-smog", dust: "fa-smog", sand: "fa-smog",
    tornado: "fa-tornado", squall: "fa-wind",
  };
  const key = condition.toLowerCase();
  for (const [k, v] of Object.entries(map)) {
    if (key.includes(k)) return v;
  }
  return "fa-cloud-sun";
}

// Current Weather
async function getWeather() {
  const city = document.getElementById("city").value;
  const details = document.getElementById("weatherDetails");

  details.innerHTML = `
    <div class="loading-spinner">
      <i class="fas fa-spinner"></i>
      <p>Fetching weather for ${city}...</p>
    </div>`;

  try {
    const res = await fetch(`${BASE_URL}?q=${city}&units=metric&appid=${getApiKey()}`);
    if (!res.ok) throw new Error("City not found. Please check the spelling.");

    const data = await res.json();
    const temp = Math.round(data.main.temp);
    const feelsLike = Math.round(data.main.feels_like);
    const condition = data.weather[0].description;
    const humidity = data.main.humidity;
    const wind = data.wind.speed;
    const pressure = data.main.pressure;
    const icon = getWeatherIcon(condition);
    const now = new Date();

    details.innerHTML = `
      <div class="weather-card">
        <div class="weather-hero-area">
          <div class="weather-icon-wrap">
            <i class="fas ${icon} weather-icon-main"></i>
          </div>
          <div class="weather-info-main">
            <div class="weather-temp">${temp}°<small>C</small></div>
            <div class="weather-condition">${condition}</div>
            <div class="weather-location"><i class="fas fa-map-marker-alt"></i> ${city}, Somalia</div>
          </div>
        </div>
        <div class="weather-metrics">
          <div class="metric-card">
            <i class="fas fa-thermometer-half metric-icon"></i>
            <div class="metric-label">Feels Like</div>
            <div class="metric-value">${feelsLike}°C</div>
          </div>
          <div class="metric-card">
            <i class="fas fa-tint metric-icon"></i>
            <div class="metric-label">Humidity</div>
            <div class="metric-value">${humidity}%</div>
          </div>
          <div class="metric-card">
            <i class="fas fa-wind metric-icon"></i>
            <div class="metric-label">Wind Speed</div>
            <div class="metric-value">${wind} km/h</div>
          </div>
          <div class="metric-card">
            <i class="fas fa-compress-alt metric-icon"></i>
            <div class="metric-label">Pressure</div>
            <div class="metric-value">${pressure} hPa</div>
          </div>
          <div class="metric-card">
            <i class="fas fa-clock metric-icon"></i>
            <div class="metric-label">Updated</div>
            <div class="metric-value">${now.toLocaleTimeString()}</div>
          </div>
        </div>
      </div>`;
    showToast(`Weather loaded for ${city}`, "success");
  } catch (err) {
    details.innerHTML = `
      <div class="error-card">
        <i class="fas fa-exclamation-triangle"></i>
        <h3>Unable to load weather</h3>
        <p>${err.message}</p>
      </div>`;
    showToast(err.message, "error");
  }
}

// 5-Day Forecast
async function getWeatherForecast() {
  const city = document.getElementById("city").value;
  const details = document.getElementById("weatherDetails");

  details.innerHTML = `
    <div class="loading-spinner">
      <i class="fas fa-spinner"></i>
      <p>Loading forecast for ${city}...</p>
    </div>`;

  try {
    const res = await fetch(`${FORECAST_URL}?q=${city}&units=metric&appid=${getApiKey()}`);
    if (!res.ok) throw new Error("City not found");

    const data = await res.json();
    const dailyMap = {};

    data.list.forEach((item) => {
      const date = new Date(item.dt * 1000).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
      if (!dailyMap[date]) {
        dailyMap[date] = { temps: [], conditions: [], icons: [] };
      }
      dailyMap[date].temps.push(item.main.temp);
      dailyMap[date].conditions.push(item.weather[0].description);
      dailyMap[date].icons.push(getWeatherIcon(item.weather[0].description));
    });

    const days = Object.entries(dailyMap).slice(0, 5);

    details.innerHTML = `
      <div class="weather-card forecast-section">
        <div style="padding: 24px 28px 0">
          <div class="forecast-header">
            <h3><i class="fas fa-calendar-week"></i> 5-Day Forecast — ${city}</h3>
          </div>
        </div>
        <div style="padding: 4px 28px 28px">
          <div class="forecast-grid">
            ${days.map(([date, day]) => {
              const avgTemp = Math.round(day.temps.reduce((a, b) => a + b, 0) / day.temps.length);
              const modeCondition = day.conditions.sort((a, b) =>
                day.conditions.filter(c => c === a).length - day.conditions.filter(c => c === b).length
              ).pop();
              const icon = getWeatherIcon(modeCondition);
              return `
                <div class="forecast-card">
                  <div class="forecast-day">${date}</div>
                  <i class="fas ${icon} forecast-icon"></i>
                  <div class="forecast-temp">${avgTemp}°C</div>
                  <div class="forecast-cond">${modeCondition}</div>
                </div>`;
            }).join("")}
          </div>
        </div>
      </div>`;
    showToast(`Forecast loaded for ${city}`, "success");
  } catch (err) {
    details.innerHTML = `
      <div class="error-card">
        <i class="fas fa-exclamation-triangle"></i>
        <h3>Unable to load forecast</h3>
        <p>${err.message}</p>
      </div>`;
    showToast(err.message, "error");
  }
}

// Theme Toggle
function initTheme() {
  const saved = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", saved);
  const btn = document.getElementById("themeToggle");
  if (btn) {
    btn.innerHTML = saved === "dark" ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    btn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      btn.innerHTML = next === "dark" ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
      showToast(`Switched to ${next} mode`, "info");
    });
  }
}

// Back to Top
function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;
  window.addEventListener("scroll", () => {
    btn.classList.toggle("visible", window.scrollY > 400);
  });
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Hamburger Menu
function initHamburger() {
  const btn = document.getElementById("hamburgerBtn");
  const nav = document.getElementById("navLinks");
  if (btn && nav) {
    btn.addEventListener("click", () => nav.classList.toggle("show"));
    document.addEventListener("click", (e) => {
      if (!btn.contains(e.target) && !nav.contains(e.target)) {
        nav.classList.remove("show");
      }
    });
  }
}

// Share Weather on Twitter
function shareWeather() {
  const city = document.getElementById("city")?.value || "Somali";
  const text = encodeURIComponent(`Check out the weather in ${city}, Somalia! 🌤 #SomaliWeather`);
  window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank", "width=600,height=400");
}

// ============================================
// Form Validation - Enhanced
// ============================================

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Login Form
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");
  const toggleBtn = document.getElementById("togglePassword");

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);
      toggleBtn.classList.toggle("fa-eye-slash");
    });
  }

  emailInput.addEventListener("blur", () => {
    if (!validateEmail(emailInput.value)) {
      emailInput.classList.add("error");
      emailInput.classList.remove("success");
      emailError.textContent = "Please enter a valid email address";
    } else {
      emailInput.classList.remove("error");
      emailInput.classList.add("success");
      emailError.textContent = "";
    }
  });

  passwordInput.addEventListener("blur", () => {
    if (passwordInput.value.length < 6) {
      passwordInput.classList.add("error");
      passwordInput.classList.remove("success");
      passwordError.textContent = "Password must be at least 6 characters";
    } else {
      passwordInput.classList.remove("error");
      passwordInput.classList.add("success");
      passwordError.textContent = "";
    }
  });

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    let valid = true;

    if (!validateEmail(emailInput.value)) {
      emailInput.classList.add("error");
      emailError.textContent = "Please enter a valid email address";
      valid = false;
    }
    if (passwordInput.value.length < 6) {
      passwordInput.classList.add("error");
      passwordError.textContent = "Password must be at least 6 characters";
      valid = false;
    }

    if (!valid) {
      showToast("Please fix the errors above", "error");
      return;
    }

    const users = JSON.parse(localStorage.getItem("weatherUsers") || "[]");
    const user = users.find(u => u.email === emailInput.value);

    if (!user) {
      emailInput.classList.add("error");
      emailError.textContent = "No account found with this email";
      showToast("No account found with this email", "error");
      return;
    }

    if (user.password !== passwordInput.value) {
      passwordInput.classList.add("error");
      passwordError.textContent = "Incorrect password";
      showToast("Incorrect password", "error");
      return;
    }

    localStorage.setItem("weatherSession", JSON.stringify({ email: user.email, username: user.username }));
    showToast(`Welcome back, ${user.username}!`, "success");
    setTimeout(() => { window.location.href = "index.html"; }, 1200);
    this.reset();
    [emailInput, passwordInput].forEach(el => el.classList.remove("success"));
  });
}

// Sign Up Form
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  const usernameInput = document.getElementById("username");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmInput = document.getElementById("confirmPassword");
  const usernameError = document.getElementById("usernameError");
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");
  const confirmError = document.getElementById("confirmPasswordError");
  const strengthBar = document.getElementById("strengthBar");
  const toggleBtn = document.getElementById("togglePassword");
  const toggleConfirmBtn = document.getElementById("toggleConfirmPassword");

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);
      toggleBtn.classList.toggle("fa-eye-slash");
    });
  }

  if (toggleConfirmBtn) {
    toggleConfirmBtn.addEventListener("click", () => {
      const type = confirmInput.getAttribute("type") === "password" ? "text" : "password";
      confirmInput.setAttribute("type", type);
      toggleConfirmBtn.classList.toggle("fa-eye-slash");
    });
  }

  // Password strength
  passwordInput.addEventListener("input", () => {
    const val = passwordInput.value;
    let score = 0;
    if (val.length >= 6) score++;
    if (val.length >= 10) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    const levels = ["", "weak", "medium", "strong", "very-strong", "very-strong"];
    strengthBar.className = "strength-bar " + levels[score];
  });

  const validateField = (input, errorEl, check) => {
    input.addEventListener("blur", () => {
      const msg = check(input.value);
      if (msg) {
        input.classList.add("error");
        input.classList.remove("success");
        errorEl.textContent = msg;
      } else {
        input.classList.remove("error");
        input.classList.add("success");
        errorEl.textContent = "";
      }
    });
  };

  validateField(usernameInput, usernameError, (v) => v.trim().length < 3 ? "Username must be at least 3 characters" : "");
  validateField(emailInput, emailError, (v) => !validateEmail(v) ? "Please enter a valid email address" : "");
  validateField(passwordInput, passwordError, (v) => v.length < 6 ? "Password must be at least 6 characters" : "");

  confirmInput.addEventListener("blur", () => {
    if (confirmInput.value !== passwordInput.value) {
      confirmInput.classList.add("error");
      confirmInput.classList.remove("success");
      confirmError.textContent = "Passwords do not match";
    } else {
      confirmInput.classList.remove("error");
      confirmInput.classList.add("success");
      confirmError.textContent = "";
    }
  });

  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();
    let valid = true;

    if (usernameInput.value.trim().length < 3) {
      usernameInput.classList.add("error");
      usernameError.textContent = "Username must be at least 3 characters";
      valid = false;
    }
    if (!validateEmail(emailInput.value)) {
      emailInput.classList.add("error");
      emailError.textContent = "Please enter a valid email address";
      valid = false;
    }
    if (passwordInput.value.length < 6) {
      passwordInput.classList.add("error");
      passwordError.textContent = "Password must be at least 6 characters";
      valid = false;
    }
    if (confirmInput.value !== passwordInput.value) {
      confirmInput.classList.add("error");
      confirmError.textContent = "Passwords do not match";
      valid = false;
    }
    if (!document.getElementById("agreeTerms")?.checked) {
      showToast("Please agree to the Terms of Service", "error");
      valid = false;
    }

    if (!valid) {
      showToast("Please fix the errors above", "error");
      return;
    }

    const users = JSON.parse(localStorage.getItem("weatherUsers") || "[]");

    if (users.find(u => u.email === emailInput.value)) {
      emailInput.classList.add("error");
      emailError.textContent = "An account with this email already exists";
      showToast("An account with this email already exists", "error");
      return;
    }

    users.push({
      username: usernameInput.value.trim(),
      email: emailInput.value,
      password: passwordInput.value,
      created: new Date().toISOString()
    });
    localStorage.setItem("weatherUsers", JSON.stringify(users));

    showToast(`Account created! Welcome, ${usernameInput.value.trim()}!`, "success");
    setTimeout(() => { window.location.href = "log-in.html"; }, 1200);
    this.reset();
    [usernameInput, emailInput, passwordInput, confirmInput].forEach(el => el.classList.remove("success"));
    strengthBar.className = "strength-bar";
  });
}

// ============================================
// Initialize
// ============================================
// Session Management
function updateAuthUI() {
  const session = JSON.parse(localStorage.getItem("weatherSession") || "null");
  const loginBtn = document.getElementById("loginNavBtn");
  const signupBtn = document.getElementById("signupNavBtn");
  const userDisplay = document.getElementById("userDisplay");
  const userName = document.getElementById("userName");
  const logoutBtn = document.getElementById("logoutBtn");

  if (session && userDisplay) {
    if (loginBtn) loginBtn.style.display = "none";
    if (signupBtn) signupBtn.style.display = "none";
    userDisplay.style.display = "inline-flex";
    if (userName) userName.textContent = session.username;
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("weatherSession");
        showToast("Logged out successfully", "info");
        setTimeout(() => location.reload(), 800);
      });
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initBackToTop();
  initHamburger();
  updateAuthUI();
  if (document.getElementById("menu")) mainMenu();
});


// ============================================
// Educational Code (Chapters, Assignments, Lab)
// Kept intact below
// ============================================

// Chapter one examples.
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

function operations() {
    let choice;
    const outputElement = document.getElementById('output');

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
                outputElement.innerText = "Invalid choice!!";
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
            continue;
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
        case '1': result = num1 + num2; break;
        case '2': result = num1 - num2; break;
        case '3': result = num1 * num2; break;
        case '4': result = num1 / num2; break;
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

//exam lap questions
function fullName(){
    document.getElementById('name').innerText = 'Asiya\nIbrahim\nIsmail';
};

// the calculator program
function calculator() {
    let result;
    const outputElement = document.getElementById('calculatorOutput');
    while (true) {
        const operation = prompt("Enter operation (+, -, *, /) or 1 to quit:");
        if (operation === '1') {
            outputElement.innerText = "Exiting the calculator.";
            break;
        }
        const num1 = parseFloat(prompt("Enter the first number:"));
        const num2 = parseFloat(prompt("Enter the second number:"));
        switch (operation) {
            case '+': result = num1 + num2; break;
            case '-': result = num1 - num2; break;
            case '*': result = num1 * num2; break;
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
    let activitiesText = '';
    for (let hour = 4; hour <= 15; hour++) {
        let activity;
        switch (hour) {
            case 4: activity = "Wake up, prepare for prayer, and read the Quran."; break;
            case 5: activity = "Doing something from home."; break;
            case 6: activity = "Preparing to go to university."; break;
            case 7: activity = "Travel to university."; break;
            case 8: activity = "Attend classes."; break;
            case 9: activity = "Study or do assignments."; break;
            case 10: activity = "Have a break and going duha prayer."; break;
            case 11: activity = "Continue with classes or study."; break;
            case 12: activity = "Lunch break."; break;
            case 13: activity = "Complete afternoon classes."; break;
            case 14: activity = "Wrap up studies or assignments."; break;
            case 15: activity = "Prepare to return home."; break;
            default: activity = "Free time or other activities.";
        }
        activitiesText += `At ${hour % 12 || 12} ${hour < 12 ? 'AM' : 'PM'}: ${activity}<br>`;
    }
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
        } else if (char.match(/[a-zA-Z]/)) {
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
    const jsonExample = { "name": "Asiya", "Age": 30, "city": "Mogadishu" };
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
function example1() {
    let contentElement = document.getElementById("content");
    contentElement.style.background = "#ed11df";
    contentElement.style.color = "white";
}

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

function example3() {
    let firsth5 = document.querySelector("h5");
    firsth5.style.color = "#ed11df";
}

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

function example5() {
    let element = document.getElementById("myId").innerHTML;
    console.log("Element content: " + element);
}

function example6() {
    let paragraph = document.getElementById("paragraph");
    paragraph.innerText = "Setting p tag text using innerText property";
    paragraph.textContent = "Setting p tag text using textContent property";
}

function example7() {
    let anchor = document.getElementById("my-link2");
    console.log("Anchor element: ", anchor);
}

function example8() {
    let newElement = document.createElement("p");
    newElement.innerText = "This is a dynamically created paragraph.";
    newElement.setAttribute("class", "dynamic-paragraph");
    let container = document.getElementById("output-container");
    if (container) {
        container.appendChild(newElement);
    } else {
        alert("Output container not found!");
    }
}

function example9() {
    let element = document.getElementById("paragraphToRemove");
    let span = document.getElementById("spanToRemove");
    element.remove();
    span.remove();
    let createdElement = document.createElement("p");
    createdElement.innerText = "This is a new created element";
    document.body.appendChild(createdElement);
}

function example10() {
    let oldElement = document.getElementById("paragraphToReplace");
    if (oldElement) {
        let newElement = document.createElement("p");
        newElement.innerText = "";
        let parent = oldElement.parentNode;
        parent.replaceChild(newElement, oldElement);
    } else {
        alert("Element to replace not found!");
    }
}

function example11() {
    let parentElement = document.getElementById("paragraphToInsertBefore").parentNode;
    let existingSpan = document.getElementById("spanToInsertBefore");
    let newSpan = document.createElement("span");
    newSpan.innerText = "🔹New span element🔹";
    if (parentElement && existingSpan) {
        parentElement.insertBefore(newSpan, existingSpan);
    } else {
        alert("Required elements for insertion not found!");
    }
    let oldParagraph = document.getElementById("paragraphToInsertBefore");
    let newParagraph = document.createElement("p");
    newParagraph.innerText = "This is a new paragraph replacing the old one.✔️";
    if (parentElement && oldParagraph) {
        parentElement.replaceChild(newParagraph, oldParagraph);
    } else {
        alert("Required elements for replacement not found!");
    }
}

let paragraph = null;

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

let element2 = document.getElementById("myElement");
element2.addEventListener("mouseover", function(){
    element2.style.backgroundColor = "green";
});
element2.addEventListener("mouseout", function(){
  element2.style.backgroundColor = "blue";
});

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

let Button = document.querySelector("button1");
Button.addEventListener("mouseover",()=> {
     document.body.style = "background color: cyan";
});
Button.addEventListener("mouseleave",()=> {
  document.body.style = "background color: gray";
});
