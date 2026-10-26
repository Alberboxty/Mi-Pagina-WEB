import type { Block } from "../model/Block";

export interface MarkSpec {
    name: string;
    /** Envuelve el contenido ya escapado. */
    render: (inner: string) => string;
}

export interface BlockSpec {
    name: string;
    /**
     * Valida los atributos de un bloque que no son de fiar.
     * Devuelve una copia limpia (solo claves conocidas) o null si no son válidos.
     * Si no se define, el bloque solo admite atributos vacíos.
     */
    validateAttributes?: (raw: unknown) => Record<string, unknown> | null;
    /** Recibe el contenido de los inlines ya renderizado y escapado. */
    render: (content: string, block: Block) => string;
}

export interface SchemaConfig {
    blocks: BlockSpec[];
    marks: MarkSpec[];
}

export class Schema {
    // Map y no objeto: buscar "__proto__" o "constructor" no devuelve nada.
    private readonly blocks = new Map<string, BlockSpec>();
    private readonly marks = new Map<string, MarkSpec>();

    constructor(config: SchemaConfig) {
        for (const spec of config.blocks) {
            this.blocks.set(spec.name, spec);
        }

        for (const spec of config.marks) {
            this.marks.set(spec.name, spec);
        }
    }

    public hasBlock(name: string): boolean {
        return this.blocks.has(name);
    }

    public hasMark(name: string): boolean {
        return this.marks.has(name);
    }

    public getBlock(name: string): BlockSpec | undefined {
        return this.blocks.get(name);
    }

    /** Marcas en el orden en que se declararon (de dentro hacia fuera al pintar). */
    public get markSpecs(): MarkSpec[] {
        return [...this.marks.values()];
    }

    public get markNames(): string[] {
        return [...this.marks.keys()];
    }
}

export function createSchema(config: SchemaConfig): Schema {
    return new Schema(config);
}