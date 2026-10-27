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

    function isSelectionInList(): boolean {
        updateSelection();

        const selection = editor.getSelection();
        if (!selection) return false;

        const block = editor
            .getDocument()
            .blocks.find(b => b.id === selection.anchor.blockId);

        return block?.type === "list-item";
    }

    function handleBeforeInput(event: InputEvent) {
        switch (event.inputType) {
            case "insertParagraph":
            case "insertLineBreak": // Shift+Enter: por ahora igual que Enter
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
            case "deleteWordBackward": // por ahora borra un carácter
                event.preventDefault();
                return run(() => editor.commands.backspace());

            case "deleteContentForward":
            case "deleteWordForward": // por ahora borra un carácter
                event.preventDefault();
                return run(() => editor.commands.deleteForward());

            // Ctrl+X: con selección activa, insertText("") la borra.
            case "deleteByCut":
                event.preventDefault();
                return run(() => editor.commands.insertText(""));

            // Sin soporte por ahora: se bloquean para que el DOM
            // no se desincronice del modelo.
            case "insertFromDrop":
            case "deleteByDrag":
            case "insertReplacementText":
                event.preventDefault();
                return;

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
        if (event.key === "Tab" && !event.ctrlKey && !event.metaKey && !event.altKey) {
            const inList = isSelectionInList();

            // Fuera de una lista, Tab sigue moviendo el foco (accesibilidad).
            if (!inList) return;

            event.preventDefault();
            run(() => (event.shiftKey ? editor.commands.outdent() : editor.commands.indent()));
            return;
        }

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