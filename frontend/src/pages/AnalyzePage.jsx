import { memo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Upload, FileText } from "lucide-react";
import InputForm from "../components/InputForm";
import AnalysisPanel from "../components/AnalysisPanel";

function AnalyzePage({
  draftMessage,
  setDraftMessage,
  onAnalyze,
  loading,
  analysis,
  message,
  onOpenDashboard,
}) {
  return (
    <section className="view-shell analyze-view">
      <div className="page-topbar">
        <div>
          <p className="page-kicker">Analyze</p>
          <h2>Single-task threat review</h2>
          <p className="page-subtitle">
            Paste, drop, or upload a message. The scan sequence and result
            reveal stay focused here.
          </p>
        </div>
        <motion.button
          type="button"
          className="secondary-button"
          onClick={onOpenDashboard}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          Back to dashboard <ArrowRight size={15} />
        </motion.button>
      </div>

      <div className="analyze-layout">
        <InputForm
          value={draftMessage}
          onChange={setDraftMessage}
          onAnalyze={onAnalyze}
          loading={loading}
          message={message}
        />

        <AnalysisPanel
          analysis={analysis}
          loading={loading}
          message={message}
        />
      </div>

      <div className="analyze-quick-actions">
        <button
          type="button"
          className="quick-action-button"
          onClick={() =>
            setDraftMessage(
              "Dear Customer, verify your SBI account now: bit.ly/sbi-login-urgent",
            )
          }
        >
          <FileText size={15} /> Load bank alert
        </button>
        <button
          type="button"
          className="quick-action-button"
          onClick={() =>
            setDraftMessage(
              "Invoice attached. Please review the details and reply with your password if needed.",
            )
          }
        >
          <Upload size={15} /> Load email sample
        </button>
      </div>
    </section>
  );
}

export default memo(AnalyzePage);
