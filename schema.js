/* Validate persisted data before it reaches rendering or simulation. */
(() => {
  "use strict";
  const text = (v) => typeof v === "string" && v.length <= 100000;
  const id = (v) => text(v) && /^[a-zA-Z0-9_-]{1,120}$/.test(v);
  const number =
    (min = 0, max = 1e15) =>
    (v) =>
      Number.isFinite(v) && v >= min && v <= max;
  const bool = (v) => typeof v === "boolean";
  const one =
    (...values) =>
    (v) =>
      values.includes(v);
  const optional = (check) => (v) => v === undefined || check(v);
  const nullable = (check) => (v) => v === null || check(v);
  const array =
    (check, min = 0, max = 1000) =>
    (v) =>
      Array.isArray(v) && v.length >= min && v.length <= max && v.every(check);
  const object = (fields) => (v) =>
    !!v &&
    typeof v === "object" &&
    !Array.isArray(v) &&
    Object.entries(fields).every(([key, check]) => check(v[key]));
  const record = (check) => (v) =>
    !!v &&
    typeof v === "object" &&
    !Array.isArray(v) &&
    Object.values(v).every(check);
  const unique = (items) =>
    new Set(items.map((item) => item.id)).size === items.length;
  const step = object({
    type: one("trigger", "intelligence", "action"),
    icon: text,
    title: text,
    detail: text,
  });
  const automation = object({
    id,
    name: text,
    short: text,
    description: text,
    active: bool,
    color: (v) => /^#[a-fA-F0-9]{6}$/.test(v),
    cadence: text,
    schedule: array(number(0, 6), 0, 7),
    runtime: number(),
    success: number(0, 100),
    runs: number(),
    volume: array(number(), 7, 7),
    steps: array(step, 1, 100),
  });
  const run = object({
    id: text,
    time: text,
    status: one("Completed", "Running", "Failed", "Cancelled"),
    duration: text,
  });
  window.validateWorkspace = (v) =>
    object({
      automations: array(automation, 1, 100),
      selectedId: id,
      runs: record(array(run, 0, 100)),
    })(v) && unique(v.automations);
})();
