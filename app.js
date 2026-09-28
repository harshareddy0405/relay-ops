const STORAGE_KEY = "relay-ops-workspace-v1";

const seedAutomations = [
  {
    id: "market-brief",
    name: "Morning market brief",
    short: "MB",
    description:
      "Turns trusted market sources into a concise executive briefing.",
    active: true,
    color: "#f7b955",
    cadence: "Every weekday · 08:30",
    schedule: [1, 2, 3, 4, 5],
    runtime: 18.4,
    success: 98.7,
    runs: 184,
    volume: [4, 7, 5, 9, 6, 8, 3],
    steps: [
      {
        type: "trigger",
        icon: "⌁",
        title: "08:30 schedule",
        detail: "Weekdays · IST",
      },
      {
        type: "action",
        icon: "↗",
        title: "Gather sources",
        detail: "6 trusted feeds",
      },
      {
        type: "intelligence",
        icon: "✦",
        title: "Synthesize brief",
        detail: "Executive format",
      },
      {
        type: "action",
        icon: "→",
        title: "Deliver to team",
        detail: "Email · Notion",
      },
    ],
  },
  {
    id: "lead-qualifier",
    name: "Lead qualifier",
    short: "LQ",
    description:
      "Scores inbound leads and routes high-intent opportunities to the right owner.",
    active: true,
    color: "#69d7a4",
    cadence: "On form submission",
    schedule: [1, 2, 3, 4, 5],
    runtime: 7.8,
    success: 96.2,
    runs: 267,
    volume: [8, 12, 9, 15, 13, 6, 4],
    steps: [
      {
        type: "trigger",
        icon: "↯",
        title: "New inbound lead",
        detail: "Website form",
      },
      {
        type: "action",
        icon: "◇",
        title: "Enrich profile",
        detail: "Firmographic data",
      },
      {
        type: "intelligence",
        icon: "✦",
        title: "Score intent",
        detail: "5 buying signals",
      },
      {
        type: "action",
        icon: "→",
        title: "Route owner",
        detail: "CRM · Slack",
      },
    ],
  },
  {
    id: "support-triage",
    name: "Support triage",
    short: "ST",
    description:
      "Classifies support requests, flags risk, and prepares a useful first response.",
    active: true,
    color: "#6ca8ff",
    cadence: "Every 5 minutes",
    schedule: [0, 1, 2, 3, 4, 5, 6],
    runtime: 4.6,
    success: 99.1,
    runs: 416,
    volume: [21, 19, 24, 26, 18, 11, 14],
    steps: [
      {
        type: "trigger",
        icon: "⌁",
        title: "Ticket received",
        detail: "Shared inbox",
      },
      {
        type: "intelligence",
        icon: "✦",
        title: "Classify request",
        detail: "Intent · urgency",
      },
      {
        type: "action",
        icon: "!",
        title: "Check SLA risk",
        detail: "Priority rules",
      },
      {
        type: "action",
        icon: "→",
        title: "Draft & assign",
        detail: "Help desk",
      },
    ],
  },
  {
    id: "content-loop",
    name: "Content loop",
    short: "CL",
    description:
      "Repurposes one long-form idea into a channel-ready content package.",
    active: false,
    color: "#a88cff",
    cadence: "Manual run",
    schedule: [],
    runtime: 26.9,
    success: 94.8,
    runs: 61,
    volume: [1, 0, 3, 2, 1, 4, 0],
    steps: [
      {
        type: "trigger",
        icon: "+",
        title: "Source added",
        detail: "Article · transcript",
      },
      {
        type: "intelligence",
        icon: "✦",
        title: "Extract angles",
        detail: "Audience themes",
      },
      {
        type: "intelligence",
        icon: "✎",
        title: "Adapt formats",
        detail: "3 channels",
      },
      {
        type: "action",
        icon: "→",
        title: "Create drafts",
        detail: "Review queue",
      },
    ],
  },
  {
    id: "renewal-radar",
    name: "Renewal radar",
    short: "RR",
    description:
      "Detects account health changes and builds a proactive renewal action plan.",
    active: true,
    color: "#ff8f7a",
    cadence: "Every Monday · 09:00",
    schedule: [1],
    runtime: 31.2,
    success: 97.4,
    runs: 24,
    volume: [6, 0, 0, 0, 0, 0, 0],
    steps: [
      {
        type: "trigger",
        icon: "⌁",
        title: "Weekly review",
        detail: "Monday · 09:00",
      },
      {
        type: "action",
        icon: "◇",
        title: "Combine signals",
        detail: "Product · CRM",
      },
      {
        type: "intelligence",
        icon: "✦",
        title: "Assess health",
        detail: "Risk patterns",
      },
      {
        type: "action",
        icon: "→",
        title: "Plan outreach",
        detail: "CS workspace",
      },
    ],
  },
];

const fallbackRuns = [
  {
    id: "RUN-0842",
    time: "Today, 08:30",
    status: "Completed",
    duration: "17.8s",
  },
  {
    id: "RUN-0841",
    time: "Fri, 08:30",
    status: "Completed",
    duration: "19.1s",
  },
  {
    id: "RUN-0840",
    time: "Thu, 08:30",
    status: "Completed",
    duration: "18.6s",
  },
  {
    id: "RUN-0839",
    time: "Wed, 08:30",
    status: "Completed",
    duration: "16.9s",
  },
];

const stored = safeParse(WorkspaceStorage.getItem(STORAGE_KEY));
const state = {
  automations: stored?.automations?.length
    ? stored.automations
    : structuredClone(seedAutomations),
  selectedId: stored?.selectedId || "market-brief",
  runs: stored?.runs || {},
  filter: "all",
  search: "",
  zoom: 1,
  isRunning: false,
};

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [
  ...parent.querySelectorAll(selector),
];
const els = {
  list: $("#automationList"),
  search: $("#searchInput"),
  pipeline: $("#pipeline"),
  runTable: $("#runTable"),
  flowName: $("#flowName"),
  flowDescription: $("#flowDescription"),
  flowIcon: $("#flowIcon"),
  flowStatus: $("#flowStatus"),
  success: $("#successRate"),
  runs: $("#runsCount"),
  runtime: $("#runtimeValue"),
  cadence: $("#runFrequency"),
  chart: $("#miniChart"),
  volumeTotal: $("#volumeTotal"),
  runButton: $("#runButton"),
  toggle: $("#scheduleToggle"),
  week: $("#weekStrip"),
  toast: $("#toastRegion"),
  dialog: $("#automationDialog"),
  commandDialog: $("#commandDialog"),
  commandInput: $("#commandInput"),
  usageText: $("#usageText"),
  usageProgress: $("#usageProgress"),
};

function safeParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}
function selected() {
  return (
    state.automations.find((item) => item.id === state.selectedId) ||
    state.automations[0]
  );
}
function save() {
  WorkspaceStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      automations: state.automations,
      selectedId: state.selectedId,
      runs: state.runs,
    }),
  );
}
function escapeHTML(value) {
  return String(value).replace(
    /[&<>'"]/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        char
      ],
  );
}

function renderList() {
  const term = state.search.trim().toLowerCase();
  const visible = state.automations.filter((item) => {
    const matchesFilter =
      state.filter === "all" ||
      (state.filter === "active" ? item.active : !item.active);
    return (
      matchesFilter &&
      `${item.name} ${item.description}`.toLowerCase().includes(term)
    );
  });
  $("#allCount").textContent = state.automations.length;
  els.list.innerHTML = visible.length
    ? visible
        .map(
          (item) => `
    <button class="automation-item ${item.id === state.selectedId ? "active" : ""}" data-id="${item.id}" style="--item-color:${item.color}" aria-pressed="${item.id === state.selectedId}">
      <span class="item-icon">${escapeHTML(item.short)}</span>
      <span class="item-copy"><strong>${escapeHTML(item.name)}</strong><span>${escapeHTML(item.cadence)}</span></span>
      <i class="item-state ${item.active ? "active" : ""}" title="${item.active ? "Active" : "Paused"}"></i>
    </button>`,
        )
        .join("")
    : `<div class="no-results">No automations match this view.</div>`;
  $$(".automation-item", els.list).forEach((button) =>
    button.addEventListener("click", () => selectAutomation(button.dataset.id)),
  );
  updateUsage();
}

function selectAutomation(id) {
  if (state.isRunning) return toast("Finish the current simulation first");
  state.selectedId = id;
  save();
  render();
  showView("automations");
}

function renderDetail() {
  const flow = selected();
  els.flowName.textContent = flow.name;
  els.flowDescription.textContent = flow.description;
  els.flowIcon.textContent = flow.short;
  els.flowIcon.style.color = flow.color;
  els.flowIcon.style.borderColor = `${flow.color}45`;
  els.flowIcon.style.background = `${flow.color}16`;
  els.flowStatus.className = `status-badge ${flow.active ? "" : "paused"}`;
  els.flowStatus.innerHTML = `<i></i>${flow.active ? "Active" : "Paused"}`;
  els.success.textContent = `${flow.success.toFixed(1)}%`;
  els.runs.textContent = flow.runs.toLocaleString();
  els.runtime.textContent = `${flow.runtime.toFixed(1)}s`;
  els.cadence.textContent = flow.cadence;
  els.toggle.classList.toggle("active", flow.active);
  els.toggle.setAttribute("aria-checked", String(flow.active));
  $("#runtimeDelta").textContent =
    `↓ ${(flow.runtime * 0.17).toFixed(1)}s vs last week`;
  $("#successDelta").textContent =
    `↗ ${Math.max(0.3, (flow.success - 93) / 2).toFixed(1)}% this week`;
  renderChart(flow);
  renderPipeline(flow);
  renderRuns(flow);
  renderSchedule(flow);
}

function renderChart(flow) {
  const max = Math.max(...flow.volume, 1);
  els.chart.innerHTML = flow.volume
    .map(
      (value, index) =>
        `<div class="chart-column" title="${value} runs on ${["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}"><span style="height:${Math.max(9, (value / max) * 100)}%"></span></div>`,
    )
    .join("");
  els.volumeTotal.textContent = `${flow.volume.reduce((a, b) => a + b, 0)} runs`;
}

function renderPipeline(flow) {
  const colorMap = {
    trigger: "#69d7a4",
    intelligence: "#a88cff",
    action: "#6ca8ff",
  };
  els.pipeline.innerHTML = flow.steps
    .map(
      (step, index) => `
    ${index ? `<span class="connector" aria-hidden="true"></span>` : ""}
    <article class="pipeline-node" role="button" data-index="${index}" style="--node-color:${colorMap[step.type] || flow.color}" tabindex="0" aria-label="Edit step ${index + 1}: ${escapeHTML(step.title)}">
      <div class="node-top"><span class="node-icon">${escapeHTML(step.icon)}</span><span class="node-order">0${index + 1}</span></div>
      <strong>${escapeHTML(step.title)}</strong><p>${escapeHTML(step.detail)}</p>
    </article>`,
    )
    .join("");
  els.pipeline.style.transform = `scale(${state.zoom})`;
  $$(".pipeline-node", els.pipeline).forEach((node) => {
    node.addEventListener("click", () => {
      $$(".pipeline-node", els.pipeline).forEach((item) =>
        item.classList.remove("selected"),
      );
      node.classList.add("selected");
      if (state.isRunning) return;
      const index = Number(node.dataset.index);
      $("#stepForm").dataset.index = index;
      $("#stepTitle").value = flow.steps[index].title;
      $("#stepDetail").value = flow.steps[index].detail;
      $("#stepDialog").showModal();
    });
    node.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        node.click();
      }
    });
  });
}

function renderRuns(flow) {
  const runs =
    state.runs[flow.id] ||
    fallbackRuns.map((run, index) => ({
      ...run,
      id: `RUN-${String(842 - index - state.automations.indexOf(flow) * 23).padStart(4, "0")}`,
    }));
  els.runTable.innerHTML = `<div class="run-row header"><span>Run ID</span><span>Started</span><span>Status</span><span>Runtime</span></div>${runs
    .slice(0, 5)
    .map(
      (run) => `
    <div class="run-row"><span class="run-id">${escapeHTML(run.id)}</span><span>${escapeHTML(run.time)}</span><span class="run-status ${run.status.toLowerCase()}"><i></i>${escapeHTML(run.status)}</span><span>${escapeHTML(run.duration)}</span></div>`,
    )
    .join("")}`;
}

function renderSchedule(flow) {
  const labels = ["S", "M", "T", "W", "T", "F", "S"];
  els.week.innerHTML = labels
    .map(
      (label, index) =>
        `<span class="week-day ${flow.schedule.includes(index) ? "active" : ""}" title="${["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][index]}">${label}</span>`,
    )
    .join("");
  const next = nextScheduledWindow(flow);
  $("#nextDay").textContent = next
    ? new Intl.DateTimeFormat("en", {
        day: "2-digit",
        timeZone: "Asia/Kolkata",
      }).format(next)
    : "—";
  $("#nextMonth").textContent = next
    ? new Intl.DateTimeFormat("en", {
        month: "short",
        timeZone: "Asia/Kolkata",
      })
        .format(next)
        .toUpperCase()
    : "";
  $("#nextRunTime").textContent = flow.active
    ? next
      ? `Next window, ${flow.time || flow.cadence.match(/\d{2}:\d{2}/)?.[0]}`
      : "Event-driven / on demand"
    : "Schedule paused";
  $("#nextRunZone").textContent = flow.active
    ? "Asia/Kolkata · local simulation"
    : "Enable when you are ready";
}

async function runAutomation() {
  if (state.isRunning) return;
  const flow = selected();
  state.isRunning = true;
  els.runButton.disabled = true;
  els.runButton.innerHTML = `<span class="play-icon">◌</span> Running…`;
  const id = `RUN-${crypto.randomUUID().slice(0, 8)}`;
  const inProgress = {
    id,
    time: new Date().toISOString(),
    status: "Running",
    duration: "—",
  };
  state.runs[flow.id] = [inProgress, ...(state.runs[flow.id] || [])].slice(
    0,
    6,
  );
  renderRuns(flow);
  const nodes = $$(".pipeline-node", els.pipeline);
  const connectors = $$(".connector", els.pipeline);
  for (let index = 0; index < nodes.length; index += 1) {
    nodes.forEach((node) => node.classList.remove("running"));
    nodes[index].classList.add("running");
    if (index > 0) connectors[index - 1].classList.add("running");
    await wait(520);
  }
  nodes.forEach((node) => node.classList.remove("running"));
  connectors.forEach((item) => item.classList.remove("running"));
  const duration = flow.steps.reduce(
    (total, step) =>
      total +
      ({ trigger: 0.2, intelligence: 1.8, action: 0.6 }[step.type] || 0.6),
    0,
  );
  inProgress.status = "Completed";
  inProgress.duration = `${duration.toFixed(1)}s`;
  flow.runs += 1;
  flow.volume[(new Date().getDay() + 6) % 7] += 1;
  flow.runtime = Number(((flow.runtime * 4 + duration) / 5).toFixed(1));
  state.isRunning = false;
  els.runButton.disabled = false;
  els.runButton.innerHTML = `<span class="play-icon">▶</span> Run now <kbd>R</kbd>`;
  save();
  render();
  toast(
    `${flow.name}: simulated ${inProgress.duration}; no external messages sent`,
  );
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function updateUsage() {
  const total = state.automations.reduce((sum, item) => sum + item.runs, 0);
  els.usageText.textContent = `${total.toLocaleString()} / 1,000`;
  els.usageProgress.style.width = `${Math.min(100, total / 10)}%`;
}

function toggleSchedule() {
  if (state.isRunning) return toast("Finish the current simulation first");
  const flow = selected();
  flow.active = !flow.active;
  save();
  render();
  toast(`${flow.name} ${flow.active ? "activated" : "paused"}`);
}

function exportBlueprint() {
  const flow = selected();
  const blob = new Blob(
    [
      JSON.stringify(
        {
          product: "Relay Ops",
          version: 1,
          exportedAt: new Date().toISOString(),
          automation: flow,
        },
        null,
        2,
      ),
    ],
    { type: "application/json" },
  );
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${flow.id}.relay.json`;
  link.click();
  URL.revokeObjectURL(url);
  toast("Blueprint exported as JSON");
}

function createAutomation(event) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const name = String(data.get("name")).trim();
  const description = String(data.get("description")).trim();
  if (!name || !description) return;
  const id = `${name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}-${Date.now().toString().slice(-4)}`;
  const cadenceRaw = String(data.get("cadence"));
  const item = {
    id,
    name,
    short: name
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase(),
    description,
    active: true,
    color: ["#f7b955", "#69d7a4", "#6ca8ff", "#a88cff"][
      state.automations.length % 4
    ],
    cadence: `${cadenceRaw} · local`,
    schedule:
      cadenceRaw === "Every day"
        ? [0, 1, 2, 3, 4, 5, 6]
        : cadenceRaw === "On demand"
          ? []
          : cadenceRaw === "Every Monday"
            ? [1]
            : [1, 2, 3, 4, 5],
    runtime: 12.5,
    success: 100,
    runs: 0,
    volume: [0, 0, 0, 0, 0, 0, 0],
    steps: [
      {
        type: "trigger",
        icon: "↯",
        title: String(data.get("trigger")),
        detail: cadenceRaw,
      },
      {
        type: "intelligence",
        icon: "✦",
        title: "Interpret input",
        detail: "Local simulation",
      },
      {
        type: "action",
        icon: "◇",
        title: "Apply workflow",
        detail: "Editable step",
      },
      {
        type: "action",
        icon: "→",
        title: "Deliver outcome",
        detail: "Review queue",
      },
    ],
  };
  state.automations.unshift(item);
  state.selectedId = id;
  save();
  event.currentTarget.reset();
  els.dialog.close();
  render();
  toast(`${name} blueprint created`);
}

function toast(message) {
  const item = document.createElement("div");
  item.className = "toast";
  item.innerHTML = `<i></i><span>${escapeHTML(message)}</span>`;
  els.toast.append(item);
  setTimeout(() => {
    item.classList.add("out");
    setTimeout(() => item.remove(), 220);
  }, 2800);
}

function openCommand() {
  if (!els.commandDialog.open) els.commandDialog.showModal();
  els.commandInput.value = "";
  filterCommands();
  setTimeout(() => els.commandInput.focus(), 30);
}
function filterCommands() {
  const term = els.commandInput.value.toLowerCase();
  $$("[data-command]", els.commandDialog).forEach(
    (item) => (item.hidden = !item.textContent.toLowerCase().includes(term)),
  );
}
function executeCommand(command) {
  els.commandDialog.close();
  (
    ({
      run: runAutomation,
      new: () => els.dialog.showModal(),
      export: exportBlueprint,
      toggle: toggleSchedule,
    })[command] || (() => {})
  )();
}
function render() {
  renderList();
  renderDetail();
}

els.search.addEventListener("input", (event) => {
  state.search = event.target.value;
  renderList();
});
$$(".filter").forEach((button) =>
  button.addEventListener("click", () => {
    $$(".filter").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    state.filter = button.dataset.filter;
    renderList();
  }),
);
els.runButton.addEventListener("click", runAutomation);
els.toggle.addEventListener("click", toggleSchedule);
$("#exportButton").addEventListener("click", exportBlueprint);
$("#newAutomationButton").addEventListener("click", () =>
  els.dialog.showModal(),
);
$("#automationForm").addEventListener("submit", createAutomation);
$$("[data-close-modal]").forEach((button) =>
  button.addEventListener("click", () => els.dialog.close()),
);
$("#clearRunsButton").addEventListener("click", () => {
  if (state.isRunning) return toast("Finish the current simulation first");
  state.runs[selected().id] = [];
  save();
  renderRuns(selected());
  toast("Simulation history reset");
});
$("#zoomIn").addEventListener("click", () => {
  if (state.isRunning) return;
  state.zoom = Math.min(1.2, state.zoom + 0.1);
  $("#zoomLabel").textContent = `${Math.round(state.zoom * 100)}%`;
  renderPipeline(selected());
});
$("#zoomOut").addEventListener("click", () => {
  if (state.isRunning) return;
  state.zoom = Math.max(0.7, state.zoom - 0.1);
  $("#zoomLabel").textContent = `${Math.round(state.zoom * 100)}%`;
  renderPipeline(selected());
});
$("#centerCanvas").addEventListener("click", () => {
  if (state.isRunning) return;
  state.zoom = 1;
  $("#zoomLabel").textContent = "100%";
  renderPipeline(selected());
  toast("Workflow centered");
});
$("#commandButton").addEventListener("click", openCommand);
els.commandInput.addEventListener("input", filterCommands);
$$("[data-command]", els.commandDialog).forEach((button) =>
  button.addEventListener("click", () =>
    executeCommand(button.dataset.command),
  ),
);
$("#editScheduleButton").addEventListener("click", () => {
  if (state.isRunning) return;
  const flow = selected();
  $("#scheduleTime").value =
    flow.time || flow.cadence.match(/\d{2}:\d{2}/)?.[0] || "08:30";
  $$("#scheduleDays input").forEach((input) => {
    input.checked = flow.schedule.includes(Number(input.value));
  });
  $("#scheduleDialog").showModal();
});
$("#moreButton").addEventListener("click", () =>
  toast("Blueprint is saved locally in your browser"),
);
$$(".nav-item").forEach((button) =>
  button.addEventListener("click", () => {
    showView(button.dataset.view);
  }),
);

document.addEventListener("keydown", (event) => {
  const typing = ["INPUT", "TEXTAREA", "SELECT"].includes(
    document.activeElement?.tagName,
  );
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    openCommand();
  }
  if (document.querySelector("dialog[open]") && !els.commandDialog.open) return;
  if (!typing && event.key === "/") {
    event.preventDefault();
    els.search.focus();
  }
  if (
    !typing &&
    event.key.toLowerCase() === "r" &&
    !event.metaKey &&
    !event.ctrlKey
  )
    runAutomation();
  if (!typing && event.key.toLowerCase() === "n") els.dialog.showModal();
  if (els.commandDialog.open && event.key === "Enter") {
    const first = $("[data-command]:not([hidden])", els.commandDialog);
    if (first) executeCommand(first.dataset.command);
  }
});

function nextScheduledWindow(flow, now = new Date()) {
  const time = flow.time || flow.cadence.match(/\d{2}:\d{2}/)?.[0];
  if (!flow.active || !time || !flow.schedule.length) return null;
  const [hours, minutes] = time.split(":").map(Number);
  const local = new Date(now.getTime() + 330 * 60000);
  for (let offset = 0; offset <= 7; offset++) {
    const candidate = new Date(
      Date.UTC(
        local.getUTCFullYear(),
        local.getUTCMonth(),
        local.getUTCDate() + offset,
        hours,
        minutes,
      ),
    );
    const instant = new Date(candidate.getTime() - 330 * 60000);
    if (flow.schedule.includes(candidate.getUTCDay()) && instant > now)
      return instant;
  }
  return null;
}
function showView(view) {
  $$(".nav-item").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === view);
    button.setAttribute("aria-pressed", String(button.dataset.view === view));
  });
  $(".content").hidden = view !== "automations";
  const panel = $("#workspaceReport");
  panel.hidden = view === "automations";
  if (panel.hidden) return;
  const actual = state.automations.flatMap((flow) =>
    (state.runs[flow.id] || []).map((run) => ({ ...run, name: flow.name })),
  );
  const completed = actual.filter((run) => run.status === "Completed");
  const average = completed.length
    ? (
        completed.reduce((sum, run) => sum + parseFloat(run.duration), 0) /
        completed.length
      ).toFixed(1)
    : "—";
  panel.innerHTML =
    view === "activity"
      ? `<p class="eyebrow">Local run ledger</p><h2>Activity</h2><p>Runs started in this browser. Durations are simulated.</p><div class="run-table">${
          actual.length
            ? actual
                .slice()
                .reverse()
                .map(
                  (run) =>
                    `<div class="run-row"><span>${escapeHTML(run.name)}</span><span>${escapeHTML(run.id)}</span><span>${escapeHTML(run.status)}</span><span>${escapeHTML(run.duration)}</span></div>`,
                )
                .join("")
            : "<p>No local runs yet. Start an automation to build your ledger.</p>"
        }</div>`
      : `<p class="eyebrow">Measured in your workspace</p><h2>Insights</h2><p>Only local runs are included; seeded showcase metrics are excluded.</p><div class="insight-grid"><article><strong>${actual.length}</strong><span>Recorded runs</span></article><article><strong>${completed.length}</strong><span>Completed simulations</span></article><article><strong>${average}s</strong><span>Mean simulated duration</span></article></div>`;
}
$("#scheduleForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const flow = selected();
  flow.time = $("#scheduleTime").value;
  flow.schedule = $$("#scheduleDays input:checked").map((input) =>
    Number(input.value),
  );
  flow.cadence = flow.schedule.length
    ? `${flow.schedule.map((day) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day]).join(", ")} · ${flow.time}`
    : "On demand";
  save();
  render();
  $("#scheduleDialog").close();
  toast("Schedule blueprint saved. This demo does not run in the background.");
});
$("#stepForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const step = selected().steps[Number(event.currentTarget.dataset.index)];
  step.title = $("#stepTitle").value.trim();
  step.detail = $("#stepDetail").value.trim();
  save();
  render();
  $("#stepDialog").close();
});
$$("[data-close-editor]").forEach((button) =>
  button.addEventListener("click", () => button.closest("dialog").close()),
);
render();
