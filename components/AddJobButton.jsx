"use client";

import Link from "next/link";
import { PlusIcon } from "@/components/icons";
import { canPostJobs } from "@/lib/permissions";

export default function AddJobButton({ user }) {
  if (!canPostJobs(user)) return null;

  return (
    <Link href="/AddJob" className="add-job-button">
      <PlusIcon />
      Add Job
    </Link>
  );
}
