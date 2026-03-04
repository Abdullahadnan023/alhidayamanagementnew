const statusEl = document.getElementById("status");
const expBox = document.getElementById("experienceBox");
const expEl = document.getElementById("experience");

const countryInput = document.getElementById("countryInput");
const jobInput = document.getElementById("jobInput");

const countryList = document.getElementById("countryList");
const jobList = document.getElementById("jobList");

/* Aliases -> normalize in WhatsApp message */
const COUNTRY_ALIASES = new Map([
  ["🇸🇦 Saudi Arab", "🇸🇦 Saudi Arabia"],
  ["🇸🇦 KSA", "🇸🇦 Saudi Arabia"],
  ["🇸🇦 Saudia", "🇸🇦 Saudi Arabia"],
  ["🇦🇪 UAE", "🇦🇪 United Arab Emirates (UAE)"],
  ["🇦🇪 Dubai (UAE)", "🇦🇪 United Arab Emirates (UAE)"],
]);

function toggleExperience() {
  if (statusEl.value === "Return") {
    expBox.classList.remove("hidden");
    expEl.setAttribute("required", "required");
  } else {
    expBox.classList.add("hidden");
    expEl.removeAttribute("required");
    expEl.value = "";
  }
}

statusEl.addEventListener("change", toggleExperience);
toggleExperience();

/* --- Validation: must match datalist options --- */
function isValidFromDatalist(inputEl, datalistEl) {
  const val = (inputEl.value || "").trim();
  if (!val) return false;
  const options = Array.from(datalistEl.options).map(o => (o.value || "").trim());
  return options.includes(val);
}

function showInlineError(inputEl, message) {
  inputEl.classList.add("inputError");
  const old = inputEl.parentElement.querySelector(".inlineError");
  if (old) old.remove();

  const div = document.createElement("div");
  div.className = "inlineError";
  div.textContent = message;
  inputEl.parentElement.appendChild(div);
}

function clearInlineError(inputEl) {
  inputEl.classList.remove("inputError");
  const old = inputEl.parentElement.querySelector(".inlineError");
  if (old) old.remove();
}

countryInput.addEventListener("input", () => clearInlineError(countryInput));
jobInput.addEventListener("input", () => clearInlineError(jobInput));

document.getElementById("applyForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const okCountry = isValidFromDatalist(countryInput, countryList);
  const okJob = isValidFromDatalist(jobInput, jobList);

  let hasError = false;

  if (!okCountry) {
    showInlineError(countryInput, "Please select a country from the list (type and choose).");
    hasError = true;
  }
  if (!okJob) {
    showInlineError(jobInput, "Please select a job category from the list (type and choose).");
    hasError = true;
  }
  if (hasError) return;

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();

  let country = countryInput.value.trim();
  if (COUNTRY_ALIASES.has(country)) country = COUNTRY_ALIASES.get(country);

  const job = jobInput.value.trim();
  const status = statusEl.value;
  const exp = expEl.value;

  let msg =
`Hello AL HIDAYA MANAGEMENT,

I want to apply for a job.

Full Name: ${name}
Phone Number: ${phone}
Email: ${email}
Preferred Country: ${country}
Job Category: ${job}
Status: ${status}
${status === "Return" ? "Experience: " + exp + " Year(s)" : ""}

Please guide me regarding the process.`;

  window.open("https://wa.me/918853979030?text=" + encodeURIComponent(msg), "_blank");
});