import type { Editor } from "../core/Editor";
import { toggleMark } from "./ToggleMark";

export function bold(editor: Editor):void {
    toggleMark(editor, "bold");
}