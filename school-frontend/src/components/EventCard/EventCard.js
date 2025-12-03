// src/components/EventCard.jsx
import React from "react";

const EventCard = ({ event = {}, imageUrl }) => {
  // event may come flattened (title) or be nested. Access safe:
  const title = event.title ?? event.attributes?.title ?? "Untitled event";
  const dateRaw = event.DateTime ?? event.date ?? event.attributes?.DateTime ?? event.attributes?.date ?? null;
  const date = dateRaw ? new Date(dateRaw).toLocaleDateString() : null;
  const location = event.location ?? event.attributes?.location ?? "";

  return (
    <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer">
      {imageUrl ? (
        <img src={imageUrl} alt={title} className="w-full h-52 object-cover" loading="lazy" />
      ) : (
        <div className="w-full h-52 bg-gray-100 flex items-center justify-center text-gray-400">No Image</div>
      )}

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <div className="text-xs text-gray-500 mb-2">
          {date} {location ? `• ${location}` : ""}
        </div>
        { (event.description || event.attributes?.description) && (
          <p className="text-sm text-gray-700 line-clamp-3" dangerouslySetInnerHTML={{ __html: event.description ?? event.attributes?.description }} />
        )}
      </div>
    </article>
  );
};

export default EventCard;
