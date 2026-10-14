import type { Editor } from "../core/Editor";
import { toggleMark } from "./ToggleMark";

export function italic(editor: Editor):void {
    toggleMark(editor, "italic");
}