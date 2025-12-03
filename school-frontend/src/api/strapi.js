// src/api/strapi.js
import axios from "axios";

const STRAPI_BASE = (process.env.REACT_APP_STRAPI_URL || "http://localhost:1337").replace(/\/$/, "");

const api = axios.create({ baseURL: STRAPI_BASE, headers: { "Content-Type": "application/json" } });

// helper: normalize Strapi response so we always get an array of items with id + attributes-like object
const normalizeItems = (resData) => {
  // case A: v4 nested: res.data.data -> [{ id, attributes: { ... } }, ...]
  if (Array.isArray(resData?.data)) {
    return resData.data.map((item) => {
      // if already nested attributes, flatten for easier use
      if (item.attributes) return { id: item.id, ...item.attributes };
      return item;
    });
  }
  // case B: some setups return res.data as object with data array already flattened
  if (Array.isArray(resData)) {
    return resData.map((item) => (item.attributes ? { id: item.id, ...item.attributes } : item));
  }
  // case C: resData itself might be the single item; wrap it
  if (resData && typeof resData === "object" && !Array.isArray(resData)) {
    // try detect array inside top-level 'data'
    if (Array.isArray(resData.data)) {
      return resData.data.map((item) => (item.attributes ? { id: item.id, ...item.attributes } : item));
    }
  }
  return [];
};

// fetch categories (safe: uses title sort and populate all)
export const fetchCategories = async () => {
  try {
    const res = await api.get("/api/categories?sort=title:asc&populate=*");
    return normalizeItems(res.data);
  } catch (err) {
    console.error("fetchCategories error:", err?.response?.data ?? err.message ?? err);
    throw err;
  }
};

// fetch events. NOTE: do not attempt filters here unless Event actually has a category relation.
// The EventsPage will decide whether filtering is supported.
export const fetchEvents = async (categoryId = null, useFilter = false) => {
  try {
    let url = "/api/events?populate=*";
    if (useFilter && categoryId !== null && categoryId !== undefined) {
      // assume relation field is 'category' — the EventsPage will only pass useFilter=true when safe
      url = `/api/events?filters[category][id][$eq]=${encodeURIComponent(categoryId)}&populate=*`;
    }
    const res = await api.get(url);
    return normalizeItems(res.data);
  } catch (err) {
    console.error("fetchEvents error:", err?.response?.data ?? err.message ?? err);
    throw err;
  }
};

// safe helper to build full media URL
export const getStrapiMedia = (media) => {
  if (!media) return null;
  const url = media?.url ?? media?.data?.attributes?.url ?? media?.attributes?.url ?? null;
  if (!url) return null;
  return /^https?:\/\//i.test(url) ? url : `${STRAPI_BASE}${url}`;
};
