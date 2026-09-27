const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");
const TOKEN_KEY = "jobcenter_token";
const REQUEST_TIMEOUT_MS = 15000;

export function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  constructor(message, { status, errors } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors || {};
  }
}

async function send(path, { method = "GET", body, auth = false } = {}) {
  const isForm = typeof FormData !== "undefined" && body instanceof FormData;
  const headers = { Accept: "application/json" };
  if (body !== undefined && !isForm) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
      signal: controller.signal,
    });
  } catch {
    throw new ApiError("Unable to reach the server. Please try again.", { status: 0 });
  } finally {
    clearTimeout(timeout);
  }

  return response;
}

async function toApiError(response) {
  const data = await response.json().catch(() => ({}));

  return new ApiError(data.message || "Request failed.", {
    status: response.status,
    errors: data.errors,
  });
}

async function request(path, options = {}) {
  const response = await send(path, options);

  if (!response.ok) throw await toApiError(response);

  return response.json();
}

async function requestBlob(path, options = {}) {
  const response = await send(path, options);

  if (!response.ok) throw await toApiError(response);

  return response.blob();
}

function jobQuery(params) {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, value);
    }
  });

  const query = search.toString();

  return query ? `?${query}` : "";
}

export const api = {
  register: (payload) => request("/api/register", { method: "POST", body: payload }),
  login: (payload) => request("/api/login", { method: "POST", body: payload }),
  profile: () => request("/api/profile", { auth: true }),
  uploadCv: (file) => {
    const body = new FormData();
    body.append("file", file);

    return request("/api/profile/cv", { method: "POST", body, auth: true });
  },
  downloadCv: () => requestBlob("/api/profile/cv", { auth: true }),
  deleteCv: () => request("/api/profile/cv", { method: "DELETE", auth: true }),
  logout: () => request("/api/logout", { method: "POST", auth: true }),
  jobs: (params = {}) => request(`/api/jobs${jobQuery(params)}`, { auth: true }),
  job: (id) => request(`/api/jobs/${encodeURIComponent(id)}`, { auth: true }),
  createJob: (payload) => request("/api/jobs", { method: "POST", body: payload, auth: true }),
  updateJob: (id, payload) =>
    request(`/api/jobs/${encodeURIComponent(id)}`, { method: "PUT", body: payload, auth: true }),
  deleteJob: (id) =>
    request(`/api/jobs/${encodeURIComponent(id)}`, { method: "DELETE", auth: true }),
  likeJob: (id) =>
    request(`/api/jobs/${encodeURIComponent(id)}/like`, { method: "POST", auth: true }),
  unlikeJob: (id) =>
    request(`/api/jobs/${encodeURIComponent(id)}/like`, { method: "DELETE", auth: true }),
  likedJobs: (params = {}) => request(`/api/likes${jobQuery(params)}`, { auth: true }),
  managedJobs: (params = {}) => request(`/api/settings/jobs${jobQuery(params)}`, { auth: true }),
  adminUsers: (params = {}) => request(`/api/settings/users${jobQuery(params)}`, { auth: true }),
  deleteUser: (id) =>
    request(`/api/settings/users/${encodeURIComponent(id)}`, { method: "DELETE", auth: true }),
  comments: (jobId, params = {}) =>
    request(`/api/jobs/${encodeURIComponent(jobId)}/comments${jobQuery(params)}`, { auth: true }),
  addComment: (jobId, payload) =>
    request(`/api/jobs/${encodeURIComponent(jobId)}/comments`, {
      method: "POST",
      body: payload,
      auth: true,
    }),
  updateComment: (id, payload) =>
    request(`/api/comments/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: payload,
      auth: true,
    }),
  deleteComment: (id) =>
    request(`/api/comments/${encodeURIComponent(id)}`, { method: "DELETE", auth: true }),
};
