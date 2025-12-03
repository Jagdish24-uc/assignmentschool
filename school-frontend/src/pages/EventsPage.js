// src/pages/EventsPage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { fetchCategories, fetchEvents, getStrapiMedia } from "../api/strapi";
import CategoryChips from "../components/CategoryChips";
import EventCard from "../components/EventCard/EventCard";

const Hero = ({ bgImageUrl }) => (
  <header className="relative">
    <div
      className="w-full h-64 md:h-80 lg:h-96 bg-cover bg-center flex items-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('${bgImageUrl || ""}')`,
      }}
    >
      <div className="container mx-auto px-6 text-center text-white">
        <h1 className="text-3xl md:text-5xl font-serif font-bold leading-tight">Our events gallery</h1>
        <p className="mt-3 max-w-2xl mx-auto text-sm md:text-lg">
          Events at DBTR are filled with joyous occasions, cultural gatherings, and learning opportunities that bring us all together.
        </p>
      </div>
    </div>
  </header>
);

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [filterSupported, setFilterSupported] = useState(false);
  const [heroImage, setHeroImage] = useState(null);

  const loadEvents = useCallback(async (categoryId = null, useFilter = false) => {
    setLoading(true);
    setError(null);
    try {
      const evts = await fetchEvents(categoryId, useFilter);
      setEvents(evts || []);
      // pick first image as hero if available
      if (!heroImage && evts?.length) {
        const url = getStrapiMedia(evts[0].image ?? evts[0].image?.data?.attributes);
        if (url) setHeroImage(url);
      }
      // detect whether event objects include a relation "category"
      const hasCategoryRelation = evts.some((e) => e.category !== undefined || e.categories !== undefined);
      setFilterSupported(hasCategoryRelation);
    } catch (err) {
      setError(err);
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  }, [heroImage]);

  const loadCategories = useCallback(async () => {
    try {
      const cats = await fetchCategories();
      setCategories(cats || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }, []);

  // initial load: events first (no filter)
  useEffect(() => {
    (async () => {
      await loadEvents(null, false);
    })();
  }, [loadEvents]);

  // load categories only if filtering is supported
  useEffect(() => {
    if (filterSupported) loadCategories();
  }, [filterSupported, loadCategories]);

  // when user clicks a chip
  useEffect(() => {
    if (!filterSupported) return;
    (async () => {
      await loadEvents(activeCategoryId, activeCategoryId !== null);
    })();
  }, [activeCategoryId, filterSupported, loadEvents]);

  return (
    <main className="min-h-screen bg-gray-50">
      <Hero bgImageUrl={heroImage || "/default-hero.jpg"} />
      <section className="container mx-auto px-6 -mt-10">
        <div className="bg-white rounded-lg p-6 shadow">
          {filterSupported ? (
            <CategoryChips categories={categories} activeId={activeCategoryId} onChange={setActiveCategoryId} />
          ) : (
            <div className="flex flex-wrap mt-6">
              <button className="inline-flex items-center px-4 py-2 rounded-full border text-sm mr-3 mb-3 bg-blue-600 text-white">All</button>
              {/* optionally show disabled chips using category titles if exist */}
              {categories.map((c) => (
                <button key={c.id} className="inline-flex items-center px-4 py-2 rounded-full border text-sm mr-3 mb-3 bg-white text-gray-400 cursor-not-allowed">
                  {c.title || c.name || "Unnamed"}
                </button>
              ))}
            </div>
          )}

          <div className="mt-6">
            {loading && <p className="text-gray-600">Loading events…</p>}
            {!loading && error && <p className="text-red-500">Failed to load events</p>}
            {!loading && !events.length && <p className="text-gray-600">No events found.</p>}

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((evt) => {
                // evt may already be flattened (title, DateTime, image) or attributes object
                const imageUrl = getStrapiMedia(evt.image);
                return (
                  <EventCard
                    key={evt.id || evt.documentId || Math.random()}
                    event={evt}
                    imageUrl={imageUrl}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default EventsPage;
