// Generated from src/app.jsx by build.js — edit the source, then run: node build.js
const {
  useState,
  useEffect,
  useRef
} = React;
const DEFAULT_TOTAL = 110;
const COURSES = [{
  id: "starter",
  name: "FORRÉTTUR",
  accent: "var(--course-starter)"
}, {
  id: "main",
  name: "AÐALRÉTTUR",
  accent: "var(--course-main)"
}, {
  id: "dessert",
  name: "EFTIRRÉTTUR",
  accent: "var(--course-dessert)"
}];
const INCREMENTS = [1, 2, 4, 6, 8, 10];
function formatElapsed(ms) {
  if (ms == null) return "--:--";
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
function timerToneFor(ms) {
  if (ms == null) return "var(--text-muted)";
  if (ms > 8 * 60 * 1000) return "var(--danger)";
  if (ms > 4 * 60 * 1000) return "var(--alert)";
  return "var(--success)";
}
function CloseButton({
  onClick,
  label = "Loka"
}) {
  return React.createElement("button", {
    className: "close-x",
    onClick: onClick,
    title: label,
    "aria-label": label
  }, React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round"
  }, React.createElement("path", {
    d: "M6 6l12 12M18 6L6 18"
  })));
}
function ResumeDialog({
  open,
  eventName,
  savedAt,
  summary,
  courses,
  onResume,
  onDiscard
}) {
  if (!open) return null;
  const formatSavedAt = ts => {
    if (!ts) return "óþekktur tími";
    const d = new Date(ts);
    const now = new Date();
    const sameDay = d.toDateString() === now.toDateString();
    const time = d.toLocaleTimeString("is-IS", {
      hour: "2-digit",
      minute: "2-digit"
    });
    if (sameDay) return `í dag kl. ${time}`;
    const yest = new Date(now);
    yest.setDate(yest.getDate() - 1);
    if (d.toDateString() === yest.toDateString()) return `í gær kl. ${time}`;
    const date = d.toLocaleDateString("is-IS", {
      day: "numeric",
      month: "short"
    });
    return `${date} kl. ${time}`;
  };
  const courseByKey = Object.fromEntries(courses.map(c => [c.id, c]));
  return React.createElement("div", {
    className: "modal-backdrop",
    style: {
      pointerEvents: "auto"
    }
  }, React.createElement("div", {
    className: "modal modal-resume",
    onClick: e => e.stopPropagation()
  }, React.createElement("div", {
    className: "modal-title"
  }, "\xD3kl\xE1ra\xF0 kv\xF6ld?"), React.createElement("div", {
    className: "modal-message"
  }, "Vistu\xF0 talning fannst fyrir ", React.createElement("strong", null, eventName), " fr\xE1 ", formatSavedAt(savedAt), "."), React.createElement("div", {
    className: "resume-summary"
  }, summary.map(s => {
    const c = courseByKey[s.key];
    return React.createElement("div", {
      key: s.key,
      className: "resume-row",
      style: {
        "--accent": c?.accent
      }
    }, React.createElement("div", {
      className: "resume-row-name"
    }, c?.name || s.key), React.createElement("div", {
      className: "resume-row-stat"
    }, React.createElement("span", {
      className: "resume-num"
    }, s.sent), React.createElement("span", {
      className: "resume-sep"
    }, "sent"), React.createElement("span", {
      className: "resume-num resume-num-muted"
    }, s.tickets), React.createElement("span", {
      className: "resume-sep"
    }, "mi\xF0ar")));
  })), React.createElement("div", {
    className: "modal-actions"
  }, React.createElement("button", {
    className: "btn modal-btn modal-btn-discard",
    onClick: onDiscard
  }, "Byrja upp \xE1 n\xFDtt"), React.createElement("button", {
    className: "btn modal-btn modal-btn-primary",
    onClick: onResume
  }, "Halda \xE1fram"))));
}
function NumberInputDialog({
  open,
  title,
  placeholder,
  max,
  quickPicks: picks,
  initialValue,
  allowEmpty,
  onSubmit,
  onClear,
  onCancel
}) {
  const [value, setValue] = useState("");
  const inputRef = useRef(null);
  useEffect(() => {
    if (open) {
      setValue(initialValue != null ? String(initialValue) : "");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);
  if (!open) return null;
  const parsed = parseInt(value, 10);
  const isEmpty = value.trim() === "";
  const isValid = allowEmpty && isEmpty || Number.isFinite(parsed) && parsed > 0 && parsed <= 999 && (max == null || parsed <= max);
  const submit = () => {
    if (!isValid) return;
    onSubmit(isEmpty ? null : parsed);
  };
  const handleKey = e => {
    if (e.key === "Enter") submit();
    if (e.key === "Escape") onCancel();
  };
  const quickPicks = (picks ?? [9, 10, 12, 15, 20, 25]).filter(n => max == null || n <= max);
  return React.createElement("div", {
    className: "modal-backdrop",
    onClick: onCancel
  }, React.createElement("div", {
    className: "modal modal-numinput",
    onClick: e => e.stopPropagation()
  }, React.createElement(CloseButton, {
    onClick: onCancel
  }), React.createElement("div", {
    className: "modal-title"
  }, title), max != null && React.createElement("div", {
    className: "modal-message"
  }, "H\xE1mark: ", max), React.createElement("input", {
    ref: inputRef,
    autoFocus: true,
    type: "number",
    inputMode: "numeric",
    className: "num-input num-input-large",
    placeholder: placeholder,
    value: value,
    onChange: e => setValue(e.target.value),
    onKeyDown: handleKey,
    min: 1,
    max: max ?? 999
  }), quickPicks.length > 0 && React.createElement("div", {
    className: "presets-row"
  }, quickPicks.map(n => React.createElement("button", {
    key: n,
    className: "preset-btn",
    onClick: () => setValue(String(n))
  }, n))), React.createElement("div", {
    className: "modal-actions"
  }, onClear && React.createElement("button", {
    className: "btn modal-btn modal-btn-discard",
    onClick: onClear
  }, "Fjarl\xE6gja"), React.createElement("button", {
    className: "btn btn-ghost modal-btn",
    onClick: onCancel
  }, "H\xE6tta vi\xF0"), React.createElement("button", {
    className: "btn modal-btn modal-btn-primary",
    onClick: submit,
    disabled: !isValid
  }, "Sta\xF0festa"))));
}
function OrderDialog({
  open,
  title,
  onSubmit,
  onCancel
}) {
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
  const tableValid = table.trim() === "" || Number.isFinite(parsedTable) && parsedTable > 0 && parsedTable <= 999;
  const countValid = Number.isFinite(parsedCount) && parsedCount > 0 && parsedCount <= 999;
  const isValid = tableValid && countValid;
  const submit = () => {
    if (!isValid) return;
    onSubmit(parsedCount, table.trim() === "" ? null : parsedTable);
  };
  const onTableKey = e => {
    if (e.key === "Enter") countRef.current?.focus();
    if (e.key === "Escape") onCancel();
  };
  const onCountKey = e => {
    if (e.key === "Enter") submit();
    if (e.key === "Escape") onCancel();
  };
  return React.createElement("div", {
    className: "modal-backdrop",
    onClick: onCancel
  }, React.createElement("div", {
    className: "modal modal-numinput",
    onClick: e => e.stopPropagation()
  }, React.createElement(CloseButton, {
    onClick: onCancel
  }), React.createElement("div", {
    className: "modal-title"
  }, title), React.createElement("div", {
    className: "order-fields"
  }, React.createElement("label", {
    className: "order-field"
  }, React.createElement("span", {
    className: "settings-label"
  }, "Bor\xF0"), React.createElement("input", {
    ref: tableRef,
    autoFocus: true,
    type: "number",
    inputMode: "numeric",
    className: "num-input num-input-large",
    placeholder: "\u2014",
    value: table,
    onChange: e => setTable(e.target.value),
    onKeyDown: onTableKey,
    min: 1,
    max: 999
  })), React.createElement("label", {
    className: "order-field"
  }, React.createElement("span", {
    className: "settings-label"
  }, "Fj\xF6ldi gesta"), React.createElement("input", {
    ref: countRef,
    type: "number",
    inputMode: "numeric",
    className: "num-input num-input-large",
    placeholder: "0",
    value: count,
    onChange: e => setCount(e.target.value),
    onKeyDown: onCountKey,
    min: 1,
    max: 999
  }))), React.createElement("div", {
    className: "presets-row order-presets"
  }, [9, 10, 11, 12, 14, 16, 20].map(n => React.createElement("button", {
    key: n,
    className: `preset-btn ${parsedCount === n ? "preset-active" : ""}`,
    onClick: () => setCount(String(n))
  }, n))), React.createElement("div", {
    className: "modal-actions"
  }, React.createElement("button", {
    className: "btn btn-ghost modal-btn",
    onClick: onCancel
  }, "H\xE6tta vi\xF0"), React.createElement("button", {
    className: "btn modal-btn modal-btn-primary",
    onClick: submit,
    disabled: !isValid
  }, "Sta\xF0festa"))));
}
function SettingsDialog({
  open,
  currentTotal,
  currentOpenCount,
  onSave,
  onCancel
}) {
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
  const isValid = draftOpen || Number.isFinite(parsed) && parsed > 0 && parsed <= 9999;
  const handleSave = () => {
    if (!isValid) return;
    onSave(draftOpen ? 0 : parsed, draftOpen);
  };
  const bumpTotal = delta => {
    const cur = Number.isFinite(parsed) ? parsed : 0;
    const next = Math.max(1, Math.min(9999, cur + delta));
    setDraftTotal(String(next));
  };
  const presets = [50, 80, 110, 150, 200, 300];
  return React.createElement("div", {
    className: "modal-backdrop",
    onClick: onCancel
  }, React.createElement("div", {
    className: "modal modal-settings",
    onClick: e => e.stopPropagation()
  }, React.createElement(CloseButton, {
    onClick: onCancel
  }), React.createElement("div", {
    className: "modal-title"
  }, "Stillingar"), React.createElement("div", {
    className: "settings-section"
  }, React.createElement("label", {
    className: "settings-label"
  }, "Talningar-m\xE1tur"), React.createElement("div", {
    className: "toggle-row"
  }, React.createElement("button", {
    className: `toggle-btn ${!draftOpen ? "toggle-active" : ""}`,
    onClick: () => setDraftOpen(false)
  }, React.createElement("div", {
    className: "toggle-title"
  }, "\xDEak (cap)"), React.createElement("div", {
    className: "toggle-desc"
  }, "Veit fyrirfram hva\xF0 margir gestir")), React.createElement("button", {
    className: `toggle-btn ${draftOpen ? "toggle-active" : ""}`,
    onClick: () => setDraftOpen(true)
  }, React.createElement("div", {
    className: "toggle-title"
  }, "Opin talning"), React.createElement("div", {
    className: "toggle-desc"
  }, "Telur upp \xE1 vi\xF0 \xE1n \xFEaks")))), !draftOpen && React.createElement("div", {
    className: "settings-section"
  }, React.createElement("label", {
    className: "settings-label"
  }, "Heildarfj\xF6ldi gesta"), React.createElement("div", {
    className: "number-row"
  }, React.createElement("button", {
    className: "num-btn",
    onClick: () => bumpTotal(-10)
  }, "\u221210"), React.createElement("button", {
    className: "num-btn",
    onClick: () => bumpTotal(-1)
  }, "\u22121"), React.createElement("input", {
    type: "number",
    className: "num-input",
    value: draftTotal,
    onChange: e => setDraftTotal(e.target.value),
    min: 1,
    max: 9999
  }), React.createElement("button", {
    className: "num-btn",
    onClick: () => bumpTotal(1)
  }, "+1"), React.createElement("button", {
    className: "num-btn",
    onClick: () => bumpTotal(10)
  }, "+10")), React.createElement("div", {
    className: "presets-row"
  }, presets.map(p => React.createElement("button", {
    key: p,
    className: `preset-btn ${parsed === p ? "preset-active" : ""}`,
    onClick: () => setDraftTotal(String(p))
  }, p)))), React.createElement("div", {
    className: "settings-note"
  }, "Stillingin gildir fyrir alla \xFErj\xE1 r\xE9tti. N\xFAverandi talningar eru ekki n\xFAllstilltar."), React.createElement("div", {
    className: "modal-actions"
  }, React.createElement("button", {
    className: "btn btn-ghost modal-btn",
    onClick: onCancel
  }, "H\xE6tta vi\xF0"), React.createElement("button", {
    className: "btn modal-btn modal-btn-primary",
    onClick: handleSave,
    disabled: !isValid
  }, "Vista"))));
}
function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel
}) {
  if (!open) return null;
  return React.createElement("div", {
    className: "modal-backdrop",
    onClick: onCancel
  }, React.createElement("div", {
    className: "modal",
    onClick: e => e.stopPropagation()
  }, React.createElement(CloseButton, {
    onClick: onCancel
  }), React.createElement("div", {
    className: "modal-title"
  }, title), React.createElement("div", {
    className: "modal-message"
  }, message), React.createElement("div", {
    className: "modal-actions"
  }, React.createElement("button", {
    className: "btn btn-ghost modal-btn",
    onClick: onCancel
  }, "H\xE6tta vi\xF0"), React.createElement("button", {
    className: "btn modal-btn modal-btn-danger",
    onClick: onConfirm
  }, "N\xFAllstilla"))));
}
function CourseCard({
  course,
  state,
  onChange,
  total,
  openCount,
  onCustomInput
}) {
  const batches = state.batches || [];
  const sentActions = state.sentActions || [];
  const callStartedAt = state.callStartedAt || null;
  const lastCallAt = state.lastCallAt || null;
  const tickets = batches.reduce((a, b) => a + b.count, 0);
  const called = batches.filter(b => b.calledAt != null).reduce((a, b) => a + b.count, 0);
  const pendingBatches = batches.filter(b => b.calledAt == null).sort((a, b) => a.addedAt - b.addedAt);
  const sent = sentActions.reduce((a, s) => a + s.count, 0);
  const remaining = openCount ? null : Math.max(0, total - sent);
  const pendingSend = called - sent;
  const inKitchen = [];
  {
    let sentLeft = sent;
    const calledInOrder = batches.filter(b => b.calledAt != null).sort((a, b) => a.calledAt - b.calledAt || a.addedAt - b.addedAt);
    for (const b of calledInOrder) {
      const out = Math.min(b.count, sentLeft);
      sentLeft -= out;
      if (out < b.count) inKitchen.push({
        ...b,
        waiting: b.count - out
      });
    }
  }
  const lastSentAt = sentActions.length ? sentActions[sentActions.length - 1].at : null;
  const timerStopped = lastCallAt != null && called > 0 && pendingSend <= 0;
  const [now, setNow] = useState(Date.now());
  const [confirmReset, setConfirmReset] = useState(false);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const hasLiveTimers = lastCallAt != null && !timerStopped || pendingBatches.length > 0;
  useEffect(() => {
    if (!hasLiveTimers) return;
    setNow(Date.now());
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, [hasLiveTimers]);
  const sinceLastCall = lastCallAt == null ? null : timerStopped ? Math.max(lastSentAt ?? lastCallAt, lastCallAt) - lastCallAt : now - lastCallAt;
  const stateRef = useRef(state);
  stateRef.current = state;
  const addBatch = (count, table = null) => {
    if (count <= 0) return;
    const newBatch = {
      id: `b_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      count,
      addedAt: Date.now(),
      calledAt: null,
      table
    };
    onChange({
      ...state,
      batches: [...batches, newBatch]
    }, table == null ? `+${count} miðar` : `Borð ${table} (+${count})`);
    return newBatch;
  };
  const removeBatch = batchId => {
    const batch = batches.find(b => b.id === batchId);
    if (!batch || batch.calledAt != null) return;
    onChange({
      ...state,
      batches: batches.filter(b => b.id !== batchId)
    }, `Eyða pöntun ${batch.count}`);
  };
  const setTable = (batchId, table) => {
    const cur = stateRef.current;
    const curBatches = cur.batches || [];
    const batch = curBatches.find(b => b.id === batchId);
    if (!batch || (batch.table ?? null) === table) return;
    const next = curBatches.map(b => b.id === batchId ? {
      ...b,
      table
    } : b);
    onChange({
      ...cur,
      batches: next
    }, table == null ? "Borð fjarlægt" : `Borð ${table}`);
  };
  const editTable = batch => {
    onCustomInput({
      title: `${course.name} — Borð`,
      placeholder: "Borðnúmer",
      quickPicks: [],
      initialValue: batch.table,
      allowEmpty: true,
      onSubmit: n => setTable(batch.id, n),
      onClear: batch.table != null ? () => setTable(batch.id, null) : null
    });
  };
  const removeLastUncalled = () => {
    const lastUncalledIdx = [...batches].map((b, i) => ({
      b,
      i
    })).reverse().find(({
      b
    }) => b.calledAt == null)?.i;
    if (lastUncalledIdx == null) return;
    const batch = batches[lastUncalledIdx];
    let next;
    if (batch.count <= 1) {
      next = batches.filter((_, i) => i !== lastUncalledIdx);
    } else {
      next = batches.map((b, i) => i === lastUncalledIdx ? {
        ...b,
        count: b.count - 1
      } : b);
    }
    onChange({
      ...state,
      batches: next
    }, "−1 miði");
  };
  const callBatch = batchId => {
    const t = Date.now();
    const batch = batches.find(b => b.id === batchId);
    const next = batches.map(b => b.id === batchId && b.calledAt == null ? {
      ...b,
      calledAt: t
    } : b);
    onChange({
      ...state,
      batches: next,
      callStartedAt: callStartedAt ?? t,
      lastCallAt: t
    }, `Kalla ${batch ? batch.count : ""}`);
  };
  const callAllPending = () => {
    if (pendingBatches.length === 0) return;
    const t = Date.now();
    const next = batches.map(b => b.calledAt == null ? {
      ...b,
      calledAt: t
    } : b);
    onChange({
      ...state,
      batches: next,
      callStartedAt: callStartedAt ?? t,
      lastCallAt: t
    }, "Kalla allt");
  };
  const calledBatches = batches.filter(b => b.calledAt != null);
  const lastCalledBatch = calledBatches.length ? calledBatches.reduce((a, b) => a.calledAt > b.calledAt ? a : b) : null;
  const canUncall = lastCalledBatch != null && pendingSend >= lastCalledBatch.count;
  const uncallLast = () => {
    if (!canUncall) return;
    const next = batches.map(b => b.id === lastCalledBatch.id ? {
      ...b,
      calledAt: null
    } : b);
    const stillCalled = next.filter(b => b.calledAt != null);
    const newLastCallAt = stillCalled.length ? Math.max(...stillCalled.map(b => b.calledAt)) : null;
    const newCallStartedAt = stillCalled.length ? callStartedAt : null;
    onChange({
      ...state,
      batches: next,
      lastCallAt: newLastCallAt,
      callStartedAt: newCallStartedAt
    }, "Bakka kall");
  };
  const markSent = n => {
    if (pendingSend <= 0) return;
    const toSend = Math.min(n, pendingSend);
    const action = {
      id: `s_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      count: toSend,
      at: Date.now()
    };
    onChange({
      ...state,
      sentActions: [...sentActions, action]
    }, `Sent ${toSend}`);
  };
  const sendAll = () => {
    if (pendingSend <= 0) return;
    const action = {
      id: `s_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      count: pendingSend,
      at: Date.now()
    };
    onChange({
      ...state,
      sentActions: [...sentActions, action]
    }, `Sent allt (${pendingSend})`);
  };
  const lastSentAction = sentActions.length ? sentActions[sentActions.length - 1] : null;
  const canUndoSent = lastSentAction != null;
  const undoLastSent = () => {
    if (!canUndoSent) return;
    onChange({
      ...state,
      sentActions: sentActions.slice(0, -1)
    }, "Bakka sent");
  };
  const reset = () => {
    onChange({
      batches: [],
      sentActions: [],
      callStartedAt: null,
      lastCallAt: null
    }, "Reset");
    setConfirmReset(false);
  };
  const timerTone = timerStopped ? "var(--text-secondary)" : timerToneFor(sinceLastCall);
  return React.createElement("div", {
    className: "card",
    style: {
      "--accent": course.accent
    }
  }, React.createElement("div", {
    className: "card-header"
  }, React.createElement("div", {
    className: "course-name"
  }, course.name), React.createElement("div", {
    className: "timer-pill",
    style: {
      color: timerTone,
      borderColor: timerTone
    },
    title: timerStopped ? "Stöðvað — allt sent út" : "Tími síðan síðast kallað"
  }, React.createElement("span", {
    className: `timer-dot ${timerStopped ? "timer-dot-stopped" : ""}`,
    style: {
      background: timerTone
    }
  }), formatElapsed(sinceLastCall))), React.createElement("div", {
    className: "remaining-block"
  }, React.createElement("div", {
    className: "remaining-num"
  }, openCount ? sent : remaining), React.createElement("div", {
    className: "remaining-label"
  }, openCount ? "sent út" : `eftir af ${total}`)), !openCount && React.createElement("div", {
    className: "progress-track"
  }, React.createElement("div", {
    className: "progress-sent",
    style: {
      width: `${total > 0 ? sent / total * 100 : 0}%`
    }
  }), React.createElement("div", {
    className: "progress-called",
    style: {
      left: `${total > 0 ? sent / total * 100 : 0}%`,
      width: `${total > 0 ? (called - sent) / total * 100 : 0}%`
    }
  }), React.createElement("div", {
    className: "progress-tickets",
    style: {
      left: `${total > 0 ? called / total * 100 : 0}%`,
      width: `${total > 0 ? (tickets - called) / total * 100 : 0}%`
    }
  })), React.createElement("div", {
    className: "stats"
  }, React.createElement("div", {
    className: "stat"
  }, React.createElement("div", {
    className: "stat-label"
  }, "Tickets in"), React.createElement("div", {
    className: "stat-value"
  }, tickets)), React.createElement("div", {
    className: "stat"
  }, React.createElement("div", {
    className: "stat-label"
  }, "Called"), React.createElement("div", {
    className: "stat-value"
  }, called)), React.createElement("div", {
    className: "stat"
  }, React.createElement("div", {
    className: "stat-label"
  }, "Sent"), React.createElement("div", {
    className: "stat-value"
  }, sent))), React.createElement("div", {
    className: "stage"
  }, React.createElement("div", {
    className: "stage-label"
  }, "1. Mi\xF0ar inn"), React.createElement("div", {
    className: "btn-row btn-row-wrap"
  }, [1, 2, 3, 4, 5, 6, 7, 8].map(n => React.createElement("button", {
    key: n,
    className: "btn btn-add btn-num",
    onClick: () => editTable(addBatch(n))
  }, "+", n)), React.createElement("button", {
    className: "btn btn-add btn-custom",
    onClick: () => setOrderDialogOpen(true),
    title: "St\xE6rra bor\xF0: bor\xF0n\xFAmer og fj\xF6ldi gesta"
  }, "+N"), React.createElement("button", {
    className: "btn btn-sub",
    onClick: removeLastUncalled,
    disabled: pendingBatches.length === 0,
    title: "Bakka s\xED\xF0asta \xF3kalla\xF0a batch um 1"
  }, "\u22121"))), React.createElement("div", {
    className: "stage"
  }, React.createElement("div", {
    className: "stage-label"
  }, "2. Kalla \xED eldh\xFAs", pendingBatches.length > 0 && React.createElement("span", {
    className: "pending-badge"
  }, pendingBatches.length, " pant.")), pendingBatches.length === 0 ? React.createElement("button", {
    className: "btn btn-call",
    disabled: true
  }, "Ekkert a\xF0 kalla") : React.createElement(React.Fragment, null, React.createElement("div", {
    className: "batch-row"
  }, pendingBatches.map(b => {
    const age = now - b.addedAt;
    const tone = timerToneFor(age);
    return React.createElement("div", {
      key: b.id,
      className: "order-tile"
    }, React.createElement("div", {
      className: "order-meta-row"
    }, React.createElement("button", {
      className: "order-meta",
      onClick: () => editTable(b),
      title: "Smelltu til a\xF0 skr\xE1 bor\xF0n\xFAmer"
    }, React.createElement("span", {
      className: `order-table ${b.table == null ? "order-table-empty" : ""}`
    }, b.table == null ? "+ Borð" : `Borð ${b.table}`), React.createElement("span", {
      className: "order-timer",
      style: {
        color: tone
      }
    }, formatElapsed(age))), React.createElement("button", {
      className: "order-remove",
      onClick: () => removeBatch(b.id),
      title: `Eyða pöntun (${b.count})`,
      "aria-label": `Eyða pöntun (${b.count})`
    }, React.createElement("svg", {
      width: "14",
      height: "14",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2.5",
      strokeLinecap: "round"
    }, React.createElement("path", {
      d: "M6 6l12 12M18 6L6 18"
    })))), React.createElement("button", {
      className: "btn btn-call btn-call-batch",
      onClick: () => callBatch(b.id),
      title: `Bætt við ${new Date(b.addedAt).toLocaleTimeString("is-IS", {
        hour: "2-digit",
        minute: "2-digit"
      })}`
    }, "Kalla ", b.count));
  })), pendingBatches.length > 1 && React.createElement("button", {
    className: "btn btn-call-all",
    onClick: callAllPending
  }, "Kalla allt (", pendingBatches.reduce((a, b) => a + b.count, 0), ")")), lastCalledBatch != null && React.createElement("button", {
    className: "btn btn-uncall",
    onClick: uncallLast,
    disabled: !canUncall,
    title: canUncall ? `Bakka síðasta kalli (${lastCalledBatch.count})` : `Get ekki bakkað — bakka þarf sent fyrst (${lastCalledBatch.count - pendingSend} af ${lastCalledBatch.count} eru sent)`
  }, "\u21B6 Bakka kall ", lastCalledBatch.count)), React.createElement("div", {
    className: "stage"
  }, React.createElement("div", {
    className: "stage-label"
  }, "3. Merkja sent ", pendingSend > 0 && React.createElement("span", {
    className: "pending-badge"
  }, pendingSend, " b\xED\xF0a")), inKitchen.length > 0 && React.createElement("div", {
    className: "kitchen-list",
    "aria-label": "Pantanir \xED eldh\xFAsi"
  }, inKitchen.map(b => {
    const age = b.calledAt - b.addedAt;
    const tone = timerToneFor(age);
    return React.createElement("button", {
      key: b.id,
      className: "kitchen-row",
      style: {
        borderLeftColor: tone
      },
      onClick: () => editTable(b),
      title: "Smelltu til a\xF0 skr\xE1 bor\xF0n\xFAmer"
    }, React.createElement("span", {
      className: `order-table ${b.table == null ? "order-table-empty" : ""}`
    }, b.table == null ? "+ Borð" : `Borð ${b.table}`), React.createElement("span", {
      className: "kitchen-count"
    }, b.waiting < b.count ? `${b.waiting} af ${b.count}` : b.count), React.createElement("span", {
      className: "order-timer",
      style: {
        color: tone
      },
      title: "St\xF6\xF0va\xF0 \u2014 t\xEDmi fr\xE1 \xFEv\xED mi\xF0inn kom inn \xFEar til kalla\xF0 var"
    }, React.createElement("span", {
      className: "order-timer-stopped",
      "aria-hidden": "true"
    }, "\u25A0"), formatElapsed(age)));
  })), React.createElement("div", {
    className: "btn-row btn-row-wrap"
  }, [1, 2, 3, 4, 5, 6, 7, 8].map(n => React.createElement("button", {
    key: n,
    className: "btn btn-send btn-num",
    onClick: () => markSent(n),
    disabled: pendingSend <= 0
  }, "+", n)), React.createElement("button", {
    className: "btn btn-send btn-custom",
    onClick: () => onCustomInput({
      title: `${course.name} — Merkja sent`,
      placeholder: "Fjöldi diska",
      max: pendingSend,
      onSubmit: n => markSent(n)
    }),
    disabled: pendingSend <= 0
  }, "+N"), React.createElement("button", {
    className: "btn btn-send-all",
    onClick: sendAll,
    disabled: pendingSend <= 0
  }, "Allt (", pendingSend, ")")), lastSentAction != null && React.createElement("button", {
    className: "btn btn-uncall",
    onClick: undoLastSent,
    title: `Bakka síðasta sent (${lastSentAction.count})`
  }, "\u21B6 Bakka sent ", lastSentAction.count)), React.createElement("div", {
    className: "footer-row"
  }, React.createElement("button", {
    className: "btn btn-reset btn-reset-full",
    onClick: () => setConfirmReset(true)
  }, "RESET")), orderDialogOpen && React.createElement(OrderDialog, {
    open: true,
    title: `${course.name} — Nýtt borð`,
    onSubmit: (count, table) => {
      setOrderDialogOpen(false);
      addBatch(count, table);
    },
    onCancel: () => setOrderDialogOpen(false)
  }), React.createElement(ConfirmDialog, {
    open: confirmReset,
    title: `Núllstilla ${course.name}?`,
    message: "\xDEetta hreinsar tickets, called, sent og t\xEDmam\xE6li fyrir \xFEennan r\xE9tt.",
    onConfirm: reset,
    onCancel: () => setConfirmReset(false)
  }));
}
function ExpediterCounter() {
  const initial = () => ({
    batches: [],
    sentActions: [],
    callStartedAt: null,
    lastCallAt: null
  });
  const [states, setStates] = useState({
    starter: initial(),
    main: initial(),
    dessert: initial()
  });
  const [eventName, setEventName] = useState("ICELANDIC CULINARY TEAM");
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
  const openCustomInput = opts => setCustomInput({
    ...opts,
    key: `ci_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
  });
  const [resumePrompt, setResumePrompt] = useState(null);
  const [history, setHistory] = useState([]);
  const statesRef = useRef(states);
  statesRef.current = states;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const migrateStates = rawStates => {
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
            calledAt: s.lastCallAt || Date.now()
          });
        }
        if (tickets - called > 0) {
          batches.push({
            id: `mig_pending_${key}`,
            count: tickets - called,
            addedAt: Date.now(),
            calledAt: null
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
          at: s.lastCallAt || Date.now()
        }];
      } else {
        sentActions = [];
      }
      migrated[key] = {
        batches,
        sentActions,
        callStartedAt: s.callStartedAt || null,
        lastCallAt: s.lastCallAt || null
      };
    }
    return migrated;
  };
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" && window.localStorage ? window.localStorage.getItem("expediter:state") : null;
      if (!raw) {
        setLoaded(true);
        return;
      }
      const parsed = JSON.parse(raw);
      const states = parsed.states || {};
      const hasActivity = Object.values(states).some(s => {
        if (!s) return false;
        const hasBatches = Array.isArray(s.batches) && s.batches.length > 0;
        const hasSent = Array.isArray(s.sentActions) && s.sentActions.length > 0;
        const hasOldData = (s.tickets || 0) > 0 || (s.sent || 0) > 0;
        return hasBatches || hasSent || hasOldData;
      });
      if (!hasActivity) {
        if (parsed.eventName) setEventName(parsed.eventName);
        if (typeof parsed.total === "number") setTotal(parsed.total);
        if (typeof parsed.openCount === "boolean") setOpenCount(parsed.openCount);
        setLoaded(true);
        return;
      }
      const migrated = migrateStates(states);
      const summary = Object.keys(migrated).map(k => {
        const s = migrated[k];
        const sent = s.sentActions.reduce((a, x) => a + x.count, 0);
        const tickets = s.batches.reduce((a, b) => a + b.count, 0);
        return {
          key: k,
          sent,
          tickets
        };
      });
      setResumePrompt({
        parsed,
        migrated,
        savedAt: parsed.savedAt || null,
        summary
      });
    } catch (e) {
      setLoaded(true);
    }
  }, []);
  const acceptResume = () => {
    if (!resumePrompt) return;
    const {
      parsed,
      migrated
    } = resumePrompt;
    setStates(migrated);
    if (parsed.eventName) setEventName(parsed.eventName);
    if (typeof parsed.total === "number") setTotal(parsed.total);
    if (typeof parsed.openCount === "boolean") setOpenCount(parsed.openCount);
    setResumePrompt(null);
    setLoaded(true);
  };
  const declineResume = () => {
    if (!resumePrompt) return;
    const {
      parsed
    } = resumePrompt;
    if (parsed.eventName) setEventName(parsed.eventName);
    if (typeof parsed.total === "number") setTotal(parsed.total);
    if (typeof parsed.openCount === "boolean") setOpenCount(parsed.openCount);
    setResumePrompt(null);
    setLoaded(true);
  };
  useEffect(() => {
    if (!loaded) return;
    (async () => {
      try {
        if (typeof window !== "undefined" && window.localStorage) {
          window.localStorage.setItem("expediter:state", JSON.stringify({
            states,
            eventName,
            total,
            openCount,
            savedAt: Date.now()
          }));
        }
      } catch (e) {}
    })();
  }, [states, eventName, total, openCount, loaded]);
  const MAX_HISTORY = 100;
  const pushHistory = label => {
    const snapshot = {
      states: statesRef.current,
      label
    };
    setHistory(h => [...h.slice(-(MAX_HISTORY - 1)), snapshot]);
  };
  const updateCourse = (id, next, label) => {
    const course = COURSES.find(c => c.id === id);
    pushHistory(`${label || "Breyting"} · ${course ? course.name : id}`);
    setStates(prev => ({
      ...prev,
      [id]: next
    }));
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
      dessert: initial()
    });
    setConfirmResetAll(false);
  };
  const fullscreenSupported = typeof document !== "undefined" && !!(document.fullscreenEnabled || document.webkitFullscreenEnabled);
  const runningAsApp = typeof window !== "undefined" && (window.matchMedia && (window.matchMedia("(display-mode: standalone)").matches || window.matchMedia("(display-mode: fullscreen)").matches) || window.navigator.standalone === true);
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
    } catch (e) {}
  };
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
      const meta = document.querySelector('meta[name="theme-color"]:not([media])');
      if (meta) meta.setAttribute('content', theme === 'dark' ? '#161616' : '#ffffff');
    }
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        window.localStorage.setItem("expediter:theme", theme);
      } catch (e) {}
    }
  }, [theme]);
  const sumSent = s => (s.sentActions || []).reduce((a, x) => a + x.count, 0);
  const totalSent = sumSent(states.starter) + sumSent(states.main) + sumSent(states.dessert);
  const totalExpected = total * 3;
  return React.createElement("div", {
    className: "app"
  }, React.createElement("div", {
    className: "header"
  }, React.createElement("div", {
    className: "header-left"
  }, React.createElement("input", {
    className: "event-input",
    value: eventName,
    onChange: e => setEventName(e.target.value)
  }), React.createElement("div", {
    className: "header-sub"
  }, "Expediter \xB7 ", openCount ? "opin talning" : `${total} gestir`, " \xB7 3 r\xE9ttir")), React.createElement("div", {
    className: "header-right"
  }, React.createElement("div", {
    className: "grand-total"
  }, React.createElement("div", {
    className: "grand-total-num"
  }, totalSent, !openCount && React.createElement("span", {
    style: {
      color: "var(--border-strong)"
    }
  }, " / ", totalExpected)), React.createElement("div", {
    className: "grand-total-label"
  }, "Total Sent")), React.createElement("button", {
    className: "undo-btn",
    onClick: undo,
    disabled: !lastAction,
    title: lastAction ? `Afturkalla: ${lastAction.label}` : "Ekkert að afturkalla"
  }, React.createElement("span", {
    className: "undo-btn-title"
  }, "\u21B6 Afturkalla"), React.createElement("span", {
    className: "undo-btn-label"
  }, lastAction ? lastAction.label : "—")), fullscreenSupported && !runningAsApp && React.createElement("button", {
    className: "icon-btn icon-btn-static",
    onClick: toggleFullscreen,
    title: isFullscreen ? "Hætta í fullum skjá" : "Fullur skjár",
    "aria-label": isFullscreen ? "Hætta í fullum skjá" : "Fullur skjár"
  }, isFullscreen ? React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("path", {
    d: "M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3"
  })) : React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("path", {
    d: "M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"
  }))), React.createElement("button", {
    className: "icon-btn",
    onClick: () => setTheme(theme === "dark" ? "light" : "dark"),
    title: theme === "dark" ? "Skipta í ljóst þema" : "Skipta í dökkt þema",
    "aria-label": "Skipta \xFEema"
  }, theme === "dark" ? React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "4"
  }), React.createElement("path", {
    d: "M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
  })) : React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("path", {
    d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
  }))), React.createElement("button", {
    className: "icon-btn",
    onClick: () => setSettingsOpen(true),
    title: "Stillingar"
  }, React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "3"
  }), React.createElement("path", {
    d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
  }))), React.createElement("button", {
    className: "reset-all",
    onClick: () => setConfirmResetAll(true)
  }, "Reset Allt"))), React.createElement("div", {
    className: "grid"
  }, COURSES.map(c => React.createElement(CourseCard, {
    key: c.id,
    course: c,
    state: states[c.id],
    onChange: (next, label) => updateCourse(c.id, next, label),
    total: total,
    openCount: openCount,
    onCustomInput: openCustomInput
  }))), React.createElement(ResumeDialog, {
    open: resumePrompt != null,
    eventName: resumePrompt?.parsed?.eventName || eventName,
    savedAt: resumePrompt?.savedAt,
    summary: resumePrompt?.summary || [],
    courses: COURSES,
    onResume: acceptResume,
    onDiscard: declineResume
  }), React.createElement(NumberInputDialog, {
    key: customInput?.key,
    open: customInput != null,
    title: customInput?.title || "",
    placeholder: customInput?.placeholder || "",
    max: customInput?.max,
    quickPicks: customInput?.quickPicks,
    initialValue: customInput?.initialValue,
    allowEmpty: customInput?.allowEmpty,
    onSubmit: n => {
      setCustomInput(null);
      customInput?.onSubmit(n);
    },
    onClear: customInput?.onClear ? () => {
      setCustomInput(null);
      customInput.onClear();
    } : null,
    onCancel: () => setCustomInput(null)
  }), React.createElement(SettingsDialog, {
    open: settingsOpen,
    currentTotal: total,
    currentOpenCount: openCount,
    onSave: (newTotal, newOpen) => {
      setTotal(newTotal);
      setOpenCount(newOpen);
      setSettingsOpen(false);
    },
    onCancel: () => setSettingsOpen(false)
  }), React.createElement(ConfirmDialog, {
    open: confirmResetAll,
    title: "N\xFAllstilla ALLA r\xE9tti?",
    message: "\xDEetta hreinsar allar talningar og t\xEDmam\xE6la fyrir alla \xFErj\xE1 r\xE9tti. H\xE6gt er a\xF0 afturkalla me\xF0 \u21B6 Afturkalla takkanum.",
    onConfirm: resetAll,
    onCancel: () => setConfirmResetAll(false)
  }));
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(ExpediterCounter));
