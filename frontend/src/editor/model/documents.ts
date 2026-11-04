import type { Document } from "./Document";
// import type { Block } from "./Block";

export function createEmptyDocument(): Document {
    return {
        version: 1,
        blocks: [
            {
                id: crypto.randomUUID(),
                type: "paragraph",
                children: [
                    {
                        text: "",
                        marks: []
                    }
                ]
            }
        ]
    };
}

export function textToDocument(text: string): Document {
    return {
        version: 1,
        blocks: text.split(/\r\n|\r|\n/).map(line => ({
            id: crypto.randomUUID(),
            type: "paragraph",
            children: [
                {
                    text: line,
                    marks: []
                }
            ]
        }))
    };
}