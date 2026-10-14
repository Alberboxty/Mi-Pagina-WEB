import type { Editor } from "@/editor/core";
import { nextTick } from "vue";
import { useEditorSelection } from "./useEditorSelection";

export function useEditorInput(editor: Editor) {
    const { updateSelection, restoreSelection } = useEditorSelection(editor);

    // readSelection = false en undo/redo: la selección la pone la transacción,
    // no el DOM, y updateSelection() la pisaría.
    async function run(action: () => void, readSelection = true) {
        if (readSelection) {
            updateSelection();
        }

        action();

        await nextTick();
        restoreSelection();
    }

    function undo() {
        return run(() => editor.undo(), false);
    }

    function redo() {
        return run(() => editor.redo(), false);
    }

    function handleBeforeInput(event: InputEvent) {
        switch (event.inputType) {
            case "insertParagraph":
                event.preventDefault();
                return run(() => editor.commands.splitBlock());

            case "insertText": {
                event.preventDefault();
                const text = event.data;
                if (!text) return;
                // true = tecleo normal: se agrupa en el historial.
                return run(() => editor.commands.insertText(text, true));
            }

            case "insertFromPaste": {
                event.preventDefault();
                // Hay que leerlo ahora, antes de cualquier await.
                const text = event.dataTransfer?.getData("text/plain") ?? "";
                if (!text) return;
                // Sin true: el pegado es siempre un paso independiente.
                return run(() => editor.commands.insertText(text));
            }

            case "deleteContentBackward":
                event.preventDefault();
                return run(() => editor.commands.backspace());

            case "deleteContentForward":
                event.preventDefault();
                return run(() => editor.commands.deleteForward());

            // Ctrl+B / Ctrl+I / Ctrl+U: sin esto el navegador aplica el
            // formato por su cuenta y se desincroniza igual que el pegado.
            case "formatBold":
                event.preventDefault();
                return run(() => editor.commands.bold());
            case "formatItalic":
                event.preventDefault();
                return run(() => editor.commands.italic());
            case "formatUnderline":
                event.preventDefault();
                return run(() => editor.commands.underline());
            case "formatStrikeThrough":
                event.preventDefault();
                return run(() => editor.commands.strikethrough());

            case "historyUndo":
                event.preventDefault();
                return undo();
            case "historyRedo":
                event.preventDefault();
                return redo();
        }
    }

    function handleKeyDown(event: KeyboardEvent) {
        if (!(event.ctrlKey || event.metaKey) || event.altKey) return;

        const key = event.key.toLowerCase();

        if (key === "z" && !event.shiftKey) {
            event.preventDefault();
            undo();
        } else if (key === "y" || (key === "z" && event.shiftKey)) {
            event.preventDefault();
            redo();
        }
    }

    return { handleBeforeInput, handleKeyDown, undo, redo };
}