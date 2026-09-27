"use client";

import { useRef, useState } from "react";
import { postedLabel } from "@/lib/jobs";
import { api } from "@/lib/api";
import { CV_ACCEPT, CV_MAX_MB, hasErrors, validateCv } from "@/lib/validation";

function fileSize(bytes) {
  if (!bytes) return "0 KB";

  return bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export default function ProfileResume({ cv, onChanged }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  const disabled = busy !== "";

  function pickFile(event) {
    const [picked] = event.target.files;

    setFile(picked ?? null);
    setError("");
  }

  async function handleUpload(event) {
    event.preventDefault();

    const validation = validateCv(file);

    if (hasErrors(validation)) {
      setError(validation.file[0]);
      return;
    }

    setError("");
    setBusy("upload");

    try {
      await api.uploadCv(file);
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      onChanged();
    } catch (err) {
      setError(err.errors?.file?.[0] || err.message || "Unable to upload this resume.");
    } finally {
      setBusy("");
    }
  }

  async function handleDownload() {
    setError("");
    setBusy("download");

    try {
      const blob = await api.downloadCv();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = cv?.original_name || "resume";
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || "Unable to download this resume.");
    } finally {
      setBusy("");
    }
  }

  async function handleRemove() {
    setError("");
    setBusy("remove");

    try {
      await api.deleteCv();
      onChanged();
    } catch (err) {
      setError(err.message || "Unable to remove this resume.");
    } finally {
      setBusy("");
    }
  }

  return (
    <section className="profile-resume">
      <p className="profile-row-label">Resume</p>

      {cv ? (
        <div className="profile-resume-file">
          <p className="profile-resume-name">{cv.original_name}</p>
          <p className="profile-resume-meta">
            {fileSize(cv.size)} · {postedLabel(cv.uploaded_at)}
          </p>
        </div>
      ) : (
        <p className="profile-resume-empty">
          No resume yet. Attach a PDF, DOC or DOCX up to {CV_MAX_MB} MB.
        </p>
      )}

      {error && (
        <div className="auth-alert mt-3" role="alert">
          {error}
        </div>
      )}

      <form className="profile-resume-form" onSubmit={handleUpload}>
        <label className="profile-resume-field">
          <span className="sr-only">Choose a resume file</span>
          <input
            ref={inputRef}
            type="file"
            accept={CV_ACCEPT}
            onChange={pickFile}
            disabled={disabled}
            className="profile-resume-input"
          />
        </label>

        <div className="profile-resume-actions">
          <button type="submit" className="jf-primary" disabled={disabled || !file}>
            {busy === "upload" ? "Uploading…" : "Upload resume"}
          </button>
          {cv && (
            <button type="button" className="jf-secondary" disabled={disabled} onClick={handleDownload}>
              {busy === "download" ? "Preparing…" : "Download"}
            </button>
          )}
          {cv && (
            <button type="button" className="jf-secondary" disabled={disabled} onClick={handleRemove}>
              {busy === "remove" ? "Removing…" : "Remove"}
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
