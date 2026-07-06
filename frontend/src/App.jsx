import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import BackgroundEffects from "./components/BackgroundEffects";
import Sidebar from "./components/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import AnalyzePage from "./pages/AnalyzePage";
import HistoryPage from "./pages/HistoryPage";
import StatisticsPage from "./pages/StatisticsPage";
import ThreatIntelPage from "./pages/ThreatIntelPage";
import SettingsPage from "./pages/SettingsPage";
import {
  buildCategoryCounts,
  buildTrendPoints,
  formatCompactNumber,
  formatTimestamp,
  summarizeHistory,
} from "./lib/analysisUtils";
import "./App.css";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001"
).replace(/\/$/, "");

const navigationOrder = [
  "Dashboard",
  "Analyze",
  "History",
  "Statistics",
  "Threat Intelligence",
  "Settings",
];

const defaultSettings = {
  liveProtection: true,
  soundAlerts: true,
  autoFocus: true,
  compactMode: false,
  telemetry: false,
  sensitivity: "balanced",
};

function App() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [draftMessage, setDraftMessage] = useState("");
  const [selectedHistoryId, setSelectedHistoryId] = useState(null);
  const [historyQuery, setHistoryQuery] = useState("");
  const [historyFilter, setHistoryFilter] = useState("all");
  const [theme, setTheme] = useState("aurora");
  const [activeView, setActiveView] = useState("Dashboard");
  const [pageDirection, setPageDirection] = useState(1);
  const [settings, setSettings] = useState(defaultSettings);
  const [statsRange, setStatsRange] = useState("week");
  const [intelFilter, setIntelFilter] = useState("all");
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const root = document.documentElement;

    const handlePointerMove = (event) => {
      if (shouldReduceMotion) return;
      root.style.setProperty("--pointer-x", `${event.clientX}px`);
      root.style.setProperty("--pointer-y", `${event.clientY}px`);
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [shouldReduceMotion]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const navigateTo = (nextView) => {
    const nextDirection =
      navigationOrder.indexOf(nextView) >= navigationOrder.indexOf(activeView)
        ? 1
        : -1;

    setPageDirection(nextDirection);
    setActiveView(nextView);
  };

  const handleAnalyze = async (message) => {
    setDraftMessage(message);
    navigateTo("Analyze");
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
      setAnalysis(data);

      const record = {
        id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
        message,
        result: data,
        timestamp: new Date(),
      };

      setHistory((currentHistory) => [record, ...currentHistory.slice(0, 19)]);
      setSelectedHistoryId(record.id);
      setActiveView("Analyze");
    } catch (error) {
      console.error("Analysis failed:", error);
      setAnalysis({
        success: false,
        error:
          "Failed to analyze message. Make sure backend is running on port 3001.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHistoryItem = (item) => {
    setSelectedHistoryId(item.id);
    setDraftMessage(item.message);
    setAnalysis(item.result);
  };

  const handleDeleteHistoryItem = (item) => {
    setHistory((currentHistory) =>
      currentHistory.filter((entry) => entry.id !== item.id),
    );
    setSelectedHistoryId((currentSelected) =>
      currentSelected === item.id ? null : currentSelected,
    );
  };

  const handleClearHistory = () => {
    setHistory([]);
    setSelectedHistoryId(null);
  };

  const handleHistorySearch = (value) => setHistoryQuery(value);

  const handleHistoryFilter = (value) => setHistoryFilter(value);

  const handleSettingsChange = (key, value) => {
    setSettings((current) => ({ ...current, [key]: value }));
    if (key === "compactMode") {
      document.documentElement.classList.toggle("compact-mode", Boolean(value));
    }
  };

  const handleExportCsv = (items) => {
    const rows = [
      ["Timestamp", "Message", "Risk Score", "Status", "Recommendation"],
      ...items.map((item) => [
        item.timestamp.toISOString(),
        item.message.replaceAll('"', '""'),
        item.result?.risk_score ?? 0,
        item.result?.risk_score >= 80
          ? "Critical"
          : item.result?.risk_score >= 60
            ? "High"
            : item.result?.risk_score >= 40
              ? "Medium"
              : "Safe",
        (item.result?.recommendation ?? "").replaceAll('"', '""'),
      ]),
    ];

    const csv = rows
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `clearhook-history-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPdf = (items) => {
    const reportWindow = window.open("", "_blank", "width=960,height=1280");
    if (!reportWindow) return;

    const rows = items
      .map(
        (item) => `
          <tr>
            <td>${formatTimestamp(item.timestamp)}</td>
            <td>${item.message.replaceAll("<", "&lt;").replaceAll(">", "&gt;")}</td>
            <td>${item.result?.risk_score ?? 0}%</td>
            <td>${item.result?.risk_score >= 80 ? "Critical" : item.result?.risk_score >= 60 ? "High" : item.result?.risk_score >= 40 ? "Medium" : "Safe"}</td>
          </tr>`,
      )
      .join("");

    reportWindow.document.write(`
      <html>
        <head>
          <title>ClearHook Security Report</title>
          <style>
            body { font-family: Inter, Arial, sans-serif; padding: 32px; color: #0f172a; }
            h1 { margin: 0 0 12px; }
            table { width: 100%; border-collapse: collapse; margin-top: 18px; }
            th, td { text-align: left; padding: 12px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
            th { background: #f8fafc; }
          </style>
        </head>
        <body>
          <h1>ClearHook History Report</h1>
          <p>Generated ${new Date().toLocaleString()}</p>
          <table>
            <thead><tr><th>Time</th><th>Message</th><th>Risk</th><th>Status</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </body>
      </html>
    `);
    reportWindow.document.close();
    reportWindow.focus();
    reportWindow.print();
  };

  const summary = useMemo(() => summarizeHistory(history), [history]);
  const filteredHistory = useMemo(() => {
    const query = historyQuery.trim().toLowerCase();

    return history.filter((item) => {
      const score = Number(item.result?.risk_score ?? 0);
      const riskLabel =
        score >= 80
          ? "critical"
          : score >= 60
            ? "high"
            : score >= 40
              ? "medium"
              : score > 0
                ? "low"
                : "safe";
      const matchesFilter =
        historyFilter === "all" || historyFilter === riskLabel;
      const matchesQuery =
        !query ||
        item.message.toLowerCase().includes(query) ||
        String(item.result?.risk_score ?? "").includes(query);

      return matchesFilter && matchesQuery;
    });
  }, [history, historyFilter, historyQuery]);

  const selectedHistoryItem =
    history.find((item) => item.id === selectedHistoryId) ?? history[0] ?? null;

  const trendPoints = useMemo(() => buildTrendPoints(history), [history]);
  const categoryCounts = useMemo(() => buildCategoryCounts(history), [history]);
  const securityStatus = useMemo(
    () => ({
      api: loading ? "Scanning" : "Healthy",
      firewall: "Protected",
      csp: "Enabled",
      cors: "Restricted",
    }),
    [loading],
  );

  return (
    <div className="app-container app-shell">
      <BackgroundEffects />

      <Sidebar
        activeItem={activeView}
        onNavigate={navigateTo}
        theme={theme}
        onToggleTheme={() =>
          setTheme((current) => (current === "aurora" ? "onyx" : "aurora"))
        }
      />

      <main className="dashboard-main">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeView}
            className="view-stage"
            initial={
              shouldReduceMotion
                ? false
                : { opacity: 0, x: pageDirection * 24, scale: 0.985 }
            }
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={
              shouldReduceMotion
                ? false
                : { opacity: 0, x: pageDirection * -18, scale: 0.985 }
            }
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {activeView === "Dashboard" ? (
              <DashboardPage
                summary={summary}
                recentActivity={history.slice(0, 5)}
                analysis={analysis}
                loading={loading}
                securityStatus={securityStatus}
                onQuickAnalyze={() => navigateTo("Analyze")}
                onOpenAnalyze={() => navigateTo("Analyze")}
              />
            ) : null}

            {activeView === "Analyze" ? (
              <AnalyzePage
                draftMessage={draftMessage}
                setDraftMessage={setDraftMessage}
                onAnalyze={handleAnalyze}
                loading={loading}
                analysis={analysis}
                message={draftMessage}
                onOpenDashboard={() => navigateTo("Dashboard")}
              />
            ) : null}

            {activeView === "History" ? (
              <HistoryPage
                history={history}
                selectedHistoryItem={selectedHistoryItem}
                historyQuery={historyQuery}
                historyFilter={historyFilter}
                onHistoryQueryChange={handleHistorySearch}
                onHistoryFilterChange={handleHistoryFilter}
                onSelectHistoryItem={handleSelectHistoryItem}
                onDeleteHistoryItem={handleDeleteHistoryItem}
                onClearHistory={handleClearHistory}
                onExportCsv={handleExportCsv}
                onExportPdf={handleExportPdf}
                onLoadIntoAnalyzer={(item) => {
                  setDraftMessage(item.message);
                  navigateTo("Analyze");
                }}
              />
            ) : null}

            {activeView === "Statistics" ? (
              <StatisticsPage
                history={history}
                summary={summary}
                trendPoints={trendPoints}
                categoryCounts={categoryCounts}
                statsRange={statsRange}
                onRangeChange={setStatsRange}
              />
            ) : null}

            {activeView === "Threat Intelligence" ? (
              <ThreatIntelPage
                history={history}
                analysis={analysis}
                intelFilter={intelFilter}
                onIntelFilterChange={setIntelFilter}
              />
            ) : null}

            {activeView === "Settings" ? (
              <SettingsPage
                settings={settings}
                theme={theme}
                onToggleTheme={() =>
                  setTheme((current) =>
                    current === "aurora" ? "onyx" : "aurora",
                  )
                }
                onSettingsChange={handleSettingsChange}
                onResetHistory={handleClearHistory}
              />
            ) : null}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
