import type { ChangedFile, SensitiveTouch } from "./types.js";
export declare function classifySensitiveTouches(files: ChangedFile[]): SensitiveTouch[];
export declare function hasDependencyChanges(files: ChangedFile[]): boolean;
export declare function hasWorkflowChanges(files: ChangedFile[]): boolean;
export declare function hasTestChanges(files: ChangedFile[]): boolean;
