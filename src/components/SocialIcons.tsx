import React from 'react';
import { SOCIAL_LINKS } from '../constants';

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function QuoraIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12.738 0C5.62 0 0 5.62 0 12.738s5.62 12.738 12.738 12.738 12.738-5.62 12.738-12.738S19.856 0 12.738 0zm4.805 18.849h-2.31l-1.015-2.583-2.583 2.583H9.32l3.24-4.14-3.015-3.855h2.31l.915 2.34 2.34-2.34h2.31l-3.015 3.855 3.24 4.14zM12.738 3.96c-1.89 0-3.42 1.53-3.42 3.42s1.53 3.42 3.42 3.42 3.42-1.53 3.42-3.42-1.53-3.42-3.42-3.42z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1-.07z" />
    </svg>
  );
}

const ICONS: Record<string, React.FC<{ className?: string }>> = {
  facebook: FacebookIcon,
  quora: QuoraIcon,
  tiktok: TikTokIcon,
};

export function FooterSocialLinks() {
  return (
    <div className="flex flex-wrap gap-3">
      {SOCIAL_LINKS.map((link) => {
        const Icon = ICONS[link.id];
        return (
          <a
            key={link.id}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            title={link.label}
            aria-label={`${link.label} (opens in new tab)`}
            className="w-10 h-10 rounded-sm glass-panel flex items-center justify-center hover:bg-blue-600 transition-colors group text-slate-300 hover:text-white"
          >
            {Icon ? <Icon className="w-5 h-5" /> : null}
          </a>
        );
      })}
    </div>
  );
}
