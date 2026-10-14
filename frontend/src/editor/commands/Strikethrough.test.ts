import { describe, it, expect} from "vitest";

import { Editor } from "../core/Editor"

import { strikethrough } from "./Strikethrough";

describe("Strikethrough", () => {
    it("Activa un strikethrough en el texto seleccionado", () => {
        const editor = new Editor();

        editor.setDocument({
            version: 1,
            blocks: [
                {
                    id: "1",
                    type: "paragraph" as const,
                    children: [
                        {
                            text: "Hola mundo",
                            marks: []
                        }
                    ],
                    attributes: {}
                }
            ]
        });

        editor.setSelection({
            anchor: {
                blockId: "1",
                inlineIndex: 0,
                offset: 0
            },
            focus: {
                blockId: "1",
                inlineIndex: 0,
                offset: 10
            }
        });

        strikethrough(editor);

        const children = editor.getDocument().blocks[0].children;

        expect(children).toHaveLength(1);

        expect(children[0]).toEqual(
            {   
                text: "Hola mundo",
                marks: [
                    {
                        type: "strikethrough"
                    }
                ]
            }
        );
    });
});