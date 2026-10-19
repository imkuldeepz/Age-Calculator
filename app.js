// State Management
const state = {
    dob: null,
    liveInterval: null,
    theme: localStorage.getItem('agewise_theme') || 'light'
};

// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const dobInput = document.getElementById('dob');
const dobDay = document.getElementById('dobDay');
const dobMonth = document.getElementById('dobMonth');
const dobYear = document.getElementById('dobYear');
const validationError = document.getElementById('validationError');
const validationText = document.getElementById('validationText');

// Results Elements
const yearsVal = document.getElementById('yearsVal');
const monthsVal = document.getElementById('monthsVal');
const daysVal = document.getElementById('daysVal');
const hoursVal = document.getElementById('hoursVal');
const minutesVal = document.getElementById('minutesVal');
const secondsVal = document.getElementById('secondsVal');

const totalMonths = document.getElementById('totalMonths');
const totalWeeks = document.getElementById('totalWeeks');
const totalDays = document.getElementById('totalDays');
const totalHours = document.getElementById('totalHours');
const totalMinutes = document.getElementById('totalMinutes');
const totalHeartbeats = document.getElementById('totalHeartbeats');

const birthWeekday = document.getElementById('birthWeekday');
const zodiacSign = document.getElementById('zodiacSign');
const nextBirthdayDays = document.getElementById('nextBirthdayDays');

// Initialize Theme
function initTheme() {
    if (state.theme === 'dark') {
        document.documentElement.classList.add('dark');
        themeIcon.className = 'fa-solid fa-sun text-lg text-amber-400';
    } else {
        document.documentElement.classList.remove('dark');
        themeIcon.className = 'fa-solid fa-moon text-lg';
    }
}

themeToggle.addEventListener('click', () => {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('agewise_theme', state.theme);
    initTheme();
});

// Populate Select Dropdowns
function populateSelectors() {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Days
    dobDay.innerHTML = '<option value="">Day</option>';
    for (let i = 1; i <= 31; i++) {
        dobDay.innerHTML += `<option value="${i}">${i}</option>`;
    }

    // Months
    dobMonth.innerHTML = '<option value="">Month</option>';
    months.forEach((m, idx) => {
        dobMonth.innerHTML += `<option value="${idx}">${m}</option>`;
    });

    // Years
    const currentYr = new Date().getFullYear();
    dobYear.innerHTML = '<option value="">Year</option>';
    for (let y = currentYr; y >= 1900; y--) {
        dobYear.innerHTML += `<option value="${y}">${y}</option>`;
    }

    document.getElementById('currentYear').textContent = currentYr;
}

// Zodiac Sign Calculation
function getZodiacSign(day, month) {
    const zodiacs = [
        { name: "Capricorn ♑", start: [12, 22], end: [1, 19] },
        { name: "Aquarius ♒", start: [1, 20], end: [2, 18] },
        { name: "Pisces ♓", start: [2, 19], end: [3, 20] },
        { name: "Aries ♈", start: [3, 21], end: [4, 19] },
        { name: "Taurus ♉", start: [4, 20], end: [5, 20] },
        { name: "Gemini ♊", start: [5, 21], end: [6, 20] },
        { name: "Cancer ♋", start: [6, 21], end: [7, 22] },
        { name: "Leo ♌", start: [7, 23], end: [8, 22] },
        { name: "Virgo ♍", start: [8, 23], end: [9, 22] },
        { name: "Libra ♎", start: [9, 23], end: [10, 22] },
        { name: "Scorpio ♏", start: [10, 23], end: [11, 21] },
        { name: "Sagittarius ♐", start: [11, 22], end: [12, 21] }
    ];

    month = month + 1; // 1-indexed month
    for (let z of zodiacs) {
        if ((month === z.start[0] && day >= z.start[1]) || (month === z.end[0] && day <= z.end[1])) {
            return z.name;
        }
    }
    return "Capricorn ♑";
}

// Core Age Calculation Function
function calculateAge(birthDate, targetDate = new Date()) {
    let years = targetDate.getFullYear() - birthDate.getFullYear();
    let months = targetDate.getMonth() - birthDate.getMonth();
    let days = targetDate.getDate() - birthDate.getDate();

    if (days < 0) {
        months--;
        const prevMonthLastDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0).getDate();
        days += prevMonthLastDay;
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    const diffTime = Math.abs(targetDate - birthDate);
    const totalDaysVal = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const totalHoursVal = Math.floor(diffTime / (1000 * 60 * 60));
    const totalMinutesVal = Math.floor(diffTime / (1000 * 60));
    const totalWeeksVal = Math.floor(totalDaysVal / 7);
    const totalMonthsVal = (years * 12) + months;
    const heartbeats = totalMinutesVal * 70; // Avg 70 bpm

    return {
        years, months, days,
        totalMonths: totalMonthsVal,
        totalWeeks: totalWeeksVal,
        totalDays: totalDaysVal,
        totalHours: totalHoursVal,
        totalMinutes: totalMinutesVal,
        heartbeats
    };
}

// Next Birthday Countdown Calculation
function getNextBirthdayInfo(birthDate) {
    const today = new Date();
    today.setHours(0,0,0,0);

    let nextBday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (nextBday < today) {
        nextBday.setFullYear(today.getFullYear() + 1);
    }

    const diffDays = Math.ceil((nextBday - today) / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? "Today! 🎉" : `${diffDays} days away`;
}

// Sync Dropdowns and Input Date
function syncInputs(source) {
    if (source === 'datePicker') {
        const val = dobInput.value;
        if (val) {
            const d = new Date(val + 'T00:00:00');
            dobDay.value = d.getDate();
            dobMonth.value = d.getMonth();
            dobYear.value = d.getFullYear();
        }
    } else {
        const day = dobDay.value;
        const month = dobMonth.value;
        const year = dobYear.value;
        if (day && month !== "" && year) {
            const mStr = String(parseInt(month) + 1).padStart(2, '0');
            const dStr = String(day).padStart(2, '0');
            dobInput.value = `${year}-${mStr}-${dStr}`;
        }
    }
    triggerCalculation();
}

function triggerCalculation() {
    const val = dobInput.value;
    if (!val) return;

    const birthDate = new Date(val + 'T00:00:00');
    const now = new Date();

    if (isNaN(birthDate.getTime()) || birthDate > now) {
        validationError.classList.remove('hidden');
        validationText.textContent = birthDate > now ? "Birth date cannot be in the future!" : "Invalid birth date.";
        return;
    }

    validationError.classList.add('hidden');
    state.dob = birthDate;

    // Start Live Ticker
    if (state.liveInterval) clearInterval(state.liveInterval);
    updateLiveDisplays();
    state.liveInterval = setInterval(updateLiveDisplays, 1000);

    // Update Metadata
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    birthWeekday.textContent = daysOfWeek[birthDate.getDay()];
    zodiacSign.textContent = getZodiacSign(birthDate.getDate(), birthDate.getMonth());
    nextBirthdayDays.textContent = getNextBirthdayInfo(birthDate);

    // Update Matrix
    renderLifeGrid(birthDate);
}

function updateLiveDisplays() {
    if (!state.dob) return;
    const now = new Date();
    const age = calculateAge(state.dob, now);

    yearsVal.textContent = age.years;
    monthsVal.textContent = age.months;
    daysVal.textContent = age.days;

    hoursVal.textContent = String(now.getHours()).padStart(2, '0');
    minutesVal.textContent = String(now.getMinutes()).padStart(2, '0');
    secondsVal.textContent = String(now.getSeconds()).padStart(2, '0');

    totalMonths.textContent = age.totalMonths.toLocaleString();
    totalWeeks.textContent = age.totalWeeks.toLocaleString();
    totalDays.textContent = age.totalDays.toLocaleString();
    totalHours.textContent = age.totalHours.toLocaleString();
    totalMinutes.textContent = age.totalMinutes.toLocaleString();
    totalHeartbeats.textContent = age.heartbeats.toLocaleString();
}

// Render 80-Year Life Grid
function renderLifeGrid(birthDate) {
    const grid = document.getElementById('lifeGrid');
    grid.innerHTML = '';
    const now = new Date();
    const livedYears = now.getFullYear() - birthDate.getFullYear();

    for (let i = 1; i <= 80; i++) {
        const dot = document.createElement('div');
        dot.className = `w-full aspect-square rounded-full transition-all ${
            i <= livedYears 
            ? 'bg-brand-600 dark:bg-indigo-500 shadow-sm' 
            : 'bg-slate-200 dark:bg-slate-800'
        }`;
        dot.title = `Year ${i}`;
        grid.appendChild(dot);
    }
    document.getElementById('matrixStats').textContent = `${Math.min(livedYears, 80)} / 80 Years Lived`;
}

// Gemini API Prompt Logic
async function generateAIInsights() {
    if (!state.dob) {
        showToast("Please select your date of birth first!", "error");
        return;
    }

    const aiLoading = document.getElementById('aiLoading');
    const aiContent = document.getElementById('aiContent');
    const aiBadge = document.getElementById('aiBadge');

    aiLoading.classList.remove('hidden');
    aiContent.classList.add('opacity-40');

    const now = new Date();
    const age = calculateAge(state.dob, now);
    const birthYear = state.dob.getFullYear();

    const prompt = `Act as an expert historian, life coach, and demographic researcher. Analyze a person born on ${state.dob.toDateString()} (Current age: ${age.years} years, ${age.months} months).
    Provide structured JSON output with the following exact schema:
    {
        "summary": "A warm, inspiring 2-sentence summary of what this exact age stage represents in life.",
        "goals": ["Specific goal 1 for this age group", "Specific goal 2 for this age group", "Specific goal 3"],
        "eraFacts": "2 key historical, technological, or cultural milestones from the year ${birthYear}.",
        "birthdayWish": "A joyful, tailored birthday wish for their next milestone age (${age.years + 1})."
    }`;

    const systemPrompt = "You are a precise, friendly life-insight AI. Output ONLY valid JSON matching the requested schema.";

    try {
        const apiKey = ""; // Canvas runtime environment automatically provides the API key when empty
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                systemInstruction: { parts: [{ text: systemPrompt }] },
                generationConfig: { responseMimeType: "application/json" }
            })
        });

        const data = await response.json();
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            const parsed = JSON.parse(data.candidates[0].content.parts[0].text);

            document.getElementById('aiSummary').textContent = parsed.summary;
            document.getElementById('aiEraFacts').textContent = parsed.eraFacts;
            document.getElementById('aiBirthdayWish').textContent = `"${parsed.birthdayWish}"`;

            const goalsList = document.getElementById('aiGoals');
            goalsList.innerHTML = '';
            parsed.goals.forEach(g => {
                const li = document.createElement('li');
                li.textContent = g;
                goalsList.appendChild(li);
            });

            aiBadge.innerHTML = `<i class="fa-solid fa-sparkles text-amber-400"></i> Powered live by Gemini AI`;
            showToast("Gemini AI Insights generated successfully!");
        } else {
            throw new Error("Invalid API payload");
        }
    } catch (err) {
        console.warn("API Call unavailable. Engaging fallback engine:", err);
        // Smart Offline Fallback
        applyFallbackInsights(age.years, birthYear);
        aiBadge.innerHTML = `<i class="fa-solid fa-bolt text-indigo-400"></i> Smart Fallback Engine Active`;
        showToast("Insights generated via Smart Local Engine.");
    } finally {
        aiLoading.classList.add('hidden');
        aiContent.classList.remove('opacity-40');
    }
}

// Local Dynamic Fallback Engine
function applyFallbackInsights(years, birthYear) {
    document.getElementById('aiSummary').textContent = `At ${years} years young, you are in a vibrant chapter of continuous growth, experience accumulation, and developing wisdom across personal and professional horizons.`;

    document.getElementById('aiEraFacts').textContent = `In ${birthYear}, the world experienced pivotal innovations and unique pop-culture shifts that framed the global environment into which you were born.`;

    document.getElementById('aiBirthdayWish').textContent = `"May your upcoming ${years + 1}th year bring clarity of purpose, joyful connections, and significant milestones towards your personal dreams!"`;

    const goals = [
        `Prioritize long-term vitality, dynamic physical health, and sleep hygiene.`,
        `Cultivate meaningful relationships and deep professional or creative skillsets.`,
        `Establish intentional yearly reflection habits to track your personal growth.`
    ];

    const goalsList = document.getElementById('aiGoals');
    goalsList.innerHTML = '';
    goals.forEach(g => {
        const li = document.createElement('li');
        li.textContent = g;
        goalsList.appendChild(li);
    });
}

// Toolkit: Date Difference
document.getElementById('btnCalcDiff').addEventListener('click', () => {
    const startVal = document.getElementById('diffStart').value;
    const endVal = document.getElementById('diffEnd').value;
    const out = document.getElementById('diffOutput');

    if (!startVal || !endVal) {
        showToast("Please select both dates.", "error");
        return;
    }

    const d1 = new Date(startVal + 'T00:00:00');
    const d2 = new Date(endVal + 'T00:00:00');

    if (d1 > d2) {
        showToast("Start date must precede end date.", "error");
        return;
    }

    const age = calculateAge(d1, d2);
    out.textContent = `Interval: ${age.years} Years, ${age.months} Months, ${age.days} Days (${age.totalDays.toLocaleString()} total days)`;
    out.classList.remove('hidden');
});

// Toolkit: Target Date Age
document.getElementById('btnCalcTarget').addEventListener('click', () => {
    if (!state.dob) {
        showToast("Please select your birth date above first.", "error");
        return;
    }
    const targetVal = document.getElementById('targetDateInput').value;
    const out = document.getElementById('targetOutput');

    if (!targetVal) {
        showToast("Please select a target date.", "error");
        return;
    }

    const targetDate = new Date(targetVal + 'T00:00:00');
    if (targetDate < state.dob) {
        showToast("Target date must be after your birth date.", "error");
        return;
    }

    const age = calculateAge(state.dob, targetDate);
    out.textContent = `On ${targetDate.toLocaleDateString()}, you will be ${age.years} years, ${age.months} months, and ${age.days} days old.`;
    out.classList.remove('hidden');
});

// Toast Helper
function showToast(message, type = "success") {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    const toastIcon = document.getElementById('toastIcon');

    toastMsg.textContent = message;
    toastIcon.className = type === "error" 
        ? "fa-solid fa-circle-xmark text-rose-400" 
        : "fa-solid fa-circle-check text-emerald-400";

    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}

// Copy Results to Clipboard
document.getElementById('btnCopy').addEventListener('click', () => {
    if (!state.dob) {
        showToast("No active calculations to copy.", "error");
        return;
    }
    const text = `AgeWise AI Result: I am ${yearsVal.textContent} years, ${monthsVal.textContent} months, and ${daysVal.textContent} days old (${totalDays.textContent} total days lived!). Check yours at AgeWise AI.`;

    // Clipboard Fallback Strategy for iFrames
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);

    showToast("Results copied to clipboard!");
});

// Web Share
document.getElementById('btnShare').addEventListener('click', async () => {
    if (!state.dob) {
        showToast("No active calculations to share.", "error");
        return;
    }
    const shareData = {
        title: 'AgeWise AI Calculation',
        text: `I am ${yearsVal.textContent} years, ${monthsVal.textContent} months, and ${daysVal.textContent} days old!`,
        url: window.location.href
    };

    if (navigator.share) {
        try {
            await navigator.share(shareData);
        } catch (e) {
            console.log("Share cancelled");
        }
    } else {
        showToast("Web Share API not supported on this browser.", "error");
    }
});

// Print Report
document.getElementById('btnPrint').addEventListener('click', () => {
    if (!state.dob) {
        showToast("Please calculate your age before printing report.", "error");
        return;
    }
    window.print();
});

// Reset Button
document.getElementById('btnReset').addEventListener('click', () => {
    dobInput.value = '';
    dobDay.value = '';
    dobMonth.value = '';
    dobYear.value = '';
    state.dob = null;
    if (state.liveInterval) clearInterval(state.liveInterval);

    yearsVal.textContent = '0';
    monthsVal.textContent = '0';
    daysVal.textContent = '0';
    hoursVal.textContent = '00';
    minutesVal.textContent = '00';
    secondsVal.textContent = '00';

    totalMonths.textContent = '0';
    totalWeeks.textContent = '0';
    totalDays.textContent = '0';
    totalHours.textContent = '0';
    totalMinutes.textContent = '0';
    totalHeartbeats.textContent = '0';

    birthWeekday.textContent = '---';
    zodiacSign.textContent = '---';
    nextBirthdayDays.textContent = '---';

    renderLifeGrid(new Date());
    showToast("Calculator reset successfully.");
});

// Event Listeners
dobInput.addEventListener('change', () => syncInputs('datePicker'));
dobDay.addEventListener('change', () => syncInputs('selects'));
dobMonth.addEventListener('change', () => syncInputs('selects'));
dobYear.addEventListener('change', () => syncInputs('selects'));
document.getElementById('btnCalculate').addEventListener('click', triggerCalculation);
document.getElementById('btnGenerateAI').addEventListener('click', generateAIInsights);

// Page Load Default Initialization
window.onload = function() {
    initTheme();
    populateSelectors();

    // Set default date to Jan 1, 2000 for quick preview
    dobInput.value = '2000-01-01';
    syncInputs('datePicker');
};
