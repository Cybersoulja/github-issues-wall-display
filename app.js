const REFRESH_INTERVAL = 5 * 60 * 1000;
const defaultRepository = "Cybersoulja/github-issues-wall-display";
const params = new URLSearchParams(window.location.search);
const repositoryInput = document.querySelector("#repository-input");
const repositoryTitle = document.querySelector("#repository-title");
const issuesGrid = document.querySelector("#issues-grid");
const messagePanel = document.querySelector("#message-panel");
const statusLabel = document.querySelector("#status-label");
const statusDot = document.querySelector("#status-dot");
const lastUpdated = document.querySelector("#last-updated");
const refreshButton = document.querySelector("#refresh-button");

let currentRepository = normalizeRepository(params.get("repo") || localStorage.getItem("github-display-repository") || defaultRepository);
repositoryInput.value = currentRepository;

function normalizeRepository(value) {
  return value.trim().replace(/^https?:\/\/github\.com\//i, "").replace(/\.git$/, "").replace(/\/$/, "");
}

function getInteractionScore(issue) {
  const reactions = issue.reactions || {};
  const reactionTotal = Object.entries(reactions)
    .filter(([key]) => key !== "url")
    .reduce((total, [, count]) => total + Number(count || 0), 0);
  return issue.comments + reactionTotal;
}

function setStatus(label, state = "ready") {
  statusLabel.textContent = label;
  statusDot.className = `status-dot${state === "loading" ? " is-loading" : state === "error" ? " is-error" : ""}`;
}

function showMessage(message, empty = false) {
  messagePanel.hidden = false;
  messagePanel.textContent = message;
  messagePanel.className = `message-panel${empty ? " is-empty" : ""}`;
}

function clearMessage() { messagePanel.hidden = true; }

function renderIssues(issues) {
  issuesGrid.setAttribute("aria-busy", "false");
  if (!issues.length) {
    issuesGrid.innerHTML = "";
    showMessage("No open issues found for this repository.", true);
    return;
  }
  clearMessage();
  issuesGrid.innerHTML = issues.map((issue, index) => {
    const labels = issue.labels.slice(0, 3).map((label) => `<span class="issue-label">${escapeHtml(label.name)}</span>`).join("");
    const score = getInteractionScore(issue);
    return `<article class="issue-card">
      <div class="issue-card-top"><span class="rank">#${index + 1}</span><span class="score">${score} interactions</span></div>
      <h2 class="issue-title"><a href="${issue.html_url}" target="_blank" rel="noreferrer">${escapeHtml(issue.title)}</a></h2>
      <div class="issue-meta"><span>Issue #${issue.number}</span>${labels}</div>
      <div class="issue-footer"><span>${issue.comments} comments</span><span>Updated ${formatDate(issue.updated_at)}</span></div>
    </article>`;
  }).join("");
}

function formatDate(date) { return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(date)); }
function escapeHtml(value) { return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]); }

async function loadIssues() {
  currentRepository = normalizeRepository(repositoryInput.value);
  const [owner, repo] = currentRepository.split("/");
  if (!owner || !repo || currentRepository.split("/").length !== 2) {
    setStatus("Invalid repository", "error");
    showMessage("Enter a repository in the format owner/repository.");
    return;
  }
  localStorage.setItem("github-display-repository", currentRepository);
  history.replaceState(null, "", `?repo=${encodeURIComponent(currentRepository)}`);
  repositoryTitle.textContent = currentRepository;
  setStatus("Refreshing", "loading");
  issuesGrid.setAttribute("aria-busy", "true");
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=30&sort=updated&direction=desc`);
    if (!response.ok) throw new Error(response.status === 403 ? "GitHub rate limit reached. Try again later." : `GitHub returned ${response.status}.`);
    const issues = await response.json();
    renderIssues(issues.filter((issue) => !issue.pull_request).sort((a, b) => getInteractionScore(b) - getInteractionScore(a)).slice(0, 9));
    lastUpdated.textContent = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    setStatus("Live");
  } catch (error) {
    issuesGrid.setAttribute("aria-busy", "false");
    setStatus("Unavailable", "error");
    showMessage(error.message || "Unable to load GitHub issues.");
  }
}

document.querySelector("#repository-form").addEventListener("submit", (event) => { event.preventDefault(); loadIssues(); });
refreshButton.addEventListener("click", loadIssues);
loadIssues();
setInterval(loadIssues, REFRESH_INTERVAL);
