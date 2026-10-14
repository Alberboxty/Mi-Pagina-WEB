import type { Editor } from "../core/Editor";

import { splitBlock } from "./SplitBlock";
import { insertText } from "./InsertText";
import { deleteText } from "./DeleteText";
import { backspace } from "./Backspace";

import {bold} from "./Bold";
import {italic} from "./Italic";
import {underline} from "./Underline";
import {strikethrough} from "./Strikethrough";
import { deleteForward } from "./Delete";

export class Commands {
    constructor(private editor: Editor) {}

    splitBlock(): void {
        splitBlock(this.editor);
    }

    insertText(text: string, typing = false): void {
        insertText(this.editor, text, typing);
    }

    deleteText(length: number, direction: "backward" | "forward" = "backward"): void {
        deleteText(this.editor, length, direction);
    }

    deleteForward(): void {
        deleteForward(this.editor);
    }



    backspace(): void {
        backspace(this.editor);
    }

    bold(): void {
        bold(this.editor);
    }

    italic(): void {
        italic(this.editor);
    }

    underline(): void {
        underline(this.editor);
    }

    strikethrough(): void {
        strikethrough(this.editor);
    }
}