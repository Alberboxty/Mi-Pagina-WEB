<script setup lang="ts">
    import { Editor } from '@/editor/core/Editor';

    import EditorView from '@/editor/vue/EditorView.vue';

    const editor = new Editor({
        version: 1,
        blocks: [
            {
                id: "1",
                type: "paragraph" as const,
                children: [
                    {
                        text: 'Hola, este es mi editor.',
                        marks: []
                    }
                ],
                attributes: {}
            }
        ]
    });

</script>

<style>
    .EditorView {
        margin-top: 100px;
    }

</style>

<template>
    <div class="EditorView">
        <h1>Editor de pruebas</h1>
        <EditorView :editor="editor" />
    </div>

</template>