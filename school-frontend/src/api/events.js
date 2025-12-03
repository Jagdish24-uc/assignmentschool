// arrow functions + axios
import axios from "axios";

const STRAPI_BASE = process.env.REACT_APP_STRAPI_URL || "http://localhost:1337";

export const fetchEvents = async () => {
  const url = `${STRAPI_BASE}/api/events?sort=date:asc&populate=image`;
  const res = await axios.get(url);
  // strapi v4 wraps content in data
  return res.data?.data || [];
};

export const fetchEventById = async (id) => {
  const url = `${STRAPI_BASE}/api/events/${id}?populate=image`;
  const res = await axios.get(url);
  return res.data?.data || null;
};
