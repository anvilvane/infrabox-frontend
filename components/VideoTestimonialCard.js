"use client";

import { useEffect, useState } from "react";
import { Play, X } from "lucide-react";
import CompanyLogo from "@/components/CompanyLogo";

function VideoModal({ video, onClose }) {
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${video.name}'s video testimonial`}
    >
      <div
        className="relative w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close video"
          className="absolute -top-10 right-0 text-white/80 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="aspect-video rounded-lg overflow-hidden bg-black shadow-2xl">
          <video
            src={`/api/drive-video?id=${video.driveId}`}
            poster={`/api/drive-thumbnail?id=${video.driveId}`}
            title={`${video.name}'s video testimonial`}
            className="w-full h-full"
            autoPlay
            controls
            playsInline
          />
        </div>
      </div>
    </div>
  );
}

export default function VideoTestimonialCard({ video }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen(true);
          }
        }}
        aria-label={`Watch ${video.name}'s video testimonial`}
        className="flex flex-col rounded-2xl border border-gray-200 bg-white overflow-hidden hover:shadow-md hover:shadow-gray-200/60 hover:border-gray-300 transition-shadow duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1240cc] focus-visible:ring-offset-2"
      >
        <div className="relative aspect-video bg-gray-900">
          <img
            src={`/api/drive-thumbnail?id=${video.driveId}`}
            alt=""
            role="presentation"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
              <Play className="w-4 h-4 text-[#1240cc] ml-0.5" fill="currentColor" />
            </div>
          </div>
        </div>

        <div className="p-4 flex items-center gap-3">
          <CompanyLogo domain={video.domain} name={video.name} size="h-9 w-9" />
          <div className="min-w-0">
            <div className="text-sm font-semibold text-gray-900 truncate">
              {video.name}
            </div>
            <div className="text-xs text-gray-400 truncate">{video.title}</div>
          </div>
        </div>
      </div>

      {isOpen && <VideoModal video={video} onClose={() => setIsOpen(false)} />}
    </>
  );
}
