const { useState, useEffect, useRef } = React;

const DEFAULT_TOTAL = 110;

const DEFAULT_EVENT_NAME = "ICELANDIC CULINARY TEAM";
// Old default name; a saved copy of it is replaced with the current default
const OLD_DEFAULT_EVENT_NAME = "RON SERVICE COUNTER";

const COURSES = [
  { id: "starter", name: "FORRÉTTUR", accent: "var(--course-starter)" },
  { id: "main", name: "AÐALRÉTTUR", accent: "var(--course-main)" },
  { id: "dessert", name: "EFTIRRÉTTUR", accent: "var(--course-dessert)" },
];

const INCREMENTS = [1, 2, 4, 6, 8, 10];

function formatElapsed(ms) {
  if (ms == null) return "--:--";
  // Clamp: an order created since the last timer tick would otherwise show a negative time
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// Status color for a timer: green, yellow after 4 min, red after 8 min
function timerToneFor(ms) {
  if (ms == null) return "var(--text-muted)";
  if (ms > 8 * 60 * 1000) return "var(--danger)";
  if (ms > 4 * 60 * 1000) return "var(--alert)";
  return "var(--success)";
}

// "×" in the top-right corner of a dialog — closes it without saving
function CloseButton({ onClick, label = "Loka" }) {
  return (
    <button className="close-x" onClick={onClick} title={label} aria-label={label}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M6 6l12 12M18 6L6 18" />
      </svg>
    </button>
  );
}

function ResumeDialog({ open, eventName, savedAt, summary, courses, onResume, onDiscard }) {
  if (!open) return null;

  const formatSavedAt = (ts) => {
    if (!ts) return "óþekktur tími";
    const d = new Date(ts);
    const now = new Date();
    const sameDay = d.toDateString() === now.toDateString();
    const time = d.toLocaleTimeString("is-IS", { hour: "2-digit", minute: "2-digit" });
    if (sameDay) return `í dag kl. ${time}`;
    const yest = new Date(now);
    yest.setDate(yest.getDate() - 1);
    if (d.toDateString() === yest.toDateString()) return `í gær kl. ${time}`;
    const date = d.toLocaleDateString("is-IS", { day: "numeric", month: "short" });
    return `${date} kl. ${time}`;
  };

  const courseByKey = Object.fromEntries(courses.map((c) => [c.id, c]));

  return (
    <div className="modal-backdrop" style={{ pointerEvents: "auto" }}>
      <div className="modal modal-resume" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">Óklárað kvöld?</div>
        <div className="modal-message">
          Vistuð talning fannst fyrir <strong>{eventName}</strong> frá {formatSavedAt(savedAt)}.
        </div>
        <div className="resume-summary">
          {summary.map((s) => {
            const c = courseByKey[s.key];
            return (
              <div key={s.key} className="resume-row" style={{ "--accent": c?.accent }}>
                <div className="resume-row-name">{c?.name || s.key}</div>
                <div className="resume-row-stat">
                  <span className="resume-num">{s.sent}</span>
                  <span className="resume-sep">sent</span>
                  <span className="resume-num resume-num-muted">{s.tickets}</span>
                  <span className="resume-sep">miðar</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="modal-actions">
          <button className="btn modal-btn modal-btn-discard" onClick={onDiscard}>
            Byrja upp á nýtt
          </button>
          <button className="btn modal-btn modal-btn-primary" onClick={onResume}>
            Halda áfram
          </button>
        </div>
      </div>
    </div>
  );
}

function NumberInputDialog({ open, title, placeholder, max, quickPicks: picks, initialValue, allowEmpty, onSubmit, onClear, onCancel }) {
  const [value, setValue] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setValue(initialValue != null ? String(initialValue) : "");
      // Focus input after render
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  if (!open) return null;

  const parsed = parseInt(value, 10);
  const isEmpty = value.trim() === "";
  const isValid =
    (allowEmpty && isEmpty) ||
    (Number.isFinite(parsed) &&
      parsed > 0 &&
      parsed <= 999 &&
      (max == null || parsed <= max));

  const submit = () => {
    if (!isValid) return;
    onSubmit(isEmpty ? null : parsed);
  };

  const handleKey = (e) => {
    if (e.key === "Enter") submit();
    if (e.key === "Escape") onCancel();
  };

  const quickPicks = (picks ?? [9, 10, 12, 15, 20, 25]).filter((n) => max == null || n <= max);

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal modal-numinput" onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onCancel} />
        <div className="modal-title">{title}</div>
        {max != null && (
          <div className="modal-message">Hámark: {max}</div>
        )}
        <input
          ref={inputRef}
          autoFocus
          type="number"
          inputMode="numeric"
          className="num-input num-input-large"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKey}
          min={1}
          max={max ?? 999}
        />
        {quickPicks.length > 0 && (
          <div className="presets-row">
            {quickPicks.map((n) => (
              <button
                key={n}
                className="preset-btn"
                onClick={() => setValue(String(n))}
              >
                {n}
              </button>
            ))}
          </div>
        )}
        <div className="modal-actions">
          {onClear && (
            <button className="btn modal-btn modal-btn-discard" onClick={onClear}>
              Fjarlægja
            </button>
          )}
          <button className="btn btn-ghost modal-btn" onClick={onCancel}>
            Hætta við
          </button>
          <button
            className="btn modal-btn modal-btn-primary"
            onClick={submit}
            disabled={!isValid}
          >
            Staðfesta
          </button>
        </div>
      </div>
    </div>
  );
}

// New order: table number (optional) and how many guests are on the table
function OrderDialog({ open, title, onSubmit, onCancel }) {
  const [table, setTable] = useState("");
  const [count, setCount] = useState("");
  const tableRef = useRef(null);
  const countRef = useRef(null);

  useEffect(() => {
    if (open) setTimeout(() => tableRef.current?.focus(), 50);
  }, [open]);

  if (!open) return null;

  const parsedTable = parseInt(table, 10);
  const parsedCount = parseInt(count, 10);
  const tableValid =
    table.trim() === "" || (Number.isFinite(parsedTable) && parsedTable > 0 && parsedTable <= 999);
  const countValid = Number.isFinite(parsedCount) && parsedCount > 0 && parsedCount <= 999;
  const isValid = tableValid && countValid;

  const submit = () => {
    if (!isValid) return;
    onSubmit(parsedCount, table.trim() === "" ? null : parsedTable);
  };

  const onTableKey = (e) => {
    if (e.key === "Enter") countRef.current?.focus();
    if (e.key === "Escape") onCancel();
  };
  const onCountKey = (e) => {
    if (e.key === "Enter") submit();
    if (e.key === "Escape") onCancel();
  };

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal modal-numinput" onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onCancel} />
        <div className="modal-title">{title}</div>
        <div className="order-fields">
          <label className="order-field">
            <span className="settings-label">Borð</span>
            <input
              ref={tableRef}
              autoFocus
              type="number"
              inputMode="numeric"
              className="num-input num-input-large"
              placeholder="—"
              value={table}
              onChange={(e) => setTable(e.target.value)}
              onKeyDown={onTableKey}
              min={1}
              max={999}
            />
          </label>
          <label className="order-field">
            <span className="settings-label">Fjöldi gesta</span>
            <input
              ref={countRef}
              type="number"
              inputMode="numeric"
              className="num-input num-input-large"
              placeholder="0"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              onKeyDown={onCountKey}
              min={1}
              max={999}
            />
          </label>
        </div>
        <div className="presets-row order-presets">
          {[9, 10, 11, 12, 14, 16, 20].map((n) => (
            <button
              key={n}
              className={`preset-btn ${parsedCount === n ? "preset-active" : ""}`}
              onClick={() => setCount(String(n))}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost modal-btn" onClick={onCancel}>
            Hætta við
          </button>
          <button
            className="btn modal-btn modal-btn-primary"
            onClick={submit}
            disabled={!isValid}
          >
            Staðfesta
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingsDialog({ open, currentTotal, currentOpenCount, onSave, onCancel }) {
  const [draftTotal, setDraftTotal] = useState(String(currentTotal));
  const [draftOpen, setDraftOpen] = useState(currentOpenCount);

  useEffect(() => {
    if (open) {
      setDraftTotal(String(currentTotal));
      setDraftOpen(currentOpenCount);
    }
  }, [open, currentTotal, currentOpenCount]);

  if (!open) return null;

  const parsed = parseInt(draftTotal, 10);
  const isValid = draftOpen || (Number.isFinite(parsed) && parsed > 0 && parsed <= 9999);

  const handleSave = () => {
    if (!isValid) return;
    onSave(draftOpen ? 0 : parsed, draftOpen);
  };

  const bumpTotal = (delta) => {
    const cur = Number.isFinite(parsed) ? parsed : 0;
    const next = Math.max(1, Math.min(9999, cur + delta));
    setDraftTotal(String(next));
  };

  const presets = [50, 80, 110, 150, 200, 300];

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal modal-settings" onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onCancel} />
        <div className="modal-title">Stillingar</div>

        <div className="settings-section">
          <label className="settings-label">Talningar-mátur</label>
          <div className="toggle-row">
            <button
              className={`toggle-btn ${!draftOpen ? "toggle-active" : ""}`}
              onClick={() => setDraftOpen(false)}
            >
              <div className="toggle-title">Þak (cap)</div>
              <div className="toggle-desc">Veit fyrirfram hvað margir gestir</div>
            </button>
            <button
              className={`toggle-btn ${draftOpen ? "toggle-active" : ""}`}
              onClick={() => setDraftOpen(true)}
            >
              <div className="toggle-title">Opin talning</div>
              <div className="toggle-desc">Telur upp á við án þaks</div>
            </button>
          </div>
        </div>

        {!draftOpen && (
          <div className="settings-section">
            <label className="settings-label">Heildarfjöldi gesta</label>
            <div className="number-row">
              <button className="num-btn" onClick={() => bumpTotal(-10)}>−10</button>
              <button className="num-btn" onClick={() => bumpTotal(-1)}>−1</button>
              <input
                type="number"
                className="num-input"
                value={draftTotal}
                onChange={(e) => setDraftTotal(e.target.value)}
                min={1}
                max={9999}
              />
              <button className="num-btn" onClick={() => bumpTotal(1)}>+1</button>
              <button className="num-btn" onClick={() => bumpTotal(10)}>+10</button>
            </div>
            <div className="presets-row">
              {presets.map((p) => (
                <button
                  key={p}
                  className={`preset-btn ${parsed === p ? "preset-active" : ""}`}
                  onClick={() => setDraftTotal(String(p))}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="settings-note">
          Stillingin gildir fyrir alla þrjá rétti. Núverandi talningar eru ekki núllstilltar.
        </div>

        <div className="modal-actions">
          <button className="btn btn-ghost modal-btn" onClick={onCancel}>
            Hætta við
          </button>
          <button
            className="btn modal-btn modal-btn-primary"
            onClick={handleSave}
            disabled={!isValid}
          >
            Vista
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onCancel} />
        <div className="modal-title">{title}</div>
        <div className="modal-message">{message}</div>
        <div className="modal-actions">
          <button className="btn btn-ghost modal-btn" onClick={onCancel}>
            Hætta við
          </button>
          <button className="btn modal-btn modal-btn-danger" onClick={onConfirm}>
            Núllstilla
          </button>
        </div>
      </div>
    </div>
  );
}

function CourseCard({ course, state, onChange, total, openCount, onCustomInput }) {
  // batches: [{ id, count, addedAt, calledAt|null }]
  // sentActions: [{ id, count, at }] — each "mark sent" press is a separate entry, undoable like calls
  const batches = state.batches || [];
  const sentActions = state.sentActions || [];
  const callStartedAt = state.callStartedAt || null;
  const lastCallAt = state.lastCallAt || null;

  const tickets = batches.reduce((a, b) => a + b.count, 0);
  const called = batches
    .filter((b) => b.calledAt != null)
    .reduce((a, b) => a + b.count, 0);
  const pendingBatches = batches.filter((b) => b.calledAt == null).sort((a, b) => a.addedAt - b.addedAt);
  const sent = sentActions.reduce((a, s) => a + s.count, 0);
  const remaining = openCount ? null : Math.max(0, total - sent);
  const pendingSend = called - sent;

  // Called orders still in the kitchen. Sent plates are assigned to called
  // orders first-in-first-out, so an order leaves this list once fully sent.
  const inKitchen = [];
  {
    let sentLeft = sent;
    const calledInOrder = batches
      .filter((b) => b.calledAt != null)
      .sort((a, b) => a.calledAt - b.calledAt || a.addedAt - b.addedAt);
    for (const b of calledInOrder) {
      const out = Math.min(b.count, sentLeft);
      sentLeft -= out;
      if (out < b.count) inKitchen.push({ ...b, waiting: b.count - out });
    }
  }

  // The course timer stops once everything called has been sent out,
  // showing the time from the last call to the last plates going out
  const lastSentAt = sentActions.length ? sentActions[sentActions.length - 1].at : null;
  const timerStopped = lastCallAt != null && called > 0 && pendingSend <= 0;

  // Live timers: since last call, and per order
  const [now, setNow] = useState(Date.now());
  const [confirmReset, setConfirmReset] = useState(false);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const hasLiveTimers =
    (lastCallAt != null && !timerStopped) || pendingBatches.length > 0;
  useEffect(() => {
    if (!hasLiveTimers) return;
    setNow(Date.now());
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, [hasLiveTimers]);

  const sinceLastCall = lastCallAt == null
    ? null
    : timerStopped
      ? Math.max(lastSentAt ?? lastCallAt, lastCallAt) - lastCallAt
      : now - lastCallAt;

  // Latest state, for dialog callbacks that run after the state has moved on
  // (e.g. the table dialog opened right after adding an order)
  const stateRef = useRef(state);
  stateRef.current = state;

  const addBatch = (count, table = null) => {
    if (count <= 0) return;
    const newBatch = {
      id: `b_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      count,
      addedAt: Date.now(),
      calledAt: null,
      table,
    };
    onChange(
      { ...state, batches: [...batches, newBatch] },
      table == null ? `+${count} miðar` : `Borð ${table} (+${count})`
    );
    return newBatch;
  };

  const removeBatch = (batchId) => {
    const batch = batches.find((b) => b.id === batchId);
    if (!batch || batch.calledAt != null) return;
    onChange(
      { ...state, batches: batches.filter((b) => b.id !== batchId) },
      `Eyða pöntun ${batch.count}`
    );
  };

  const setTable = (batchId, table) => {
    const cur = stateRef.current;
    const curBatches = cur.batches || [];
    const batch = curBatches.find((b) => b.id === batchId);
    if (!batch || (batch.table ?? null) === table) return;
    const next = curBatches.map((b) => (b.id === batchId ? { ...b, table } : b));
    onChange({ ...cur, batches: next }, table == null ? "Borð fjarlægt" : `Borð ${table}`);
  };

  const editTable = (batch) => {
    onCustomInput({
      title: `${course.name} — Borð`,
      placeholder: "Borðnúmer",
      quickPicks: [],
      initialValue: batch.table,
      allowEmpty: true,
      onSubmit: (n) => setTable(batch.id, n),
      onClear: batch.table != null ? () => setTable(batch.id, null) : null,
    });
  };

  const removeLastUncalled = () => {
    // Remove most recently added uncalled batch, or shrink it by 1
    const lastUncalledIdx = [...batches]
      .map((b, i) => ({ b, i }))
      .reverse()
      .find(({ b }) => b.calledAt == null)?.i;
    if (lastUncalledIdx == null) return;
    const batch = batches[lastUncalledIdx];
    let next;
    if (batch.count <= 1) {
      next = batches.filter((_, i) => i !== lastUncalledIdx);
    } else {
      next = batches.map((b, i) =>
        i === lastUncalledIdx ? { ...b, count: b.count - 1 } : b
      );
    }
    onChange({ ...state, batches: next }, "−1 miði");
  };

  const callBatch = (batchId) => {
    const t = Date.now();
    const batch = batches.find((b) => b.id === batchId);
    const next = batches.map((b) =>
      b.id === batchId && b.calledAt == null ? { ...b, calledAt: t } : b
    );
    onChange({
      ...state,
      batches: next,
      callStartedAt: callStartedAt ?? t,
      lastCallAt: t,
    }, `Kalla ${batch ? batch.count : ""}`);
  };

  const callAllPending = () => {
    if (pendingBatches.length === 0) return;
    const t = Date.now();
    const next = batches.map((b) =>
      b.calledAt == null ? { ...b, calledAt: t } : b
    );
    onChange({
      ...state,
      batches: next,
      callStartedAt: callStartedAt ?? t,
      lastCallAt: t,
    }, "Kalla allt");
  };

  // Undo last call: find the most recently called batch and put it back to pending.
  // Disabled if pendingSend < the most recently called batch's count
  // (would create inconsistency where sent > called).
  const calledBatches = batches.filter((b) => b.calledAt != null);
  const lastCalledBatch = calledBatches.length
    ? calledBatches.reduce((a, b) => (a.calledAt > b.calledAt ? a : b))
    : null;
  const canUncall =
    lastCalledBatch != null && pendingSend >= lastCalledBatch.count;

  const uncallLast = () => {
    if (!canUncall) return;
    const next = batches.map((b) =>
      b.id === lastCalledBatch.id ? { ...b, calledAt: null } : b
    );
    // Recompute lastCallAt from remaining called batches
    const stillCalled = next.filter((b) => b.calledAt != null);
    const newLastCallAt = stillCalled.length
      ? Math.max(...stillCalled.map((b) => b.calledAt))
      : null;
    const newCallStartedAt = stillCalled.length ? callStartedAt : null;
    onChange({
      ...state,
      batches: next,
      lastCallAt: newLastCallAt,
      callStartedAt: newCallStartedAt,
    }, "Bakka kall");
  };

  const markSent = (n) => {
    if (pendingSend <= 0) return;
    const toSend = Math.min(n, pendingSend);
    const action = {
      id: `s_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      count: toSend,
      at: Date.now(),
    };
    onChange({ ...state, sentActions: [...sentActions, action] }, `Sent ${toSend}`);
  };

  const sendAll = () => {
    if (pendingSend <= 0) return;
    const action = {
      id: `s_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      count: pendingSend,
      at: Date.now(),
    };
    onChange({ ...state, sentActions: [...sentActions, action] }, `Sent allt (${pendingSend})`);
  };

  // Undo last sent action — symmetric with uncallLast
  const lastSentAction = sentActions.length
    ? sentActions[sentActions.length - 1]
    : null;
  const canUndoSent = lastSentAction != null;

  const undoLastSent = () => {
    if (!canUndoSent) return;
    onChange({
      ...state,
      sentActions: sentActions.slice(0, -1),
    }, "Bakka sent");
  };

  const reset = () => {
    onChange({
      batches: [],
      sentActions: [],
      callStartedAt: null,
      lastCallAt: null,
    }, "Reset");
    setConfirmReset(false);
  };

  const timerTone = timerStopped ? "var(--text-secondary)" : timerToneFor(sinceLastCall);

  return (
    <div
      className="card"
      style={{
        "--accent": course.accent,
      }}
    >
      <div className="card-header">
        <div className="course-name">{course.name}</div>
        <div
          className="timer-pill"
          style={{ color: timerTone, borderColor: timerTone }}
          title={timerStopped ? "Stöðvað — allt sent út" : "Tími síðan síðast kallað"}
        >
          <span
            className={`timer-dot ${timerStopped ? "timer-dot-stopped" : ""}`}
            style={{ background: timerTone }}
          />
          {formatElapsed(sinceLastCall)}
        </div>
      </div>

      {/* Big number — remaining (capped) or sent (open) */}
      <div className="remaining-block">
        <div className="remaining-num">{openCount ? sent : remaining}</div>
        <div className="remaining-label">
          {openCount ? "sent út" : `eftir af ${total}`}
        </div>
      </div>

      {/* Progress bar — only when capped */}
      {!openCount && (
      <div className="progress-track">
        <div
          className="progress-sent"
          style={{ width: `${total > 0 ? (sent / total) * 100 : 0}%` }}
        />
        <div
          className="progress-called"
          style={{
            left: `${total > 0 ? (sent / total) * 100 : 0}%`,
            width: `${total > 0 ? ((called - sent) / total) * 100 : 0}%`,
          }}
        />
        <div
          className="progress-tickets"
          style={{
            left: `${total > 0 ? (called / total) * 100 : 0}%`,
            width: `${total > 0 ? ((tickets - called) / total) * 100 : 0}%`,
          }}
        />
      </div>
      )}

      {/* Three counters */}
      <div className="stats">
        <div className="stat">
          <div className="stat-label">Tickets in</div>
          <div className="stat-value">{tickets}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Called</div>
          <div className="stat-value">{called}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Sent</div>
          <div className="stat-value">{sent}</div>
        </div>
      </div>

      {/* STAGE 1 — Tickets in */}
      <div className="stage">
        <div className="stage-label">1. Miðar inn</div>
        <div className="btn-row btn-row-wrap">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <button
              key={n}
              className="btn btn-add btn-num"
              onClick={() => editTable(addBatch(n))}
            >
              +{n}
            </button>
          ))}
          <button
            className="btn btn-add btn-custom"
            onClick={() => setOrderDialogOpen(true)}
            title="Stærra borð: borðnúmer og fjöldi gesta"
          >
            +N
          </button>
          <button
            className="btn btn-sub"
            onClick={removeLastUncalled}
            disabled={pendingBatches.length === 0}
            title="Bakka síðasta ókallaða batch um 1"
          >
            −1
          </button>
        </div>
      </div>

      {/* STAGE 2 — Call individual batches */}
      <div className="stage">
        <div className="stage-label">
          2. Kalla í eldhús
          {pendingBatches.length > 0 && (
            <span className="pending-badge">{pendingBatches.length} pant.</span>
          )}
        </div>
        {pendingBatches.length === 0 ? (
          <button className="btn btn-call" disabled>
            Ekkert að kalla
          </button>
        ) : (
          <>
            <div className="batch-row">
              {pendingBatches.map((b) => {
                const age = now - b.addedAt;
                const tone = timerToneFor(age);
                return (
                  <div key={b.id} className="order-tile">
                    <div className="order-meta-row">
                      <button
                        className="order-meta"
                        onClick={() => editTable(b)}
                        title="Smelltu til að skrá borðnúmer"
                      >
                        <span className={`order-table ${b.table == null ? "order-table-empty" : ""}`}>
                          {b.table == null ? "+ Borð" : `Borð ${b.table}`}
                        </span>
                        <span className="order-timer" style={{ color: tone }}>
                          {formatElapsed(age)}
                        </span>
                      </button>
                      <button
                        className="order-remove"
                        onClick={() => removeBatch(b.id)}
                        title={`Eyða pöntun (${b.count})`}
                        aria-label={`Eyða pöntun (${b.count})`}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <path d="M6 6l12 12M18 6L6 18" />
                        </svg>
                      </button>
                    </div>
                    <button
                      className="btn btn-call btn-call-batch"
                      onClick={() => callBatch(b.id)}
                      title={`Bætt við ${new Date(b.addedAt).toLocaleTimeString("is-IS", { hour: "2-digit", minute: "2-digit" })}`}
                    >
                      Kalla {b.count}
                    </button>
                  </div>
                );
              })}
            </div>
            {pendingBatches.length > 1 && (
              <button
                className="btn btn-call-all"
                onClick={callAllPending}
              >
                Kalla allt ({pendingBatches.reduce((a, b) => a + b.count, 0)})
              </button>
            )}
          </>
        )}
        {lastCalledBatch != null && (
          <button
            className="btn btn-uncall"
            onClick={uncallLast}
            disabled={!canUncall}
            title={
              canUncall
                ? `Bakka síðasta kalli (${lastCalledBatch.count})`
                : `Get ekki bakkað — bakka þarf sent fyrst (${lastCalledBatch.count - pendingSend} af ${lastCalledBatch.count} eru sent)`
            }
          >
            ↶ Bakka kall {lastCalledBatch.count}
          </button>
        )}
      </div>

      {/* STAGE 3 — Send */}
      <div className="stage">
        <div className="stage-label">
          3. Merkja sent {pendingSend > 0 && <span className="pending-badge">{pendingSend} bíða</span>}
        </div>
        {inKitchen.length > 0 && (
          <div className="kitchen-list" aria-label="Pantanir í eldhúsi">
            {inKitchen.map((b) => {
              // Stopped when called: how long the order waited before being called
              const age = b.calledAt - b.addedAt;
              const tone = timerToneFor(age);
              return (
                <button
                  key={b.id}
                  className="kitchen-row"
                  style={{ borderLeftColor: tone }}
                  onClick={() => editTable(b)}
                  title="Smelltu til að skrá borðnúmer"
                >
                  <span className={`order-table ${b.table == null ? "order-table-empty" : ""}`}>
                    {b.table == null ? "+ Borð" : `Borð ${b.table}`}
                  </span>
                  <span className="kitchen-count">
                    {b.waiting < b.count ? `${b.waiting} af ${b.count}` : b.count}
                  </span>
                  <span
                    className="order-timer"
                    style={{ color: tone }}
                    title="Stöðvað — tími frá því miðinn kom inn þar til kallað var"
                  >
                    <span className="order-timer-stopped" aria-hidden="true">■</span>
                    {formatElapsed(age)}
                  </span>
                </button>
              );
            })}
          </div>
        )}
        <div className="btn-row btn-row-wrap">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <button
              key={n}
              className="btn btn-send btn-num"
              onClick={() => markSent(n)}
              disabled={pendingSend <= 0}
            >
              +{n}
            </button>
          ))}
          <button
            className="btn btn-send btn-custom"
            onClick={() =>
              onCustomInput({
                title: `${course.name} — Merkja sent`,
                placeholder: "Fjöldi diska",
                max: pendingSend,
                onSubmit: (n) => markSent(n),
              })
            }
            disabled={pendingSend <= 0}
          >
            +N
          </button>
          <button
            className="btn btn-send-all"
            onClick={sendAll}
            disabled={pendingSend <= 0}
          >
            Allt ({pendingSend})
          </button>
        </div>
        {lastSentAction != null && (
          <button
            className="btn btn-uncall"
            onClick={undoLastSent}
            title={`Bakka síðasta sent (${lastSentAction.count})`}
          >
            ↶ Bakka sent {lastSentAction.count}
          </button>
        )}
      </div>

      {/* Footer actions */}
      <div className="footer-row">
        <button className="btn btn-reset btn-reset-full" onClick={() => setConfirmReset(true)}>
          RESET
        </button>
      </div>

      {/* Mounted only while open, so every new order starts with empty fields */}
      {orderDialogOpen && <OrderDialog
        open
        title={`${course.name} — Nýtt borð`}
        onSubmit={(count, table) => {
          setOrderDialogOpen(false);
          addBatch(count, table);
        }}
        onCancel={() => setOrderDialogOpen(false)}
      />}

      <ConfirmDialog
        open={confirmReset}
        title={`Núllstilla ${course.name}?`}
        message="Þetta hreinsar tickets, called, sent og tímamæli fyrir þennan rétt."
        onConfirm={reset}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  );
}

function ExpediterCounter() {
  const initial = () => ({
    batches: [],
    sentActions: [],
    callStartedAt: null,
    lastCallAt: null,
  });

  // Try to restore from window.storage if available
  const [states, setStates] = useState({
    starter: initial(),
    main: initial(),
    dessert: initial(),
  });
  const [eventName, setEventName] = useState(DEFAULT_EVENT_NAME);
  const [loaded, setLoaded] = useState(false);
  const [confirmResetAll, setConfirmResetAll] = useState(false);
  const [total, setTotal] = useState(DEFAULT_TOTAL);
  const [openCount, setOpenCount] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const saved = window.localStorage.getItem("expediter:theme");
      if (saved === "light" || saved === "dark") return saved;
    }
    return "dark";
  });
  const [customInput, setCustomInput] = useState(null);
  // customInput shape: { key, title, placeholder, max?, quickPicks?, initialValue?, allowEmpty?, onSubmit, onClear? }
  // A new key per dialog so one opened straight after another starts fresh
  const openCustomInput = (opts) =>
    setCustomInput({ ...opts, key: `ci_${Date.now()}_${Math.random().toString(36).slice(2, 7)}` });
  const [resumePrompt, setResumePrompt] = useState(null);
  // resumePrompt shape: { parsed, savedAt, summary } | null
  const [history, setHistory] = useState([]);
  // history: [{ states, label }] — snapshots taken before each change, newest last
  const statesRef = useRef(states);
  statesRef.current = states;
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Helper: migrate stored states to current schema
  const migrateStates = (rawStates) => {
    const migrated = {};
    for (const key of Object.keys(rawStates || {})) {
      const s = rawStates[key];
      if (!s) {
        migrated[key] = initial();
        continue;
      }
      let batches;
      if (Array.isArray(s.batches)) {
        batches = s.batches;
      } else {
        batches = [];
        const called = s.called || 0;
        const tickets = s.tickets || 0;
        if (called > 0) {
          batches.push({
            id: `mig_called_${key}`,
            count: called,
            addedAt: s.callStartedAt || Date.now(),
            calledAt: s.lastCallAt || Date.now(),
          });
        }
        if (tickets - called > 0) {
          batches.push({
            id: `mig_pending_${key}`,
            count: tickets - called,
            addedAt: Date.now(),
            calledAt: null,
          });
        }
      }
      let sentActions;
      if (Array.isArray(s.sentActions)) {
        sentActions = s.sentActions;
      } else if (typeof s.sent === "number" && s.sent > 0) {
        sentActions = [{
          id: `mig_sent_${key}`,
          count: s.sent,
          at: s.lastCallAt || Date.now(),
        }];
      } else {
        sentActions = [];
      }
      migrated[key] = {
        batches,
        sentActions,
        callStartedAt: s.callStartedAt || null,
        lastCallAt: s.lastCallAt || null,
      };
    }
    return migrated;
  };

  // Check for saved state and offer to resume
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" && window.localStorage
        ? window.localStorage.getItem("expediter:state")
        : null;
      if (!raw) {
        setLoaded(true);
        return;
      }
      const parsed = JSON.parse(raw);
      if (parsed.eventName === OLD_DEFAULT_EVENT_NAME) parsed.eventName = DEFAULT_EVENT_NAME;
      // Check if there's anything meaningful to resume
      const states = parsed.states || {};
      const hasActivity = Object.values(states).some((s) => {
        if (!s) return false;
        const hasBatches = Array.isArray(s.batches) && s.batches.length > 0;
        const hasSent = Array.isArray(s.sentActions) && s.sentActions.length > 0;
        const hasOldData = (s.tickets || 0) > 0 || (s.sent || 0) > 0;
        return hasBatches || hasSent || hasOldData;
      });
      if (!hasActivity) {
        // Apply settings (event name, total, openCount) silently — no need to prompt
        if (parsed.eventName) setEventName(parsed.eventName);
        if (typeof parsed.total === "number") setTotal(parsed.total);
        if (typeof parsed.openCount === "boolean") setOpenCount(parsed.openCount);
        setLoaded(true);
        return;
      }
      // Build summary for the resume prompt
      const migrated = migrateStates(states);
      const summary = Object.keys(migrated).map((k) => {
        const s = migrated[k];
        const sent = s.sentActions.reduce((a, x) => a + x.count, 0);
        const tickets = s.batches.reduce((a, b) => a + b.count, 0);
        return { key: k, sent, tickets };
      });
      setResumePrompt({
        parsed,
        migrated,
        savedAt: parsed.savedAt || null,
        summary,
      });
    } catch (e) {
      // Bad data — start fresh
      setLoaded(true);
    }
  }, []);

  const acceptResume = () => {
    if (!resumePrompt) return;
    const { parsed, migrated } = resumePrompt;
    setStates(migrated);
    if (parsed.eventName) setEventName(parsed.eventName);
    if (typeof parsed.total === "number") setTotal(parsed.total);
    if (typeof parsed.openCount === "boolean") setOpenCount(parsed.openCount);
    setResumePrompt(null);
    setLoaded(true);
  };

  const declineResume = () => {
    if (!resumePrompt) return;
    // Keep settings (event name, total, openCount) but discard counts
    const { parsed } = resumePrompt;
    if (parsed.eventName) setEventName(parsed.eventName);
    if (typeof parsed.total === "number") setTotal(parsed.total);
    if (typeof parsed.openCount === "boolean") setOpenCount(parsed.openCount);
    setResumePrompt(null);
    setLoaded(true);
  };

  // Persist on change
  useEffect(() => {
    if (!loaded) return;
    (async () => {
      try {
        if (typeof window !== "undefined" && window.localStorage) {
          window.localStorage.setItem(
            "expediter:state",
            JSON.stringify({ states, eventName, total, openCount, savedAt: Date.now() })
          );
        }
      } catch (e) {
        // ignore
      }
    })();
  }, [states, eventName, total, openCount, loaded]);

  const MAX_HISTORY = 100;
  const pushHistory = (label) => {
    const snapshot = { states: statesRef.current, label };
    setHistory((h) => [...h.slice(-(MAX_HISTORY - 1)), snapshot]);
  };

  const updateCourse = (id, next, label) => {
    const course = COURSES.find((c) => c.id === id);
    pushHistory(`${label || "Breyting"} · ${course ? course.name : id}`);
    setStates((prev) => ({ ...prev, [id]: next }));
  };

  const undo = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setStates(last.states);
    setHistory(history.slice(0, -1));
  };
  const lastAction = history.length ? history[history.length - 1] : null;

  const resetAll = () => {
    pushHistory("Reset allt");
    setStates({
      starter: initial(),
      main: initial(),
      dessert: initial(),
    });
    setConfirmResetAll(false);
  };

  // Fullscreen — hidden where unsupported (iPhone) or already running as an installed app
  const fullscreenSupported =
    typeof document !== "undefined" &&
    !!(document.fullscreenEnabled || document.webkitFullscreenEnabled);
  const runningAsApp =
    typeof window !== "undefined" &&
    ((window.matchMedia && (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.matchMedia("(display-mode: fullscreen)").matches
    )) || window.navigator.standalone === true);

  useEffect(() => {
    const onChange = () => {
      const fs = !!(document.fullscreenElement || document.webkitFullscreenElement);
      setIsFullscreen(fs);
      document.documentElement.classList.toggle("in-fullscreen", fs);
    };
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, []);

  const toggleFullscreen = () => {
    try {
      const el = document.documentElement;
      let p;
      if (document.fullscreenElement || document.webkitFullscreenElement) {
        p = document.exitFullscreen ? document.exitFullscreen() : document.webkitExitFullscreen();
      } else {
        p = el.requestFullscreen ? el.requestFullscreen() : el.webkitRequestFullscreen();
      }
      if (p && typeof p.catch === "function") p.catch(() => {});
    } catch (e) { /* ignore */ }
  };

  // Apply theme to <html> element and persist
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
      // Update mobile browser chrome color
      const meta = document.querySelector('meta[name="theme-color"]:not([media])');
      if (meta) meta.setAttribute('content', theme === 'dark' ? '#161616' : '#ffffff');
    }
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        window.localStorage.setItem("expediter:theme", theme);
      } catch (e) { /* ignore */ }
    }
  }, [theme]);

  // Aggregate
  const sumSent = (s) =>
    (s.sentActions || []).reduce((a, x) => a + x.count, 0);
  const totalSent =
    sumSent(states.starter) + sumSent(states.main) + sumSent(states.dessert);
  const totalExpected = total * 3;

  return (
    <div className="app">

      <div className="header">
        <div className="header-left">
          <input
            className="event-input"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
          <div className="header-sub">
            Expediter · {openCount ? "opin talning" : `${total} gestir`} · 3 réttir
          </div>
        </div>
        <div className="header-right">
          <div className="grand-total">
            <div className="grand-total-num">
              {totalSent}
              {!openCount && (
                <span style={{ color: "var(--text-muted)" }}> / {totalExpected}</span>
              )}
            </div>
            <div className="grand-total-label">Total Sent</div>
          </div>
          <button
            className="undo-btn"
            onClick={undo}
            disabled={!lastAction}
            title={lastAction ? `Afturkalla: ${lastAction.label}` : "Ekkert að afturkalla"}
          >
            <span className="undo-btn-title">↶ Afturkalla</span>
            <span className="undo-btn-label">{lastAction ? lastAction.label : "—"}</span>
          </button>
          {fullscreenSupported && !runningAsApp && (
            <button
              className="icon-btn icon-btn-static"
              onClick={toggleFullscreen}
              title={isFullscreen ? "Hætta í fullum skjá" : "Fullur skjár"}
              aria-label={isFullscreen ? "Hætta í fullum skjá" : "Fullur skjár"}
            >
              {isFullscreen ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" />
                </svg>
              )}
            </button>
          )}
          <button
            className="icon-btn"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title={theme === "dark" ? "Skipta í ljóst þema" : "Skipta í dökkt þema"}
            aria-label="Skipta þema"
          >
            {theme === "dark" ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
          <button className="icon-btn" onClick={() => setSettingsOpen(true)} title="Stillingar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
          <button className="reset-all" onClick={() => setConfirmResetAll(true)}>
            Reset Allt
          </button>
        </div>
      </div>

      <div className="grid">
        {COURSES.map((c) => (
          <CourseCard
            key={c.id}
            course={c}
            state={states[c.id]}
            onChange={(next, label) => updateCourse(c.id, next, label)}
            total={total}
            openCount={openCount}
            onCustomInput={openCustomInput}
          />
        ))}
      </div>

      <ResumeDialog
        open={resumePrompt != null}
        eventName={resumePrompt?.parsed?.eventName || eventName}
        savedAt={resumePrompt?.savedAt}
        summary={resumePrompt?.summary || []}
        courses={COURSES}
        onResume={acceptResume}
        onDiscard={declineResume}
      />

      <NumberInputDialog
        key={customInput?.key}
        open={customInput != null}
        title={customInput?.title || ""}
        placeholder={customInput?.placeholder || ""}
        max={customInput?.max}
        quickPicks={customInput?.quickPicks}
        initialValue={customInput?.initialValue}
        allowEmpty={customInput?.allowEmpty}
        onSubmit={(n) => {
          // Close first: the callback may open the next dialog (+N → table number)
          setCustomInput(null);
          customInput?.onSubmit(n);
        }}
        onClear={customInput?.onClear ? () => {
          setCustomInput(null);
          customInput.onClear();
        } : null}
        onCancel={() => setCustomInput(null)}
      />

      <SettingsDialog
        open={settingsOpen}
        currentTotal={total}
        currentOpenCount={openCount}
        onSave={(newTotal, newOpen) => {
          setTotal(newTotal);
          setOpenCount(newOpen);
          setSettingsOpen(false);
        }}
        onCancel={() => setSettingsOpen(false)}
      />

      <ConfirmDialog
        open={confirmResetAll}
        title="Núllstilla ALLA rétti?"
        message="Þetta hreinsar allar talningar og tímamæla fyrir alla þrjá rétti. Hægt er að afturkalla með ↶ Afturkalla takkanum."
        onConfirm={resetAll}
        onCancel={() => setConfirmResetAll(false)}
      />
    </div>
  );
}


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(ExpediterCounter));
