"use client";

import React from "react";
import Image from "next/image";
import {
  ContentBlock,
  HeadingBlock,
  ParagraphBlock,
  ImageBlock,
  QuoteBlock,
  EmbedBlock,
  ListBlock,
  CodeBlock,
} from "@/common/types";
import { cn } from "@/lib/utils";
import { getHeaderStyle } from "@/common/helpers";

// Type guard functions
export const isHeadingBlock = (block: ContentBlock): block is HeadingBlock =>
  block.type === "heading";
export const isParagraphBlock = (
  block: ContentBlock
): block is ParagraphBlock => block.type === "paragraph";
export const isImageBlock = (block: ContentBlock): block is ImageBlock =>
  block.type === "image";
export const isQuoteBlock = (block: ContentBlock): block is QuoteBlock =>
  block.type === "quote";
export const isEmbedBlock = (block: ContentBlock): block is EmbedBlock =>
  block.type === "embed";
export const isListBlock = (block: ContentBlock): block is ListBlock =>
  block.type === "list";
export const isCodeBlock = (block: ContentBlock): block is CodeBlock =>
  block.type === "code";

// Helper function to extract YouTube video ID
const extractYouTubeId = (url: string): string => {
  if (url.length === 11 && !url.includes("/") && !url.includes("?")) {
    return url;
  }

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return url;
};

interface ContentBlockRendererProps {
  block: ContentBlock;
}

export const ContentBlockRenderer: React.FC<ContentBlockRendererProps> = ({
  block,
}) => {
  if (isHeadingBlock(block)) {
    const HeadingTag = `h${block.level}` as keyof React.JSX.IntrinsicElements;
    return (
      <HeadingTag
        className={cn(
          getHeaderStyle(block.level),
          "font-bold text-gray-900 dark:text-white mb-4 mt-6"
        )}
      >
        {block.text}
      </HeadingTag>
    );
  }

  if (isParagraphBlock(block)) {
    return (
      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
        {block.text}
      </p>
    );
  }

  if (isImageBlock(block)) {
    return (
      <div className="my-6">
        <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={block.image}
            alt={block.alt || block.caption || "Blog image"}
            fill
            className="object-cover"
            onError={() => {
              // Handle error if needed
            }}
          />
        </div>
        {block.caption && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center italic">
            {block.caption}
          </p>
        )}
      </div>
    );
  }

  if (isQuoteBlock(block)) {
    return (
      <blockquote className="border-l-4 border-main-500 pl-4 py-2 my-6 bg-gray-50 dark:bg-gray-800 rounded-r-lg">
        <p className="text-lg italic text-gray-700 dark:text-gray-300">
          &quot;{block.text}&quot;
        </p>
        {block.cite && (
          <cite className="text-sm text-gray-500 dark:text-gray-400 mt-2 block">
            — {block.cite}
          </cite>
        )}
      </blockquote>
    );
  }

  if (isEmbedBlock(block)) {
    if (block.provider === "youtube" && block.src) {
      return (
        <div className="my-6">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
            <iframe
              src={`https://www.youtube.com/embed/${extractYouTubeId(
                block.src
              )}`}
              title={block.title || "YouTube video"}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          {block.title && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
              {block.title}
            </p>
          )}
        </div>
      );
    }

    if (block.provider === "vimeo" && block.src) {
      return (
        <div className="my-6">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
            <iframe
              src={
                block.src.includes("player.vimeo.com")
                  ? block.src
                  : `https://player.vimeo.com/video/${block.src}`
              }
              title={block.title || "Vimeo video"}
              className="w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
          {block.title && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
              {block.title}
            </p>
          )}
        </div>
      );
    }

    if (block.provider === "other" && block.src) {
      return (
        <div className="my-6">
          <div
            className="w-full"
            dangerouslySetInnerHTML={{ __html: block.src }}
          />
        </div>
      );
    }
  }

  if (isListBlock(block)) {
    const ListTag = block.ordered ? "ol" : "ul";
    return (
      <ListTag
        className={`my-4 ${
          block.ordered ? "list-decimal" : "list-disc"
        } list-inside`}
      >
        {block.items
          .filter((item) => item.trim()) // Filter out empty items when rendering
          .map((item, index) => (
            <li key={index} className="text-gray-700 dark:text-gray-300 mb-2">
              {item}
            </li>
          ))}
      </ListTag>
    );
  }

  if (isCodeBlock(block)) {
    return (
      <div className="my-6">
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
          <code className={block.language ? `language-${block.language}` : ""}>
            {block.code}
          </code>
        </pre>
      </div>
    );
  }

  return null;
};

interface ContentBlocksRendererProps {
  blocks: ContentBlock[];
}

export const ContentBlocksRenderer: React.FC<ContentBlocksRendererProps> = ({
  blocks,
}) => {
  return (
    <div className="space-y-4">
      {blocks
        .sort((a, b) => a.order - b.order)
        .map((block) => (
          <ContentBlockRenderer key={block.id} block={block} />
        ))}
    </div>
  );
};
