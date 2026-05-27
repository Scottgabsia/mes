import React from "react";
import { SITE_URL } from "../constants";

/** Internal paths become absolute site URLs; external links open in new tab */
function resolveHref(href: string): string {
  if (href.startsWith("http://") || href.startsWith("https://")) return href;
  const path = href.startsWith("/") ? href : `/${href}`;
  return `${SITE_URL.replace(/\/$/, "")}${path}`;
}

type Block =
  | { type: "h3"; text: string }
  | { type: "p"; text: string };

function parseInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const re = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;

  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      nodes.push(<React.Fragment key={key++}>{text.slice(last, m.index)}</React.Fragment>);
    }
    if (m[2] && m[3]) {
      const href = resolveHref(m[3]);
      const external = href.startsWith("http") && !href.includes("cryptorecoveryasset.com");
      nodes.push(
        <a
          key={key++}
          href={href}
          className="text-blue-400 hover:text-blue-300 underline underline-offset-2 font-semibold transition-colors"
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {m[2]}
        </a>
      );
    } else if (m[4]) {
      nodes.push(
        <strong key={key++} className="text-white font-bold">
          {m[4]}
        </strong>
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) {
    nodes.push(<React.Fragment key={key++}>{text.slice(last)}</React.Fragment>);
  }
  return nodes.length ? nodes : [text];
}

function parseBlocks(raw: string): Block[] {
  const blocks: Block[] = [];
  const lines = raw.trim().split("\n");
  let paragraph = "";

  const flush = () => {
    const t = paragraph.trim();
    if (t) blocks.push({ type: "p", text: t });
    paragraph = "";
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flush();
      continue;
    }
    if (trimmed.startsWith("### ")) {
      flush();
      blocks.push({ type: "h3", text: trimmed.slice(4).trim() });
      continue;
    }
    paragraph += (paragraph ? " " : "") + trimmed;
  }
  flush();
  return blocks;
}

export function BlogContent({ content }: { content: string }) {
  const blocks = parseBlocks(content);

  return (
    <div className="text-slate-300 font-manrope text-lg leading-relaxed space-y-8">
      {blocks.map((block, i) =>
        block.type === "h3" ? (
          <h3
            key={i}
            className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight font-manrope mt-10 first:mt-0"
          >
            {parseInline(block.text)}
          </h3>
        ) : (
          <p key={i} className="text-slate-300 leading-relaxed">
            {parseInline(block.text)}
          </p>
        )
      )}
    </div>
  );
}
