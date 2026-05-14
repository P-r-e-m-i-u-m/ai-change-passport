import type { ChangedFile } from "./types.js";
export declare function getRepository(cwd: string): string | undefined;
export declare function getDefaultBase(cwd: string): string;
export declare function getDiffFiles(baseInput: string | undefined, headInput: string | undefined, cwd: string): {
    base: string;
    head: string;
    files: ChangedFile[];
};
