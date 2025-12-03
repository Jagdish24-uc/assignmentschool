import React from "react";
import EventCard from "../EventCard/EventCard";
import { useEvents } from "../../context/EventsContext";

const EventsList = () => {
  const { events, loading, error } = useEvents();

  if (loading) return <p>Loading events…</p>;
  if (error) return <p>Failed to load events</p>;
  if (!events.length) return <p>No events found</p>;

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {events.map((evt) => (
        <EventCard key={evt.id} event={evt} />
      ))}
    </section>
  );
};

export default EventsList;
