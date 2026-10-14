import type { Editor } from "../core/Editor";
import { toggleMark } from "./ToggleMark";

export function strikethrough(editor: Editor):void {
    toggleMark(editor, "strikethrough");
}