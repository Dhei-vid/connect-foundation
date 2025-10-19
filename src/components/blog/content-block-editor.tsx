"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/form-field";
import { TextareaField } from "@/components/ui/form-field";
import { SelectField } from "@/components/ui/form-field";
import { SelectItem } from "@/components/ui/select";
import { ImagePicker } from "@/components/ui/image-picker";
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
import {
  Trash2,
  Type,
  FileText,
  Image as ImageIcon,
  Quote,
  Video,
  List,
  Code,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Type guard functions
const isHeadingBlock = (block: ContentBlock): block is HeadingBlock =>
  block.type === "heading";
const isParagraphBlock = (block: ContentBlock): block is ParagraphBlock =>
  block.type === "paragraph";
const isImageBlock = (block: ContentBlock): block is ImageBlock =>
  block.type === "image";
const isQuoteBlock = (block: ContentBlock): block is QuoteBlock =>
  block.type === "quote";
const isEmbedBlock = (block: ContentBlock): block is EmbedBlock =>
  block.type === "embed";
const isListBlock = (block: ContentBlock): block is ListBlock =>
  block.type === "list";
const isCodeBlock = (block: ContentBlock): block is CodeBlock =>
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

const CONTENT_BLOCK_TYPES = [
  { value: "heading", label: "Heading", icon: Type },
  { value: "paragraph", label: "Paragraph", icon: FileText },
  { value: "image", label: "Image", icon: ImageIcon },
  { value: "quote", label: "Quote", icon: Quote },
  { value: "embed", label: "Video/Embed", icon: Video },
  { value: "list", label: "List", icon: List },
  { value: "code", label: "Code", icon: Code },
];

const HEADING_LEVELS = [
  { value: "1", label: "H1" },
  { value: "2", label: "H2" },
  { value: "3", label: "H3" },
  { value: "4", label: "H4" },
];

const CODE_LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "css", label: "CSS" },
  { value: "html", label: "HTML" },
  { value: "json", label: "JSON" },
  { value: "markdown", label: "Markdown" },
  { value: "bash", label: "Bash" },
  { value: "sql", label: "SQL" },
];

interface ContentBlockEditorProps {
  block: ContentBlock;
  index: number;
  onUpdate: (
    index: number,
    field: string,
    value: string | number | boolean | string[]
  ) => void;
  onRemove: (index: number) => void;
}

export const ContentBlockEditor: React.FC<ContentBlockEditorProps> = ({
  block,
  index,
  onUpdate,
  onRemove,
}) => {
  const getBlockIcon = (type: string) => {
    const blockType = CONTENT_BLOCK_TYPES.find((t) => t.value === type);
    return blockType?.icon || Type;
  };

  const Icon = getBlockIcon(block.type);

  return (
    <div className="border rounded-lg p-4 space-y-4 bg-white dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-main-600" />
          <h4 className="font-medium capitalize">{block.type} Block</h4>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button type="button" variant="destructive" size="sm">
              <Trash2 className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Content Block</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove this {block.type} block? This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onRemove(index)}
                className="bg-red-600 hover:bg-red-700"
              >
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {isHeadingBlock(block) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            label="Heading Level"
            value={block.level?.toString() || "2"}
            onValueChange={(value) =>
              onUpdate(index, "level", parseInt(value) as 1 | 2 | 3 | 4)
            }
            placeholder="Select heading level"
          >
            {HEADING_LEVELS.map((level) => (
              <SelectItem key={level.value} value={level.value}>
                {level.label}
              </SelectItem>
            ))}
          </SelectField>
          <InputField
            label="Heading Text"
            value={block.text || ""}
            onChange={(e) => onUpdate(index, "text", e.target.value)}
            placeholder="Enter heading text"
          />
        </div>
      )}

      {isParagraphBlock(block) && (
        <TextareaField
          label="Paragraph Text"
          value={block.text || ""}
          onChange={(e) => onUpdate(index, "text", e.target.value)}
          placeholder="Enter paragraph text"
          rows={4}
        />
      )}

      {isImageBlock(block) && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Image</label>
            <ImagePicker
              value={block.image || ""}
              onChange={(imageUrl) => onUpdate(index, "image", imageUrl)}
              placeholder="Enter image URL or upload a file"
              showPreview={false}
            />
          </div>

          {/* Image Preview */}
          {block.image && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Preview</label>
              <div className="relative w-full h-48 border rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={block.image}
                  alt={block.alt || block.caption || "Content image"}
                  fill
                  className="object-contain object-center"
                  onError={() => {
                    // Handle error if needed
                  }}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Caption"
              value={block.caption || ""}
              onChange={(e) => onUpdate(index, "caption", e.target.value)}
              placeholder="Image caption (optional)"
            />
            <InputField
              label="Alt Text"
              value={block.alt || ""}
              onChange={(e) => onUpdate(index, "alt", e.target.value)}
              placeholder="Alt text for accessibility"
            />
          </div>
        </div>
      )}

      {isQuoteBlock(block) && (
        <div className="space-y-4">
          <TextareaField
            label="Quote Text"
            value={block.text || ""}
            onChange={(e) => onUpdate(index, "text", e.target.value)}
            placeholder="Enter quote text"
            rows={3}
          />
          <InputField
            label="Citation"
            value={block.cite || ""}
            onChange={(e) => onUpdate(index, "cite", e.target.value)}
            placeholder="Quote source (optional)"
          />
        </div>
      )}

      {isEmbedBlock(block) && (
        <div className="space-y-4">
          <SelectField
            label="Provider"
            value={block.provider || ""}
            onValueChange={(value) => onUpdate(index, "provider", value)}
            placeholder="Select provider"
          >
            <SelectItem value="youtube">YouTube</SelectItem>
            <SelectItem value="vimeo">Vimeo</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectField>

          <InputField
            label={
              block.provider === "youtube"
                ? "YouTube Video ID or URL"
                : block.provider === "vimeo"
                ? "Vimeo Video ID or URL"
                : "Embed URL"
            }
            value={block.src || ""}
            onChange={(e) => onUpdate(index, "src", e.target.value)}
            placeholder={
              block.provider === "youtube"
                ? "e.g., dQw4w9WgXcQ or https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                : block.provider === "vimeo"
                ? "e.g., 123456789 or https://vimeo.com/123456789"
                : "Embed URL or iframe src"
            }
          />

          <InputField
            label="Title"
            value={block.title || ""}
            onChange={(e) => onUpdate(index, "title", e.target.value)}
            placeholder="Video title (optional)"
          />

          {/* YouTube Preview */}
          {block.provider === "youtube" && block.src && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Preview</label>
              <div className="relative w-full aspect-video border rounded-lg overflow-hidden bg-gray-100">
                <iframe
                  src={`https://www.youtube.com/embed/${extractYouTubeId(
                    block.src
                  )}`}
                  title={block.title || "YouTube video preview"}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Vimeo Preview */}
          {block.provider === "vimeo" && block.src && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Preview</label>
              <div className="relative w-full aspect-video border rounded-lg overflow-hidden bg-gray-100">
                <iframe
                  src={
                    block.src.includes("player.vimeo.com")
                      ? block.src
                      : `https://player.vimeo.com/video/${block.src}`
                  }
                  title={block.title || "Vimeo video preview"}
                  className="w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Generic Embed Preview */}
          {block.provider === "other" && block.src && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Embed Code Preview</label>
              <div className="p-3 bg-gray-50 dark:bg-gray-700 border rounded-lg text-sm text-gray-700 dark:text-gray-300 font-mono">
                {block.src}
              </div>
            </div>
          )}
        </div>
      )}

      {isListBlock(block) && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`ordered-${index}`}
              checked={block.ordered || false}
              onChange={(e) => onUpdate(index, "ordered", e.target.checked)}
              className="rounded"
            />
            <label htmlFor={`ordered-${index}`} className="text-sm">
              Ordered list
            </label>
          </div>
          <TextareaField
            label="List Items"
            value={block.items?.join("\n") || ""}
            onChange={(e) =>
              onUpdate(index, "items", e.target.value.split("\n"))
            }
            placeholder="List items (one per line)"
            rows={4}
          />
        </div>
      )}

      {isCodeBlock(block) && (
        <div className="space-y-4">
          <SelectField
            label="Language"
            value={block.language || ""}
            onValueChange={(value) => onUpdate(index, "language", value)}
            placeholder="Select language"
          >
            {CODE_LANGUAGES.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectField>
          <TextareaField
            label="Code"
            value={block.code || ""}
            onChange={(e) => onUpdate(index, "code", e.target.value)}
            placeholder="Enter code"
            rows={6}
          />
        </div>
      )}
    </div>
  );
};

interface ContentBlocksEditorProps {
  blocks: ContentBlock[];
  onAddBlock: (type: ContentBlock["type"]) => void;
  onUpdateBlock: (
    index: number,
    field: string,
    value: string | number | boolean | string[]
  ) => void;
  onRemoveBlock: (index: number) => void;
}

export const ContentBlocksEditor: React.FC<ContentBlocksEditorProps> = ({
  blocks,
  onAddBlock,
  onUpdateBlock,
  onRemoveBlock,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-main-600" />
          <h2 className="text-xl font-semibold">Content</h2>
        </div>
        <SelectField
          value=""
          onValueChange={(value) => onAddBlock(value as ContentBlock["type"])}
          placeholder="Add content block"
        >
          {CONTENT_BLOCK_TYPES.map((type) => {
            const Icon = type.icon;
            return (
              <SelectItem key={type.value} value={type.value}>
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {type.label}
                </div>
              </SelectItem>
            );
          })}
        </SelectField>
      </div>

      {blocks.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No content blocks yet. Add your first block to get started.</p>
        </div>
      )}

      <div className="space-y-4">
        {blocks
          .sort((a, b) => a.order - b.order)
          .map((block, index) => (
            <ContentBlockEditor
              key={block.id}
              block={block}
              index={index}
              onUpdate={onUpdateBlock}
              onRemove={onRemoveBlock}
            />
          ))}
      </div>
    </div>
  );
};
