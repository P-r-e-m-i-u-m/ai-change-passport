import type { ChangedFile, RiskLevel, SensitiveTouch } from "./types.js";
export declare function scoreChange(files: ChangedFile[], touches: SensitiveTouch[], dependencyChanges: boolean, testsChanged: boolean): {
    score: number;
    risk: RiskLevel;
};
