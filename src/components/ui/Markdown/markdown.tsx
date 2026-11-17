import type { ComponentProps, ElementType } from 'react';

import { Link as NextLink } from 'next-view-transitions';
import ReactMarkdown, { type Components } from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkMath from 'remark-math';

import DrawerLink from '@/components/navigation/DrawerLink';
import type { DrawerId } from '@/components/providers/DrawerProvider';
import Text, { type TextProps } from '@/components/ui/Text';
import { type TextVariant } from '@/lib/theme/typography.css';

import * as sty from './markdown.css';
import { preHighlightCodeBlocks } from '@/lib/markdown/highlight';


export type MarkdownProps = {
  value: string;
  inline?: boolean;
  className?: string;
  textProps?: Omit<TextProps<ElementType>, 'children'>;
  block?: boolean;
};

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
const HEADING_VARIANT: Record<HeadingTag, TextVariant> = {
  h1: 'titleLg',
  h2: 'titleMd',
  h3: 'titleSm',
  h4: 'titleXs',
  h5: 'titleXs',
  h6: 'titleXs',
};

const Heading = (tag: HeadingTag) =>
  function node({ children }: ComponentProps<'h1'>) {
    const id = (tag === 'h2' && children) ? children.toString().replaceAll(' ','-').toLowerCase() : '';
    console.log(`Rendering heading: ${tag} with id: ${id}`);
    return <Text id={`section-${id}`} as={tag} variant={HEADING_VARIANT[tag]}>{children}</Text>;
  };

// -- an in-site href whose 'view' names a header drawer opens that drawer, whatever its path
function drawerOf(href: string): DrawerId | null {
  if (!/^[/?]/.test(href)) return null;
  const view = new URLSearchParams(href.split('#')[0].split('?')[1]).get('view');
  return view === 'work' || view === 'contact' ? view : null;
}

// Make links work with Next.js primitives
const Link = (cls = '') =>
  function node({ href, children }: ComponentProps<'a'>) {
    if (!href)
      return <>{children}</>;
    const drawer = drawerOf(href);
    if (drawer)
      return <DrawerLink className={cls} drawer={drawer} href={href}>{children}</DrawerLink>;
    if (href.startsWith('/'))
      return <NextLink className={cls} href={href}>{children}</NextLink>;
    if (href.startsWith('#'))
      return <a className={cls} href={href}>{children}</a>;
    return (
      <a className={cls} href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  };

const Code = (cls = '') =>
  function node({ className, children, ...props }: ComponentProps<'code'>) {
    const isCodeBlock = /language-/.test(className ?? '');
    return <code 
      className={[cls, isCodeBlock ? sty.codeBlock : sty.inlineCode].filter(Boolean).join(' ')} {...props}>
      {children}</code>;
  };

export async function Markdown({ 
  value, 
  inline = false, 
  className, 
  textProps,
  block = false
}: MarkdownProps) {
  const fullCls = [sty.md, className].filter(Boolean).join(' ');

  let components: Components;

  if (inline) {
    components = {
      a: Link(fullCls), 
      code: Code(fullCls),
      p: ({ children }) => <>{children}</>,
    };
  } else {
    const baseComponents: Components = { 
      a: Link(sty.md),
      code: Code(sty.md)
    };

    components = {
      ...baseComponents,
      p: ({ children }) => <Text {...textProps}>{children}</Text>,
      h1: () => <></>,// Heading('h1'),
      h2: Heading('h2'),
      h3: Heading('h3'),
      h4: Heading('h4'),
      h5: Heading('h5'),
      h6: Heading('h6'),
      ul: ({ children }) => <ul className={sty.bulletList}>{children}</ul>,
      ol: ({ children }) => <ol className={sty.orderedList}>{children}</ol>,
      li: ({ children }) => <Text as="li" variant="bodySm"><div>{children}</div></Text>,
      blockquote: ({ children }) => <blockquote className={sty.blockquote}>{children}</blockquote>,
      hr: () => <hr className={sty.hr} />
    };
    
    if (!textProps) {
      // full block rendering (headings, lists, blockquotes, paragraphs)
      // inject className into block wrapper, not sub-block elements
      block = true;
    }
  }

  const body = 
    !value.includes('```') ? value : await preHighlightCodeBlocks(value);

  const rendered = (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeRaw, [rehypeKatex, { strict: 'ignore', output: 'html' }] ]}
      components={components}
    >
      {body}
    </ReactMarkdown>
  );

  if (block) {
    return (
      <div className={fullCls}>
        {rendered}
      </div>
    );
  }

  return rendered;
}
