import { Transaction } from "./Transaction";

export class History {
    private undoStack: Transaction[] = [];
    private redoStack: Transaction[] = [];

    private lastKey: string | null = null;
    private lastTime = 0;

    private readonly limit = 200;
    private readonly mergeWindowMs = 800;

    public push(transaction: Transaction, mergeKey?: string): void {
        const now = Date.now();
        const last = this.undoStack[this.undoStack.length - 1];

        const canMerge =
            mergeKey !== undefined &&
            last !== undefined &&
            mergeKey === this.lastKey &&
            now - this.lastTime < this.mergeWindowMs;

        if (canMerge) {
            // Conserva el "antes" del primer paso y el "después" del último.
            this.undoStack[this.undoStack.length - 1] = new Transaction(
                last.before,
                transaction.after,
                last.selectionBefore,
                transaction.selectionAfter
            );
        } else {
            this.undoStack.push(transaction);

            if (this.undoStack.length > this.limit) {
                this.undoStack.shift();
            }
        }

        this.lastKey = mergeKey ?? null;
        this.lastTime = now;
        this.redoStack = [];
    }

    public canUndo(): boolean {
        return this.undoStack.length > 0;
    }

    public canRedo(): boolean {
        return this.redoStack.length > 0;
    }

    public undo(): Transaction | null {
        const transaction = this.undoStack.pop();

        if (!transaction) {
            return null;
        }

        this.redoStack.push(transaction);
        this.lastKey = null;

        return transaction;
    }

    public redo(): Transaction | null {
        const transaction = this.redoStack.pop();

        if (!transaction) {
            return null;
        }

        this.undoStack.push(transaction);
        this.lastKey = null;

        return transaction;
    }

    public clear(): void {
        this.undoStack = [];
        this.redoStack = [];
        this.lastKey = null;
    }
}