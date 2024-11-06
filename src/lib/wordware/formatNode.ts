import { type Mark } from "@tiptap/pm/model";
import { type Editor } from "@tiptap/react";

export const getContext = (editor: Editor) => {
  const { from, to } = editor.state.selection;

  const content: {
    type: string;
    text: string;
  }[] = [];

  let startPos = from;
  let endPos = to;

  // Find all block nodes that intersect with the selection
  editor.state.doc.nodesBetween(from, to, (node, pos) => {
    if (
      node.type.name === "paragraph" ||
      node.type.name === "heading" ||
      node.type.name === "codeBlock"
    ) {
      // Expand selection to include the entire block
      startPos = Math.min(startPos, pos);
      endPos = Math.max(endPos, pos + node.nodeSize);

      // Get the complete text of this block
      const text = editor.state.doc.textBetween(
        pos,
        pos + node.nodeSize,
        "\n",
        "\n",
      );

      if (text.trim()) {
        content.push({
          type: node.type.name,
          text: text.trim(),
        });
      }
    }
    return true;
  });

  // Get the complete text including all full blocks
  const fullText = editor.state.doc.textBetween(startPos, endPos, "\n", "\n");

  return {
    text: fullText.trim(),
    contentNodes: content,
  };
};

export const getSelection = (editor: Editor): string | null => {
  const { from, to } = editor.state.selection;

  let xmlContent = "";
  let currentParentType: string | null = null;
  let currentParentLevel: number | null = null;

  // Walk through all nodes in the selection
  editor.state.doc.nodesBetween(from, to, (node, pos, parent) => {
    // Track parent type for context
    if (node.isBlock) {
      currentParentType = node.type.name;
      if (node.type.name === "heading") {
        currentParentLevel = (node.attrs as { level: number }).level;
      }
    }

    // Only process text nodes and hard breaks
    if (node.isText || node.type.name === "hardBreak") {
      // Calculate the overlapping content
      const nodeFrom = Math.max(from, pos);
      const nodeTo = Math.min(to, pos + node.nodeSize);

      if (nodeFrom < nodeTo) {
        let content = "";
        if (node.isText) {
          content =
            node.text?.slice(
              Math.max(0, from - pos),
              Math.min(node.nodeSize, to - pos),
            ) ?? "";

          // Apply marks
          if (node.marks.length > 0) {
            content = node.marks.reduce((acc, mark) => {
              return wrapWithMark(acc, mark);
            }, escapeXML(content));
          } else {
            content = escapeXML(content);
          }
        } else {
          content = "<br />";
        }

        // Wrap with parent tag if needed
        if (currentParentType === "heading") {
          content = `<h${currentParentLevel}>${content}</h${currentParentLevel}>`;
        } else if (currentParentType === "paragraph") {
          content = `<p>${content}</p>`;
        } else if (currentParentType === "codeBlock") {
          const language =
            (parent?.attrs as { language?: string })?.language ?? "";
          content = `<code language="${language}">${content}</code>`;
        }

        xmlContent += content;
      }
    }

    return true;
  });

  return xmlContent;
};

const wrapWithMark = (content: string, mark: Mark): string => {
  switch (mark.type.name) {
    case "bold":
      return `<strong>${content}</strong>`;
    case "italic":
      return `<em>${content}</em>`;
    case "code":
      return `<code>${content}</code>`;
    case "strike":
      return `<strike>${content}</strike>`;
    case "underline":
      return `<u>${content}</u>`;
    case "link":
      return `<a href="${mark.attrs.href}">${content}</a>`;
    default:
      return `<${mark.type.name}>${content}</${mark.type.name}>`;
  }
};

const escapeXML = (str: string): string => {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
};
