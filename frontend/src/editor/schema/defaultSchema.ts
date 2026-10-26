import { createSchema, type BlockSpec, type MarkSpec } from "./Schema";
import { escapeHtml } from "./escapeHtml";

export const paragraph: BlockSpec = {
    name: "paragraph",
    render: (content, block) =>
        `<p data-block-id="${escapeHtml(block.id)}">${content}</p>`
};

export const italic: MarkSpec = {
    name: "italic",
    render: inner => `<em>${inner}</em>`
};

export const bold: MarkSpec = {
    name: "bold",
    render: inner => `<strong>${inner}</strong>`
};

export const underline: MarkSpec = {
    name: "underline",
    render: inner => `<u>${inner}</u>`
};

export const strikethrough: MarkSpec = {
    name: "strikethrough",
    render: inner => `<s>${inner}</s>`
};

export const defaultSchema = createSchema({
    blocks: [paragraph],
    marks: [italic, bold, underline, strikethrough]
});