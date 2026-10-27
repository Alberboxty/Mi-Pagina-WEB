<script setup lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue';
    import { Editor } from '../core/Editor';

    import EditorToolbar from './EditorToolbar.vue';

    import  {useEditorSelection} from "@/composables/Editor/useEditorSelection";
    import { useEditorInput } from '@/composables/Editor/useEditorInput';

    const props = defineProps<{
        editor: Editor;
    }>();

    const html = ref(props.editor.render())

    let unsubscribe: (() => void) | null = null;

    const {
        updateSelection
    } = useEditorSelection(props.editor);

    const {
        handleBeforeInput,
        handleKeyDown
    } = useEditorInput(props.editor);

    onMounted(() => {
        unsubscribe = props.editor.subscribe(() => {
            html.value = props.editor.render();
        })
    });

    onUnmounted(() => {
        unsubscribe?.();
    });

</script>

<template>
    <div class="editor-container">
        <EditorToolbar :editor="props.editor" />

        <div 
            class="editor-view"
            contenteditable="true"
            v-html="html"
            @keyup="updateSelection"
            @mouseup="updateSelection"
            @keydown="handleKeyDown"
            @beforeinput="handleBeforeInput"
        ></div>
    </div>
</template>

<style scoped lang="scss">
    .editor-container {
        margin-top: 24px;
        .editor-view {
            min-height: 180px;
            padding: 16px;
            border: 1px solid #d1d5db;
            border-top: none;
            border-radius: 0 0 8px 8px;
            outline: none;
            background: white;
            color: #111827;

            &:focus {
                border-color: #9ca3af;
            }
        }
        .editor-view :deep(ul), .editor-view :deep(ol) {
            margin: 0;
            padding-left: 1.5rem;
        }

        .editor-view :deep(li.level-1) { margin-left: 1.5rem; }
        .editor-view :deep(li.level-2) { margin-left: 3rem; }
        .editor-view :deep(li.level-3) { margin-left: 4.5rem; }
        .editor-view :deep(li.level-4) { margin-left: 6rem; }
        .editor-view :deep(li.level-5) { margin-left: 7.5rem; }

    }

    
</style>