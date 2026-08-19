"use client";

import { useEffect, useRef, useState } from "react";
import CustomerStoriesAvatar from "@/components/CustomerStoriesAvatar";

export default function LinkedInAvatar({ src, name, size = "h-12 w-12" }) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef(null);

  // Catches images that already failed (e.g. an expired/blocked LinkedIn CDN
  // token) before this component hydrated, which onError alone can miss.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) {
      setFailed(true);
    }
  }, [src]);

  if (!src || failed) {
    return <CustomerStoriesAvatar name={name} size={size} />;
  }

  return (
    <img
      ref={imgRef}
      src={`/api/linkedin-avatar?url=${encodeURIComponent(src)}`}
      alt=""
      role="presentation"
      loading="lazy"
      onError={() => setFailed(true)}
      className={`${size} rounded-full object-cover shrink-0 bg-gray-100`}
    />
  );
}
