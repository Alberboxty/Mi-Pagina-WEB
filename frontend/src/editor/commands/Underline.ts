import type { Editor } from "../core/Editor";
import { toggleMark } from "./ToggleMark";

export function underline(editor: Editor):void {
    toggleMark(editor, "underline");
}