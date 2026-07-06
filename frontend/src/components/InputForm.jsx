import { memo, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Clipboard, Eraser, FileUp, Sparkles, Upload, Zap } from "lucide-react";
import "../styles/InputForm.css";

function InputForm({ value, onChange, onAnalyze, loading }) {
  const [isDragging, setIsDragging] = useState(false);
  const [pasteStatus, setPasteStatus] = useState("");
  const textareaRef = useRef(null);
  const emailInputRef = useRef(null);
  const screenshotInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onAnalyze(value);
    }
  };

  const handleClear = () => {
    onChange("");
    textareaRef.current?.focus();
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onChange(text);
        setPasteStatus("Pasted from clipboard");
        textareaRef.current?.focus();
      }
    } catch {
      setPasteStatus("Clipboard access blocked by the browser");
    }
  };

  const readFileAsText = (file) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.readAsText(file);
    });

  const handleImport = async (event, source) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (source === "email") {
      const content = await readFileAsText(file);
      onChange(content.slice(0, 2000));
      setPasteStatus(`Imported ${file.name}`);
    } else {
      onChange(
        `Screenshot uploaded: ${file.name}\n\nUpload the message text from the screenshot or keep this placeholder as a reference.`,
      );
      setPasteStatus(`Uploaded ${file.name}`);
    }

    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const droppedText = event.dataTransfer.getData("text/plain");
    if (droppedText) {
      onChange(droppedText);
    } else if (event.dataTransfer.files?.[0]) {
      const file = event.dataTransfer.files[0];
      if (file.type.startsWith("text/") || file.name.endsWith(".eml")) {
        readFileAsText(file).then((content) =>
          onChange(content.slice(0, 2000)),
        );
      }
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (!pasteStatus) return undefined;
    const timer = window.setTimeout(() => setPasteStatus(""), 2200);
    return () => window.clearTimeout(timer);
  }, [pasteStatus]);

  const samplePhishing = [
    "Dear Customer, Verify your SBI account: bit.ly/sbi-verify-urgent. Click now or lose access!",
    "🎁 Congratulations! You won ₹50,000 Amazon Gift Card. Claim: amaz0n-claim.com",
    "Your Paytm wallet has been locked. Update payment method: paytm-verify.net/update",
  ];

  const applySample = (sample) => {
    onChange(sample);
    textareaRef.current?.focus();
  };

  return (
    <motion.div
      className={`input-form glass-card ${isDragging ? "dragging" : ""}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className="panel-heading">
        <div>
          <p className="panel-kicker">Analyze message</p>
          <h3>Paste, drop, or upload a suspicious message</h3>
        </div>
        <div className="counter-chip" aria-live="polite">
          {value.length}/2000
        </div>
      </div>

      <form onSubmit={handleSubmit} className="input-form-shell">
        <div className="textarea-shell">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value.slice(0, 2000))}
            placeholder="Paste your message here..."
            rows={9}
            disabled={loading}
            aria-label="Message to analyze"
          />
          <div className="drop-hint">
            <Upload size={14} /> Drop text, email files, or screenshots here
          </div>
        </div>

        <div className="action-row">
          <motion.button
            type="button"
            className="secondary-button"
            onClick={handlePaste}
            disabled={loading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Clipboard size={15} /> Paste
          </motion.button>
          <motion.button
            type="button"
            className="secondary-button"
            onClick={handleClear}
            disabled={loading || !value}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Eraser size={15} /> Clear
          </motion.button>
          <motion.button
            type="button"
            className="secondary-button"
            onClick={() => emailInputRef.current?.click()}
            disabled={loading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <FileUp size={15} /> Upload Email
          </motion.button>
          <motion.button
            type="button"
            className="secondary-button"
            onClick={() => screenshotInputRef.current?.click()}
            disabled={loading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <FileUp size={15} /> Upload Screenshot
          </motion.button>
          <motion.button
            type="submit"
            className="primary-button"
            disabled={loading || !value.trim()}
            whileHover={{ scale: loading ? 1 : 1.03 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            <Zap size={16} />
            {loading ? "Scanning..." : "Analyze Now"}
          </motion.button>
        </div>
      </form>

      <input
        ref={emailInputRef}
        type="file"
        accept=".txt,.eml,.msg,text/plain,message/rfc822"
        hidden
        onChange={(event) => handleImport(event, "email")}
      />
      <input
        ref={screenshotInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => handleImport(event, "screenshot")}
      />

      <div className="helper-row">
        <span className={`helper-chip ${isDragging ? "highlight" : ""}`}>
          <Sparkles size={14} /> Drag and drop supported
        </span>
        {pasteStatus ? (
          <span className="helper-chip subtle">{pasteStatus}</span>
        ) : null}
      </div>

      <div className="samples">
        <p className="samples-label">Quick test samples</p>
        <div className="sample-grid">
          {samplePhishing.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              className="sample-btn"
              onClick={() => applySample(sample)}
              disabled={loading}
            >
              Sample {idx + 1}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default memo(InputForm);
