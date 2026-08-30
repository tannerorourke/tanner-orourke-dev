import { Fragment } from "react";
import Image from "next/image";
import Markdown from "@/components/ui/Markdown";
import { preHighlightCodeBlocks } from "@/lib/markdown/highlight";
import { getImageSize, isSvg } from "@/lib/content/images";

import * as sty from "./section.css";
import Eyebrow from "@/components/ui/Eyebrow";

type sectionCommonProps = {
  id: string;
  title?: string;
  accent?: "copper";
  body?: string;
}


export function SectionShell(
  { id, title, accent, children }: 
  { id: string; title?: string; accent?: "copper"; children: React.ReactNode; }
) {
  const titleCls = [sty.sectionTitle, accent === "copper" && sty.sectionTitleCopper]
    .filter(Boolean)
    .join(" ");
  return (
    <section id={`section-${id}`} className={sty.section}>
      {title && 
        <Markdown textProps={{ as: "h2", variant: "titleMd", className: titleCls }} value={title} />}
      {children}
    </section>
  );
}

type MarkdownSection = sectionCommonProps & {
  type: "block";
  body: string;
};

type SectionImage = sectionCommonProps & {
  type: "Image";
  src: string;
  alt?: string;
  caption?: string;
};

export function ImageSection({ s }: { s: SectionImage }) {
  return (
    <Fragment>
      {isSvg(s.src) ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={sty.image}
          src={s.src}
          alt={s.alt ?? ""}
          loading="lazy"
        />
      ) : (
        <Image
          className={sty.image}
          src={s.src}
          alt={s.alt ?? ""}
          sizes="(min-width: 1024px) 98ch, 100vw"
          {...getImageSize(s.src)}
        />
      )}
      {s.caption &&
        <Markdown
          textProps={{ as: "p", variant: "caption", className: sty.imgCaption }}
          value={s.caption}
        />}
    </Fragment>
  );
}

type SectionTwoUpTextImage = sectionCommonProps & {
  type: "2upTextImage";
  body?: string;
  caption?: string;
  image: { src: string; alt?: string };
  side?: "left" | "right" | "top" | "bottom";
};

export async function TwoUpTextImage({ s }: { s: SectionTwoUpTextImage }) {
  const body = s.body ? await preHighlightCodeBlocks(s.body) : "";
  const imageSide = s.side ?? "right";

  const containerCls = ["top", "bottom"].includes(imageSide)
    ? sty.twoUpStacked
    : [sty.twoUp, imageSide === "left" ? sty.twoUpReverse : ""]
        .filter(Boolean).join(" ");

  const img = isSvg(s.image.src) ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={sty.inlineImage}
      src={s.image.src} alt={s.image.alt ?? ""}
      loading="lazy"
    />
  ) : (
    <Image
      className={sty.inlineImage}
      src={s.image.src} alt={s.image.alt ?? ""}
      sizes="(min-width: 700px) 45vw, 100vw"
      {...getImageSize(s.image.src)}
    />
  )

  const image = s?.caption ? (
    <div className={sty.inlineImageWrap}>
      {img}
      <Markdown 
        textProps={{ as: "p", 
          variant: 'caption', 
          className: sty.imgCaption
        }}
        value={s.caption}
      />
    </div>
  ) : img;

  const prose = s?.body ? (
    <Markdown 
      value={body}
      textProps={{ as: "p", 
        variant: imageSide === 'top' ? 'caption' : 'body', 
        className: sty.imgCaption
      }}
    />
  ) : null;

  return (
    <div className={containerCls}>
      {imageSide === "top" ? (
        <>{image}{prose}</>
      ) : (
        <>{prose}{image}</>
      )}
    </div>
  );
}

type SectionStats = sectionCommonProps & {
  type: "Stats";
  stats: Array<{ value: string; label: string }>;
};

export function StatsSection({ s }: { s: SectionStats }) {
  return (
    <ul className={sty.statsList}>
      {s.stats.map((s, i) => (
        <li key={i} className={sty.statItem}>
          <Markdown
            textProps={{ as: "p", variant: "titleXs", className: sty.statValue }}
            value={s.value}
          />
          <Eyebrow>{s.label}</Eyebrow>
        </li>
      ))}
    </ul>
  );
}

export type SectionTypes =
  | MarkdownSection
  | SectionTwoUpTextImage
  | SectionImage
  | SectionStats;

export function sectionByType(s: SectionTypes) {
  switch (s.type) {
    case "block":
      return <Markdown value={s.body} />;
    case "2upTextImage":
      return <TwoUpTextImage key={s.id} s={s} />;
    case "Image":
      return <ImageSection key={s.id} s={s} />;
    case "Stats":
      return <StatsSection key={s.id} s={s} />;
    default:
      return null;
  }
}
