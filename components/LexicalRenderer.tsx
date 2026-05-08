import { JSX } from "react";
import { slugify } from "@/lib/api";

interface LexicalNode {
   type: string;
   children?: LexicalNode[];
   text?: string;
   format?: number;
   tag?: string;
   mode?: string;
   listType?: string;
   [key: string]: any;
}

interface LexicalContent {
   root: LexicalNode;
}

const styles = {
   empty: {
      color: "#6B6B7A",
   },
   container: {
      maxWidth: "none",
      color: "#1C1C27",
      fontSize: 16,
      lineHeight: 1.8,
   },
   paragraph: {
      margin: "0 0 16px",
      lineHeight: 1.8,
   },
   quote: {
      borderLeft: "4px solid #E8323C",
      paddingLeft: 16,
      margin: "24px 0",
      fontStyle: "italic" as const,
      color: "#6B6B7A",
   },
   rule: {
      margin: "32px 0",
      border: "none",
      borderTop: "1px solid #D8D4CC",
   },
   bulletList: {
      margin: "0 0 16px",
      paddingLeft: 24,
      listStyleType: "disc" as const,
   },
   numberList: {
      margin: "0 0 16px",
      paddingLeft: 24,
      listStyleType: "decimal" as const,
   },
   listItem: {
      marginBottom: 8,
   },
};

function renderTextNode(node: LexicalNode) {
   if (typeof node.text !== "string") return null;

   // Normalize line-ending/control chars from API payloads before rendering.
   const text = node.text.replace(/\r/g, "").replace(/---/g, "");
   const trimmed = text.trim();
   if (!trimmed) return null;


   // Handle different text formats
   // format: 0 = normal, 1 = bold, 2 = italic, 3 = bold+italic
   if (node.format === 1) {
      return <strong key={Math.random()}>{text}</strong>;
   } else if (node.format === 2) {
      return <em key={Math.random()}>{text}</em>;
   } else if (node.format === 3) {
      return (
         <strong key={Math.random()}>
            <em>{text}</em>
         </strong>
      );
   }

   return text;
}

function renderNode(node: LexicalNode, index: number): React.ReactNode {
   if (!node) return null;

   // Text node
   if (node.type === "text") {
      return renderTextNode(node);
   }

   // Paragraph
   if (node.type === "paragraph") {
      return (
         <p key={index} style={styles.paragraph}>
            {node.children?.map((child, i) => renderNode(child, i))}
         </p>
      );
   }

   // Headings
   if (node.type === "heading") {
      const Tag = node.tag as keyof JSX.IntrinsicElements;
      const style =
         node.tag === "h1"
            ? { fontSize: 40, fontWeight: 700, margin: "32px 0 24px", lineHeight: 1.1 }
            : node.tag === "h2"
              ? { fontSize: 32, fontWeight: 700, margin: "24px 0 16px", lineHeight: 1.15 }
              : node.tag === "h3"
                ? { fontSize: 28, fontWeight: 700, margin: "24px 0 16px", lineHeight: 1.2 }
                : { fontSize: 24, fontWeight: 700, margin: "16px 0 12px", lineHeight: 1.25 };

      const headingText = (node.children ?? [])
         .map((c: LexicalNode) => (c.type === "text" ? c.text ?? "" : ""))
         .join("")
         .trim();

      return (
         <Tag key={index} id={headingText ? slugify(headingText) : undefined} style={style}>
            {node.children?.map((child, i) => renderNode(child, i))}
         </Tag>
      );
   }

   // Quote
   if (node.type === "quote") {
      return (
         <blockquote key={index} style={styles.quote}>
            {node.children?.map((child, i) => renderNode(child, i))}
         </blockquote>
      );
   }

   // Horizontal rule
   if (node.type === "horizontalrule") {
      return <hr key={index} style={styles.rule} />;
   }

   // Lists
   if (node.type === "list") {
      const ListTag = node.listType === "bullet" ? "ul" : "ol";
      const listStyle =
         node.listType === "bullet"
            ? styles.bulletList
            : styles.numberList;
      return (
         <ListTag key={index} style={listStyle}>
            {node.children?.map((child, i) => renderNode(child, i))}
         </ListTag>
      );
   }

   // List items
   if (node.type === "listitem") {
      const children = (node.children ?? [])
         .map((child, i) => renderNode(child, i))
         .filter((child) => child !== null && child !== undefined);

      if (children.length === 0) return null;

      return (
         <li key={index} style={styles.listItem}>
            {children}
         </li>
      );
   }

   // Root node
   if (node.type === "root") {
      return <>{node.children?.map((child, i) => renderNode(child, i))}</>;
   }

   // Fallback for unknown nodes
   return null;
}

export default function LexicalRenderer({ content, skipH1 = false }: { content: LexicalContent; skipH1?: boolean }) {
   if (!content || !content.root) {
      return <p style={styles.empty}>No content available.</p>;
   }

   const children = skipH1
      ? (content.root.children ?? []).filter((n) => !(n.type === "heading" && n.tag === "h1"))
      : content.root.children;

   const filteredRoot = { ...content.root, children };
   return <div style={styles.container}>{renderNode(filteredRoot, 0)}</div>;
}
