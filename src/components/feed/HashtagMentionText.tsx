import React from 'react';
import { Link } from 'react-router-dom';

interface HashtagMentionTextProps {
  text: string;
  className?: string;
}

const PATTERN = /([@#][\w]+)/g;

export function HashtagMentionText({ text, className = '' }: HashtagMentionTextProps) {
  const parts = text.split(PATTERN);

  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (part.startsWith('@')) {
          const username = part.slice(1);
          return (
            <Link
              key={i}
              to={`/profile/${username}`}
              className="text-gold-500 hover:text-gold-400 font-medium transition-colors"
            >
              {part}
            </Link>
          );
        }
        if (part.startsWith('#')) {
          const tag = part.slice(1);
          return (
            <Link
              key={i}
              to={`/search?q=${tag}`}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              {part}
            </Link>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}
