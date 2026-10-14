<script setup lang="ts">
    import { onMounted, onUnmounted, reactive, ref, nextTick } from 'vue';

    import type { Editor } from '../core/Editor';
    import type { Inline } from '../model/Inline';

    import { getOrderedSelection } from '../model/SelectionUtils';
    import { toggleMark } from '../commands/ToggleMark';
    import { useEditorSelection } from '@/composables/Editor/useEditorSelection';
    import { useEditorInput } from '@/composables/Editor/useEditorInput';

    const props = defineProps<{
        editor: Editor;
    }>();

    // Gestión de la selección del editor.
    const { updateSelection, restoreSelection } = useEditorSelection(props.editor);

    // Mismo undo/redo que usan los atajos de teclado.
    const { undo, redo } = useEditorInput(props.editor);

    const markTypes = [
        'bold',
        'italic',
        'underline',
        'strikethrough'
    ] as const;

    type MarkType = typeof markTypes[number];

    const activeMarks = reactive<Record<MarkType, boolean>>({
        bold: false,
        italic: false,
        underline: false,
        strikethrough: false
    });

    // canUndo/canRedo no son reactivos en el editor, así que los copiamos aquí.
    const canUndo = ref(false);
    const canRedo = ref(false);

    let unsubscribe: (() => void) | null = null;

    function getSelectedInlines(): Inline[] {
        const document = props.editor.getDocument();
        const selection = props.editor.getSelection();

        if (!selection) {
            return [];
        }

        const ordered = getOrderedSelection(document, selection);

        if (!ordered) {
            return [];
        }

        const { anchor, focus } = ordered;

        const startBlockIndex = document.blocks.findIndex(
            block => block.id === anchor.blockId
        );

        const endBlockIndex = document.blocks.findIndex(
            block => block.id === focus.blockId
        );

        if (
            startBlockIndex === -1 ||
            endBlockIndex === -1 ||
            startBlockIndex > endBlockIndex
        ) {
            return [];
        }

        // Si el cursor está contraído, comprobamos el formato
        // del Inline en el que se encuentra.
        const collapsed =
            anchor.blockId === focus.blockId &&
            anchor.inlineIndex === focus.inlineIndex &&
            anchor.offset === focus.offset;

        if (collapsed) {
            const block = document.blocks[startBlockIndex];
            const inline = block.children[anchor.inlineIndex];

            return inline ? [inline] : [];
        }

        const selected: Inline[] = [];

        for (
            let blockIndex = startBlockIndex;
            blockIndex <= endBlockIndex;
            blockIndex++
        ) {
            const block = document.blocks[blockIndex];

            const firstInlineIndex =
                blockIndex === startBlockIndex
                    ? anchor.inlineIndex
                    : 0;

            const lastInlineIndex =
                blockIndex === endBlockIndex
                    ? focus.inlineIndex
                    : block.children.length - 1;

            for (
                let inlineIndex = firstInlineIndex;
                inlineIndex <= lastInlineIndex;
                inlineIndex++
            ) {
                const inline = block.children[inlineIndex];

                if (!inline) {
                    continue;
                }

                const start =
                    blockIndex === startBlockIndex &&
                    inlineIndex === anchor.inlineIndex
                        ? anchor.offset
                        : 0;

                const end =
                    blockIndex === endBlockIndex &&
                    inlineIndex === focus.inlineIndex
                        ? focus.offset
                        : inline.text.length;

                if (end > start) {
                    selected.push(inline);
                }
            }
        }

        return selected;
    }

    function refreshToolbar(): void {
        const selectedInlines = getSelectedInlines();

        for (const markType of markTypes) {
            activeMarks[markType] =
                selectedInlines.length > 0 &&
                selectedInlines.every(inline =>
                    inline.marks.some(mark => mark.type === markType)
                );
        }

        canUndo.value = props.editor.canUndo();
        canRedo.value = props.editor.canRedo();
    }

    async function applyMark(markType: MarkType): Promise<void> {
        // 1. Guardamos la selección real del navegador en el editor.
        updateSelection();

        // 2. Aplicamos o quitamos la marca en el modelo.
        toggleMark(props.editor, markType);

        // 3. Esperamos a que Vue actualice el HTML del editor.
        await nextTick();

        // 4. Restauramos la selección para poder seguir editando.
        restoreSelection();

        // 5. Actualizamos el estado visual de los botones.
        refreshToolbar();
    }

    async function handleUndo(): Promise<void> {
        await undo();
        refreshToolbar();
    }

    async function handleRedo(): Promise<void> {
        await redo();
        refreshToolbar();
    }

    function handleSelectionChange(): void {
        refreshToolbar();
    }

    onMounted(() => {
        unsubscribe = props.editor.subscribe(refreshToolbar);

        document.addEventListener(
            'selectionchange',
            handleSelectionChange
        );

        refreshToolbar();
    });

    onUnmounted(() => {
        unsubscribe?.();

        document.removeEventListener(
            'selectionchange',
            handleSelectionChange
        );
    });
</script>

<template>
    <div
        class="editor-toolbar"
        role="toolbar"
        aria-label="Formato de texto"
    >
        <button
            type="button"
            title="Deshacer (Ctrl+Z)"
            aria-label="Deshacer"
            :disabled="!canUndo"
            @mousedown.prevent
            @click="handleUndo"
        >
            ↶
        </button>

        <button
            type="button"
            title="Rehacer (Ctrl+Y)"
            aria-label="Rehacer"
            :disabled="!canRedo"
            @mousedown.prevent
            @click="handleRedo"
        >
            ↷
        </button>

        <span class="separator" aria-hidden="true"></span>

        <button
            type="button"
            title="Negrita"
            aria-label="Negrita"
            :class="{ active: activeMarks.bold }"
            :aria-pressed="activeMarks.bold"
            @mousedown.prevent
            @click="applyMark('bold')"
        >
            <strong>B</strong>
        </button>

        <button
            type="button"
            title="Cursiva"
            aria-label="Cursiva"
            :class="{ active: activeMarks.italic }"
            :aria-pressed="activeMarks.italic"
            @mousedown.prevent
            @click="applyMark('italic')"
        >
            <em>I</em>
        </button>

        <button
            type="button"
            title="Subrayado"
            aria-label="Subrayado"
            :class="{ active: activeMarks.underline }"
            :aria-pressed="activeMarks.underline"
            @mousedown.prevent
            @click="applyMark('underline')"
        >
            <u>U</u>
        </button>

        <button
            type="button"
            title="Tachado"
            aria-label="Tachado"
            :class="{ active: activeMarks.strikethrough }"
            :aria-pressed="activeMarks.strikethrough"
            @mousedown.prevent
            @click="applyMark('strikethrough')"
        >
            <s>S</s>
        </button>
    </div>
</template>

<style scoped lang="scss">
    .editor-toolbar {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 8px;
        border: 1px solid #d1d5db;
        border-radius: 8px 8px 0 0;
        background: #f9fafb;

        .separator {
            width: 1px;
            height: 20px;
            margin: 0 4px;
            background: #d1d5db;
        }

        button {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            border: 1px solid transparent;
            border-radius: 5px;
            background: transparent;
            color: #374151;
            font-size: 16px;
            cursor: pointer;
            transition:
                background-color 0.15s ease,
                color 0.15s ease;

            &:hover:not(:disabled) {
                background: #e5e7eb;
            }

            &:disabled {
                color: #9ca3af;
                opacity: 0.5;
                cursor: default;
            }

            &.active {
                background: #dbeafe;
                border-color: #93c5fd;
                color: #1d4ed8;
            }

            &:focus-visible {
                outline: 2px solid #2563eb;
                outline-offset: 2px;
            }
        }
    }
</style>