"use client";

import { useEffect, useRef, useState } from "react";
import CustomerStoriesAvatar from "@/components/CustomerStoriesAvatar";

export default function CompanyLogo({ domain, name, size = "h-9 w-9" }) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef(null);

  // Catches logos that already failed before hydration, which onError alone can miss.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) {
      setFailed(true);
    }
  }, [domain]);

  if (!domain || failed) {
    return <CustomerStoriesAvatar name={name} size={size} />;
  }

  return (
    <img
      ref={imgRef}
      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=128`}
      alt=""
      role="presentation"
      loading="lazy"
      onError={() => setFailed(true)}
      className={`${size} rounded-full object-contain shrink-0 bg-white border border-gray-100 p-1.5`}
    />
  );
}
