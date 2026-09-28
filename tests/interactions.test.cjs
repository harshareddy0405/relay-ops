const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { boot } = require("./harness.cjs");
const key = fs
  .readFileSync(path.join(__dirname, "../app.js"), "utf8")
  .match(/const (?:STORAGE_KEY|STORE|KEY) = "([^"]+)"/)[1];
const fixture = async (t, options) => {
  const h = await boot(options);
  t.after(() => {
    const errors = [...h.errors];
    h.close();
    assert.deepEqual(errors, []);
  });
  return h;
};
const submit = (h, selector) =>
  h
    .$(selector)
    .dispatchEvent(
      new h.window.Event("submit", { bubbles: true, cancelable: true }),
    );
const readBlob = (h, blob) =>
  new Promise((resolve, reject) => {
    const r = new h.window.FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsText(blob);
  });
async function roundTrip(t, h) {
  await h.wait(450);
  const raw = h.window.localStorage.getItem(key);
  assert.ok(raw, "Interaction should persist workspace data");
  assert.equal(
    h.window.validateWorkspace(JSON.parse(raw)),
    true,
    "Generated state must satisfy its schema",
  );
  const reloaded = await fixture(t, { saved: { [key]: raw } });
  assert.equal(
    reloaded.$("#storage-notice"),
    null,
    "Valid edits must not be discarded on reload",
  );
}
test("schedule editing changes planned windows and persists", async (t) => {
  const h = await fixture(t);
  h.click("#editScheduleButton");
  h.input("#scheduleTime", "09:45");
  submit(h, "#scheduleForm");
  assert.match(h.$("#nextRunTime").textContent, /09:45/);
  assert.equal(h.$("#scheduleDialog").open, false);
  await roundTrip(t, h);
});
test("pipeline steps are editable and reports use real local run records", async (t) => {
  const h = await fixture(t);
  h.click(".pipeline-node");
  h.input("#stepTitle", "Review evidence");
  submit(h, "#stepForm");
  assert.match(h.$("#pipeline").textContent, /Review evidence/);
  h.click('[data-view="activity"]');
  assert.match(h.$("#workspaceReport").textContent, /No local runs/);
  h.click('[data-view="automations"]');
  h.click("#runButton");
  await h.wait(2300);
  h.click('[data-view="insights"]');
  assert.match(h.$("#workspaceReport").textContent, /Completed simulations/);
  assert.ok(
    JSON.parse(h.window.localStorage.getItem(key)).runs["market-brief"].some(
      (run) => run.status === "Completed",
    ),
  );
});
