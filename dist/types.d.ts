export type RiskLevel = "low" | "medium" | "high" | "critical";
export interface ChangedFile {
    path: string;
    status: "added" | "modified" | "deleted" | "renamed" | "unknown";
    additions: number;
    deletions: number;
}
export interface SensitiveTouch {
    path: string;
    reason: string;
    severity: RiskLevel;
}
export interface PassportInput {
    base?: string;
    head?: string;
    agent: string;
    cwd?: string;
}
export interface ChangePassport {
    schemaVersion: "0.1";
    generatedAt: string;
    repository?: string;
    base: string;
    head: string;
    agent: string;
    summary: {
        risk: RiskLevel;
        score: number;
        changedFiles: number;
        additions: number;
        deletions: number;
        dependencyChanges: boolean;
        workflowChanges: boolean;
        testsChanged: boolean;
        humanApprovalRequired: boolean;
    };
    sensitiveTouches: SensitiveTouch[];
    changedFiles: ChangedFile[];
    recommendations: string[];
    signature: {
        algorithm: "sha256";
        value: string;
    };
}
