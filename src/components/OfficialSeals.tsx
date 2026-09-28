import React from "react";

function SawtoothRing({
  cx,
  cy,
  r,
  teeth,
  fill,
}: {
  cx: number;
  cy: number;
  r: number;
  teeth: number;
  fill: string;
}) {
  const points: string[] = [];
  for (let i = 0; i < teeth * 2; i++) {
    const angle = (Math.PI * 2 * i) / (teeth * 2) - Math.PI / 2;
    const radius = i % 2 === 0 ? r : r - 8;
    points.push(
      `${cx + Math.cos(angle) * radius},${cy + Math.sin(angle) * radius}`
    );
  }
  return <polygon points={points.join(" ")} fill={fill} />;
}

function safeId(reactId: string) {
  return reactId.replace(/[^a-zA-Z0-9_-]/g, "");
}

export const AgencySeal = ({ className = "" }: { className?: string }) => {
  const uid = safeId(React.useId());
  const top = `${uid}-agency-top`;
  const bottom = `${uid}-agency-bottom`;

  return (
    <svg viewBox="0 0 220 220" className={className} aria-hidden="true">
      <SawtoothRing cx={110} cy={110} r={108} teeth={40} fill="#c9a227" />
      <circle cx="110" cy="110" r="92" fill="#0f172a" />
      <circle cx="110" cy="110" r="86" fill="none" stroke="#e8d48b" strokeWidth="2.5" />
      <circle cx="110" cy="110" r="62" fill="none" stroke="#c9a227" strokeWidth="1.6" />
      <path id={top} d="M 36,110 A 74,74 0 0,1 184,110" fill="none" />
      <path id={bottom} d="M 184,110 A 74,74 0 0,1 36,110" fill="none" />
      <text
        fill="#e8d48b"
        fontSize="12"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontWeight="700"
        letterSpacing="1.4"
      >
        <textPath href={`#${top}`} xlinkHref={`#${top}`} startOffset="50%" textAnchor="middle">
          CRYPTO RECOVERY ASSETS
        </textPath>
      </text>
      <text
        fill="#c9a227"
        fontSize="11"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontWeight="700"
        letterSpacing="1.2"
      >
        <textPath href={`#${bottom}`} xlinkHref={`#${bottom}`} startOffset="50%" textAnchor="middle">
          AGENCY · OFFICIAL SEAL
        </textPath>
      </text>
      <path
        d="M110 72 L116 92 L137 92 L120 104 L126 124 L110 112 L94 124 L100 104 L83 92 L104 92 Z"
        fill="#c9a227"
      />
      <text
        x="110"
        y="148"
        textAnchor="middle"
        fill="#f8efc6"
        fontSize="16"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontWeight="700"
        letterSpacing="3"
      >
        SEAL
      </text>
    </svg>
  );
};

export const ComplianceSeal = ({ className = "" }: { className?: string }) => {
  const uid = safeId(React.useId());
  const top = `${uid}-comp-top`;
  const bottom = `${uid}-comp-bottom`;

  return (
    <svg viewBox="0 0 220 220" className={className} aria-hidden="true">
      <SawtoothRing cx={110} cy={110} r={108} teeth={40} fill="#86efac" />
      <circle cx="110" cy="110" r="92" fill="#14532d" />
      <circle cx="110" cy="110" r="86" fill="none" stroke="#bbf7d0" strokeWidth="2.5" />
      <circle cx="110" cy="110" r="62" fill="none" stroke="#86efac" strokeWidth="1.6" />
      <path id={top} d="M 36,110 A 74,74 0 0,1 184,110" fill="none" />
      <path id={bottom} d="M 184,110 A 74,74 0 0,1 36,110" fill="none" />
      <text
        fill="#dcfce7"
        fontSize="12"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontWeight="700"
        letterSpacing="1.6"
      >
        <textPath href={`#${top}`} xlinkHref={`#${top}`} startOffset="50%" textAnchor="middle">
          OFFICIAL RECORD
        </textPath>
      </text>
      <text
        fill="#bbf7d0"
        fontSize="11"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontWeight="700"
        letterSpacing="1.4"
      >
        <textPath href={`#${bottom}`} xlinkHref={`#${bottom}`} startOffset="50%" textAnchor="middle">
          AUTHENTICATED · AUDIT
        </textPath>
      </text>
      <text
        x="110"
        y="118"
        textAnchor="middle"
        fill="#ffffff"
        fontSize="18"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontWeight="700"
        letterSpacing="1.5"
      >
        VALID
      </text>
    </svg>
  );
};

export const DocumentStampRow = ({ className = "" }: { className?: string }) => (
  <div className={`flex flex-row flex-nowrap items-center justify-end gap-3 sm:gap-4 ${className}`}>
    <AgencySeal className="w-[7.5rem] h-[7.5rem] sm:w-40 sm:h-40 shrink-0" />
    <ComplianceSeal className="w-[7.5rem] h-[7.5rem] sm:w-40 sm:h-40 shrink-0" />
  </div>
);
