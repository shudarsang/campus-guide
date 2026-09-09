"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="chat-markdown text-[13px] leading-relaxed text-gray-800">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-sm font-bold text-brand-900 mt-2 mb-1 border-b border-brand-100 pb-0.5" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-800 mt-2 mb-1" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-xs font-bold text-brand-700 mt-1.5 mb-0.5" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="mb-1.5 last:mb-0 leading-relaxed" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-outside pl-4 space-y-1 mb-1.5 text-gray-700" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-outside pl-4 space-y-1 mb-1.5 text-gray-700" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="leading-snug" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-semibold text-gray-900" {...props} />
          ),
          em: ({ node, ...props }) => (
            <em className="italic text-gray-700" {...props} />
          ),
          hr: ({ node, ...props }) => (
            <hr className="my-2 border-brand-100" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-2 border-brand-400 pl-2 italic text-gray-600 my-1 bg-brand-100/30 py-0.5 rounded-r"
              {...props}
            />
          ),
          code: ({ node, inline, className, children, ...props }: any) => {
            if (inline) {
              return (
                <code
                  className="rounded bg-brand-100 px-1 py-0.5 font-mono text-[11px] font-semibold text-brand-800"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <pre className="overflow-x-auto rounded-lg bg-gray-900 p-2 text-white my-1.5 text-[11px] font-mono">
                <code {...props}>{children}</code>
              </pre>
            );
          },
          table: ({ node, ...props }) => (
            <div className="my-2 overflow-x-auto rounded border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200 text-left text-xs" {...props} />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th className="bg-brand-100/70 px-2 py-1 font-semibold text-brand-900" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="border-t border-gray-100 px-2 py-1 text-gray-700" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a
              className="font-medium text-brand-600 underline underline-offset-2 hover:text-brand-800"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
