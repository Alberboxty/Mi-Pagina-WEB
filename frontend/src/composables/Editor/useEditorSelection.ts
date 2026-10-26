import type { Editor } from "@/editor/core/Editor";
import type { Position } from "@/editor/model/Selection";

function getParagraph(node: Node | null): HTMLElement | null {
    const element =
        node instanceof Element
            ? node
            : node?.parentElement;

    return element?.closest("[data-block-id]") ?? null;
}

function getAbsoluteOffset(
    paragraph: HTMLElement,
    node: Node,
    nodeOffset: number
): number | null {
    if (node !== paragraph && !paragraph.contains(node)) {
        return null;
    }

    try {
        const range = document.createRange();
        range.selectNodeContents(paragraph);
        range.setEnd(node, nodeOffset);

        return range.toString().length;
    } catch {
        return null;
    }
}

function absoluteOffsetToPosition(
    editor: Editor,
    blockId: string,
    absoluteOffset: number
): Position | null {
    const block = editor.getDocument().blocks.find(
        item => item.id === blockId
    );

    if (!block || block.children.length === 0) {
        return null;
    }

    let remainingOffset = absoluteOffset;

    for (let i = 0; i < block.children.length; i++) {
        const inline = block.children[i];
        const length = inline.text.length;

        if (remainingOffset <= length) {
            return {
                blockId,
                inlineIndex: i,
                offset: remainingOffset
            };
        }

        remainingOffset -= length;
    }

    const lastIndex = block.children.length - 1;

    return {
        blockId,
        inlineIndex: lastIndex,
        offset: block.children[lastIndex].text.length
    };
}

function positionToAbsoluteOffset(
    editor: Editor,
    position: Position
): number | null {
    const block = editor.getDocument().blocks.find(
        item => item.id === position.blockId
    );

    if (
        !block ||
        !Number.isInteger(position.inlineIndex) ||
        position.inlineIndex < 0 ||
        position.inlineIndex >= block.children.length
    ) {
        return null;
    }

    const inline = block.children[position.inlineIndex];

    if (
        !Number.isInteger(position.offset) ||
        position.offset < 0 ||
        position.offset > inline.text.length
    ) {
        return null;
    }

    let absoluteOffset = position.offset;

    for (let i = 0; i < position.inlineIndex; i++) {
        absoluteOffset += block.children[i].text.length;
    }

    return absoluteOffset;
}

function getDomPoint(
    paragraph: HTMLElement,
    absoluteOffset: number
): { node: Node; offset: number } | null {
    const walker = document.createTreeWalker(
        paragraph,
        NodeFilter.SHOW_TEXT
    );

    const textNodes: Text[] = [];
    let currentNode: Node | null;

    while ((currentNode = walker.nextNode())) {
        textNodes.push(currentNode as Text);
    }

    // Bloque vacío (solo contiene <br>): el cursor va en el propio bloque.
    if (textNodes.length === 0) {
        return { node: paragraph, offset: 0 };
    }

    let remainingOffset = Math.max(0, absoluteOffset);

    for (const node of textNodes) {
        const length = node.textContent?.length ?? 0;

        if (remainingOffset <= length) {
            return {
                node,
                offset: remainingOffset
            };
        }

        remainingOffset -= length;
    }

    const lastNode = textNodes[textNodes.length - 1];

    return {
        node: lastNode,
        offset: lastNode.textContent?.length ?? 0
    };
}

export function useEditorSelection(editor: Editor) {
    function updateSelection(): void {
        const browserSelection = window.getSelection();

        if (
            !browserSelection ||
            browserSelection.rangeCount === 0 ||
            !browserSelection.anchorNode ||
            !browserSelection.focusNode
        ) {
            return;
        }

        const anchorParagraph = getParagraph(
            browserSelection.anchorNode
        );

        const focusParagraph = getParagraph(
            browserSelection.focusNode
        );

        if (!anchorParagraph || !focusParagraph) {
            return;
        }

        const anchorBlockId = anchorParagraph.getAttribute(
            "data-block-id"
        );

        const focusBlockId = focusParagraph.getAttribute(
            "data-block-id"
        );

        if (!anchorBlockId || !focusBlockId) {
            return;
        }

        const anchorAbsoluteOffset = getAbsoluteOffset(
            anchorParagraph,
            browserSelection.anchorNode,
            browserSelection.anchorOffset
        );

        const focusAbsoluteOffset = getAbsoluteOffset(
            focusParagraph,
            browserSelection.focusNode,
            browserSelection.focusOffset
        );

        if (
            anchorAbsoluteOffset === null ||
            focusAbsoluteOffset === null
        ) {
            return;
        }

        const anchor = absoluteOffsetToPosition(
            editor,
            anchorBlockId,
            anchorAbsoluteOffset
        );

        const focus = absoluteOffsetToPosition(
            editor,
            focusBlockId,
            focusAbsoluteOffset
        );

        if (!anchor || !focus) {
            return;
        }

        // Conservamos la dirección de la selección original.
        editor.setSelection({ anchor, focus });
    }

    function restoreSelection(): void {
        const selection = editor.getSelection();

        if (!selection) {
            return;
        }

        const editorElement = document.querySelector(
            ".editor-view"
        );

        if (!editorElement) {
            return;
        }

        const anchorAbsoluteOffset = positionToAbsoluteOffset(
            editor,
            selection.anchor
        );

        const focusAbsoluteOffset = positionToAbsoluteOffset(
            editor,
            selection.focus
        );

        if (
            anchorAbsoluteOffset === null ||
            focusAbsoluteOffset === null
        ) {
            return;
        }

        const anchorParagraph = editorElement.querySelector<HTMLElement>(
            `[data-block-id="${CSS.escape(selection.anchor.blockId)}"]`
        );

        const focusParagraph = editorElement.querySelector<HTMLElement>(
            `[data-block-id="${CSS.escape(selection.focus.blockId)}"]`
        );

        if (!anchorParagraph || !focusParagraph) {
            return;
        }

        const anchorPoint = getDomPoint(
            anchorParagraph,
            anchorAbsoluteOffset
        );

        const focusPoint = getDomPoint(
            focusParagraph,
            focusAbsoluteOffset
        );

        if (!anchorPoint || !focusPoint) {
            return;
        }

        const browserSelection = window.getSelection();

        if (!browserSelection) {
            return;
        }

        browserSelection.removeAllRanges();

        if (typeof browserSelection.setBaseAndExtent === "function") {
            browserSelection.setBaseAndExtent(
                anchorPoint.node,
                anchorPoint.offset,
                focusPoint.node,
                focusPoint.offset
            );
        } else {
            const range = document.createRange();

            range.setStart(
                anchorPoint.node,
                anchorPoint.offset
            );

            range.setEnd(
                focusPoint.node,
                focusPoint.offset
            );

            browserSelection.addRange(range);
        }
    }

    return {
        updateSelection,
        restoreSelection
    };
}