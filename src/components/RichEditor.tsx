"use client";

import { useRef, useCallback } from "react";

interface RichEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export default function RichEditor({ value, onChange }: RichEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  const exec = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    onChange(editorRef.current?.innerHTML || "");
  }, [onChange]);

  const handleInput = useCallback(() => {
    onChange(editorRef.current?.innerHTML || "");
  }, [onChange]);

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-gray-50 border-b border-gray-300">
        <button type="button" onClick={() => exec("formatBlock", "<h2>")} className="px-2 py-1 text-sm font-bold text-gray-700 hover:bg-gray-200 rounded" title="Heading">H2</button>
        <button type="button" onClick={() => exec("formatBlock", "<h3>")} className="px-2 py-1 text-sm font-bold text-gray-700 hover:bg-gray-200 rounded" title="Subheading">H3</button>
        <span className="w-px h-5 bg-gray-300 mx-1" />
        <button type="button" onClick={() => exec("bold")} className="px-2 py-1 text-sm font-bold text-gray-700 hover:bg-gray-200 rounded" title="Bold">B</button>
        <button type="button" onClick={() => exec("italic")} className="px-2 py-1 text-sm italic text-gray-700 hover:bg-gray-200 rounded" title="Italic">I</button>
        <button type="button" onClick={() => exec("underline")} className="px-2 py-1 text-sm underline text-gray-700 hover:bg-gray-200 rounded" title="Underline">U</button>
        <span className="w-px h-5 bg-gray-300 mx-1" />
        <button type="button" onClick={() => exec("insertUnorderedList")} className="px-2 py-1 text-sm text-gray-700 hover:bg-gray-200 rounded" title="Bullet List">• List</button>
        <button type="button" onClick={() => exec("insertOrderedList")} className="px-2 py-1 text-sm text-gray-700 hover:bg-gray-200 rounded" title="Numbered List">1. List</button>
        <span className="w-px h-5 bg-gray-300 mx-1" />
        <button type="button" onClick={() => {
          const url = prompt("Enter link URL:");
          if (url) exec("createLink", url);
        }} className="px-2 py-1 text-sm text-gray-700 hover:bg-gray-200 rounded" title="Insert Link">🔗 Link</button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        className="min-h-[400px] p-4 text-sm focus:outline-none prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </div>
  );
}
