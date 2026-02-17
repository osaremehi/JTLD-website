"use client";

import Link from "next/link";

interface ChatMessageProps {
  from: "bot" | "user";
  text: string;
  links?: { label: string; href: string }[];
  followUps?: string[];
  onFollowUp?: (text: string) => void;
}

export default function ChatMessage({ from, text, links, followUps, onFollowUp }: ChatMessageProps) {
  return (
    <div className={`flex ${from === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          from === "user"
            ? "bg-primary-700 text-white rounded-br-md"
            : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-bl-md shadow-sm"
        }`}
      >
        <p className="whitespace-pre-line">{text}</p>

        {links && links.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/40 hover:bg-primary-100 dark:hover:bg-primary-900/60 px-3 py-1.5 rounded-full transition-colors"
              >
                {link.label}
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        )}

        {followUps && followUps.length > 0 && onFollowUp && (
          <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Suggested replies">
            {followUps.map((fu) => (
              <button
                key={fu}
                onClick={() => onFollowUp(fu)}
                className="text-xs font-medium text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/30 hover:bg-primary-100 dark:hover:bg-primary-900/50 border border-primary-200 dark:border-primary-700 px-3 py-1.5 rounded-full transition-colors text-left"
              >
                {fu}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
