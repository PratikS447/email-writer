import { useState } from "react";

const tones = ["Professional", "Friendly", "Confident", "Concise"];

function SparkIcon({ small = false }) {
  return (
    <svg
      aria-hidden="true"
      className={small ? "spark-icon spark-icon--small" : "spark-icon"}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M12 2.75 14.35 9.65 21.25 12l-6.9 2.35L12 21.25l-2.35-6.9L2.75 12l6.9-2.35L12 2.75Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.65"
      />
    </svg>
  );
}

function App() {
  const [emailContent, setEmailContent] = useState("");
  const [tone, setTone] = useState("Professional");
  const [reply, setReply] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const message = emailContent.trim();
    if (!message || isLoading) return;

    setError("");
    setReply("");
    setCopied(false);
    setIsLoading(true);

    try {
      const response = await fetch("/api/email/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailContent: message, tone: tone.toLowerCase() }),
      });

      if (!response.ok) {
        throw new Error("The email service returned an error.");
      }

      const generatedReply = (await response.text()).trim();
      if (!generatedReply) {
        throw new Error("The email service returned an empty reply.");
      }

      setReply(generatedReply);
    } catch {
      setError(
        "We couldn't generate a reply. Check that the backend is running and its Gemini API settings are configured, then try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function copyReply() {
    if (!reply) return;
    try {
      await navigator.clipboard.writeText(reply);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Copying isn't available in this browser. Select the reply and copy it instead.");
    }
  }

  function clearForm() {
    setEmailContent("");
    setReply("");
    setError("");
    setCopied(false);
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Email Writer home">
          <span className="brand-mark">
            <SparkIcon small />
          </span>
          <span>Email Writer</span>
        </a>
        <span className="topbar-note">
          <span className="status-dot" />
          Your thoughtful reply starts here
        </span>
      </header>

      <main className="main-content">
        <section className="intro" aria-labelledby="page-title">
          <div className="eyebrow">
            <SparkIcon small />
            <span>YOUR AI WRITING ASSISTANT</span>
          </div>
          <h1 id="page-title">
            Find the right words.
            <br />
            <span>Without the overthinking.</span>
          </h1>
          <p className="intro-copy">
            Paste the email you received, choose a tone, and get a reply you
            can make your own.
          </p>
        </section>

        <section className="workspace" aria-label="Email reply workspace">
          <form className="compose-panel" onSubmit={handleSubmit}>
            <div className="panel-heading">
              <div>
                <span className="step-label">01 — THE CONTEXT</span>
                <h2>The email you received</h2>
              </div>
              {emailContent && (
                <button className="text-button" type="button" onClick={clearForm}>
                  Clear
                </button>
              )}
            </div>

            <label className="sr-only" htmlFor="email-content">
              Email content
            </label>
            <textarea
              id="email-content"
              value={emailContent}
              onChange={(event) => setEmailContent(event.target.value)}
              placeholder="Paste the email you'd like to reply to..."
              maxLength={6000}
              required
            />
            <div className="input-meta">
              <span>Keep names and details as you received them.</span>
              <span>{emailContent.length.toLocaleString()} / 6,000</span>
            </div>

            <div className="tone-block">
              <span className="field-label">Choose a tone</span>
              <div className="tone-options" role="group" aria-label="Reply tone">
                {tones.map((option) => (
                  <button
                    key={option}
                    className={`tone-chip${tone === option ? " tone-chip--active" : ""}`}
                    type="button"
                    aria-pressed={tone === option}
                    onClick={() => setTone(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-actions">
              <span className="privacy-note">
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M4.5 7V5.2a3.5 3.5 0 0 1 7 0V7m-8 .1h9v6.4h-9V7.1Z"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.25"
                  />
                </svg>
                Sent to Gemini · not stored by this app
              </span>
              <button
                className="generate-button"
                type="submit"
                disabled={!emailContent.trim() || isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="button-spinner" />
                    Writing…
                  </>
                ) : (
                  <>
                    <SparkIcon small />
                    Generate reply
                    <span className="button-arrow" aria-hidden="true">↗</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <section className="reply-panel" aria-live="polite" aria-labelledby="reply-title">
            <div className="panel-heading reply-heading">
              <div>
                <span className="step-label">02 — MAKE IT YOURS</span>
                <h2 id="reply-title">Your reply</h2>
              </div>
              {reply && (
                <button className="copy-button" type="button" onClick={copyReply}>
                  {copied ? (
                    <>
                      <span className="checkmark">✓</span>
                      Copied
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <rect x="5.3" y="5.3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
                        <path d="M10.7 5.2V3.8A1.5 1.5 0 0 0 9.2 2.3H3.8a1.5 1.5 0 0 0-1.5 1.5v5.4a1.5 1.5 0 0 0 1.5 1.5h1.5" stroke="currentColor" strokeWidth="1.3" />
                      </svg>
                      Copy reply
                    </>
                  )}
                </button>
              )}
            </div>

            <div className={`reply-content${reply ? " reply-content--filled" : ""}${isLoading ? " reply-content--loading" : ""}`}>
              {error ? (
                <div className="error-state" role="alert">
                  <span className="error-mark">!</span>
                  <p>{error}</p>
                </div>
              ) : isLoading ? (
                <div className="loading-state">
                  <span className="loading-orbit">
                    <SparkIcon />
                  </span>
                  <p>Finding the right words<span className="loading-dots">...</span></p>
                  <span className="loading-caption">Usually just a few seconds</span>
                </div>
              ) : reply ? (
                <p className="generated-reply">{reply}</p>
              ) : (
                <div className="empty-state">
                  <span className="empty-mark">
                    <SparkIcon />
                  </span>
                  <p>Your reply will appear here</p>
                  <span>Give us the context and we’ll help you find the words.</span>
                </div>
              )}
            </div>

            {reply && (
              <div className="reply-footer">
                <span>One good starting point. Personalize it before you send.</span>
                <span className="reply-ready"><span /> READY TO EDIT</span>
              </div>
            )}
          </section>
        </section>

        <footer className="page-footer">
          <span>Built for the messages that deserve a little more thought.</span>
          <span className="footer-spark">✳</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
