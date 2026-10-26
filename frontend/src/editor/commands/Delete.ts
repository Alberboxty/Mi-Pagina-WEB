import type { Editor } from "../core/Editor"
import { deleteText } from "./DeleteText";
import { isSelectionCollapsed } from "../model/SelectionUtils";


export function deleteForward(editor: Editor): void {
    const selection = editor.getSelection();

    if (!selection) {
        return;
    }

    // Cualquier selección expandida (varios inlines o bloques) se borra
    // con insertText(""), que ya sabe hacerlo.
    if (!isSelectionCollapsed(selection)) {
        editor.commands.insertText("");
        return;
    }

    deleteText(editor, 1, "forward");

}