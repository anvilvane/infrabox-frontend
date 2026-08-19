"use client";

import { ThumbsUp, MessageCircle, Repeat2, Send, Globe2 } from "lucide-react";
import LinkedInAvatar from "@/components/LinkedInAvatar";

const LinkedInIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 11.001-4.125 2.062 2.062 0 010 4.125zM7.114 20.452H3.558V9h3.556v11.452z" />
  </svg>
);

const WORD_LIMIT = 35;

function truncateWords(text, limit) {
  const words = text.trim().split(/\s+/);
  if (words.length <= limit) return text;
  return `${words.slice(0, limit).join(" ")} ......`;
}

export default function LinkedInPostCard({ post }) {
  const openPost = () => {
    window.open(post.url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={openPost}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openPost();
        }
      }}
      aria-label={`View ${post.name}'s post on LinkedIn`}
      className="break-inside-avoid mb-5 rounded-lg border border-gray-200 bg-white overflow-hidden hover:shadow-md hover:shadow-gray-200/60 hover:border-gray-300 transition-shadow duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A66C2] focus-visible:ring-offset-2"
    >
      <div className="p-4">
        {/* Post header */}
        <div className="flex items-start gap-2.5">
          <LinkedInAvatar src={post.avatar} name={post.name} size="h-12 w-12" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1 text-[13px] leading-tight">
              <span className="font-semibold text-gray-900 truncate">{post.name}</span>
              <span className="text-gray-400 shrink-0">&bull; 1st</span>
            </div>
            <div className="text-xs text-gray-500 leading-tight truncate">{post.title}</div>
            <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
              <span>{post.postedAt}</span>
              <span aria-hidden="true">&bull;</span>
              <Globe2 className="w-3 h-3" aria-label="Public post" />
            </div>
          </div>
          <LinkedInIcon className="w-5 h-5 text-[#0A66C2] shrink-0" aria-hidden="true" />
        </div>

        {/* Post text — hard word limit, "......" when truncated */}
        <p className="mt-3 text-[13.5px] text-gray-900 leading-relaxed whitespace-pre-line">
          {truncateWords(post.text, WORD_LIMIT)}
        </p>
      </div>

      {/* Reaction summary — real counts */}
      <div className="px-4 py-1.5 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <span className="flex items-center -space-x-1">
            <span className="w-4 h-4 rounded-full bg-[#0A66C2] flex items-center justify-center ring-2 ring-white">
              <ThumbsUp className="w-2.5 h-2.5 text-white" fill="currentColor" />
            </span>
            <span className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center ring-2 ring-white">
              <span className="text-white text-[8px] leading-none">&#10084;</span>
            </span>
          </span>
          <span>{post.reactions}</span>
        </div>
        <span>{post.comments} comments</span>
      </div>

      {/* Action bar — icons only, decorative */}
      <div className="border-t border-gray-100 px-1 py-0.5 flex items-center justify-around">
        {[
          { icon: ThumbsUp, label: "Like" },
          { icon: MessageCircle, label: "Comment" },
          { icon: Repeat2, label: "Repost" },
          { icon: Send, label: "Send" },
        ].map(({ icon: Icon, label }) => (
          <span
            key={label}
            aria-label={label}
            className="flex items-center justify-center flex-1 py-2 rounded text-gray-500"
          >
            <Icon className="w-4 h-4" />
          </span>
        ))}
      </div>
    </div>
  );
}
