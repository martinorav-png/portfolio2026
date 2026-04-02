import type { LucideIcon } from 'lucide-react';
import {
  AudioWaveform,
  Award,
  Clapperboard,
  Film,
  Image as ImageIcon,
  LayoutGrid,
  Mail,
  Palette,
  PenTool,
  Printer,
} from 'lucide-react';

import cssUrl from 'simple-icons/icons/css.svg?url';
import figmaUrl from 'simple-icons/icons/figma.svg?url';
import html5Url from 'simple-icons/icons/html5.svg?url';
import javascriptUrl from 'simple-icons/icons/javascript.svg?url';

type Mark =
  | { kind: 'img'; src: string }
  | { kind: 'lucide'; icon: LucideIcon };

type StripEntry = { label: string; marks: Mark[] };

const ENTRIES: StripEntry[] = [
  { label: 'Photoshop', marks: [{ kind: 'lucide', icon: ImageIcon }] },
  { label: 'Figma', marks: [{ kind: 'img', src: figmaUrl }] },
  { label: 'Illustrator', marks: [{ kind: 'lucide', icon: PenTool }] },
  { label: 'After Effects', marks: [{ kind: 'lucide', icon: Film }] },
  { label: 'FL Studio', marks: [{ kind: 'lucide', icon: AudioWaveform }] },
  {
    label: 'HTML / CSS',
    marks: [
      { kind: 'img', src: html5Url },
      { kind: 'img', src: cssUrl },
    ],
  },
  { label: 'JavaScript', marks: [{ kind: 'img', src: javascriptUrl }] },
  { label: 'UI Design', marks: [{ kind: 'lucide', icon: LayoutGrid }] },
  { label: 'Graphic Design', marks: [{ kind: 'lucide', icon: Palette }] },
  { label: 'Branding', marks: [{ kind: 'lucide', icon: Award }] },
  { label: 'Motion Graphics', marks: [{ kind: 'lucide', icon: Clapperboard }] },
  { label: 'Print Design', marks: [{ kind: 'lucide', icon: Printer }] },
  { label: 'Email Design', marks: [{ kind: 'lucide', icon: Mail }] },
];

function MarkEl({ mark }: { mark: Mark }) {
  if (mark.kind === 'img') {
    return (
      <img
        className="tool-tag__brand-icon tool-tag__brand-icon--svg"
        src={mark.src}
        alt=""
        width={18}
        height={18}
        loading="lazy"
        decoding="async"
      />
    );
  }
  const Icon = mark.icon;
  return <Icon className="tool-tag__lucide" strokeWidth={2} aria-hidden />;
}

function ToolTag({ entry }: { entry: StripEntry }) {
  return (
    <span className="tool-tag">
      <span className="tool-tag__leading" aria-hidden>
        {entry.marks.map((mark, i) => (
          <MarkEl key={i} mark={mark} />
        ))}
      </span>
      <span className="tool-tag__label">{entry.label}</span>
    </span>
  );
}

export default function SkillsStrip() {
  return (
    <div className="tools-strip reveal">
      {ENTRIES.map((entry) => (
        <ToolTag key={entry.label} entry={entry} />
      ))}
    </div>
  );
}
