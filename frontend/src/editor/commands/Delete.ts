import type { Editor } from "../core/Editor"
import { deleteText } from "./DeleteText";


export function deleteForward(editor: Editor): void {
    const selection = editor.getSelection();

    if (!selection) {
        return;
    }

    if (
        selection.anchor.blockId === selection.focus.blockId &&
        selection.anchor.inlineIndex === selection.focus.inlineIndex &&
        selection.anchor.offset !== selection.focus.offset
    ) {
        deleteText(editor, 0, "forward");
        return;
    }

    deleteText(editor, 1, "forward");

}