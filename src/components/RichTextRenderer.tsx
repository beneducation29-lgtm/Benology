import React from 'react';

function renderInlineFormatting(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="font-semibold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

export function RichTextRenderer({ text, className = '' }: { text: string; className?: string }) {
  if (!text) return null;

  const lines = text.split('\n');
  const blocks: React.ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = (keyPrefix: string) => {
    if (listItems.length > 0) {
      blocks.push(
        <ul key={`${keyPrefix}-ul`} className="space-y-1.5 pl-5 list-disc text-slate-700">
          {listItems.map((item, i) => (
            <li key={i} className="leading-relaxed">
              {renderInlineFormatting(item)}
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim();
    if (!line) {
      flushList(`empty-${index}`);
      return;
    }

    if (line.startsWith('- ') || line.startsWith('* ')) {
      listItems.push(line.slice(2).trim());
      return;
    }

    flushList(`line-${index}`);

    if (line.startsWith('### ')) {
      blocks.push(
        <h4 key={index} className="text-base font-semibold text-slate-900 pt-2">
          {renderInlineFormatting(line.slice(4))}
        </h4>
      );
    } else if (line.startsWith('## ')) {
      blocks.push(
        <h3 key={index} className="text-lg font-semibold text-slate-900 pt-3">
          {renderInlineFormatting(line.slice(3))}
        </h3>
      );
    } else {
      blocks.push(
        <p key={index} className="leading-relaxed text-slate-700">
          {renderInlineFormatting(line)}
        </p>
      );
    }
  });

  flushList('final');

  return <div className={`space-y-3 text-[15px] ${className}`}>{blocks}</div>;
}
