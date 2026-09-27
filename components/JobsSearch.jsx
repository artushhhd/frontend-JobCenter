"use client";

import { useState } from "react";
import { MapPinIcon, SearchIcon } from "@/components/icons";

export default function JobsSearch({ onSearch }) {
  const [fields, setFields] = useState({ q: "", location: "" });

  const handleChange = (field) => (event) =>
    setFields((previous) => ({ ...previous, [field]: event.target.value }));

  function handleSubmit(event) {
    event.preventDefault();
    onSearch(fields);
  }

  return (
    <form className="jobs-search" onSubmit={handleSubmit}>
      <label className="jobs-search-field">
        <SearchIcon />
        <span className="sr-only">Job title or company</span>
        <input
          type="search"
          value={fields.q}
          onChange={handleChange("q")}
          placeholder="Product designer"
          className="jobs-search-input"
        />
      </label>

      <label className="jobs-search-field">
        <MapPinIcon className="jobs-search-icon" />
        <span className="sr-only">City or remote</span>
        <input
          type="search"
          value={fields.location}
          onChange={handleChange("location")}
          placeholder="New York or remote"
          className="jobs-search-input"
        />
      </label>

      <button type="submit" className="jobs-submit">
        <SearchIcon className="jobs-submit-icon" />
        Search jobs
      </button>
    </form>
  );
}
