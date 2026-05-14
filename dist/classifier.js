const dependencyFiles = new Set([
    "package.json",
    "package-lock.json",
    "pnpm-lock.yaml",
    "yarn.lock",
    "requirements.txt",
    "pyproject.toml",
    "poetry.lock",
    "go.mod",
    "go.sum",
    "Cargo.toml",
    "Cargo.lock",
    "pom.xml",
    "build.gradle"
]);
const sensitivePatterns = [
    { pattern: /(^|\/)\.github\/workflows\//, reason: "CI/CD workflow behavior changed", severity: "high" },
    { pattern: /(^|\/)(Dockerfile|docker-compose\.ya?ml)$/, reason: "container build or runtime behavior changed", severity: "medium" },
    { pattern: /(^|\/)(auth|authentication|authorization|session|security|crypto|rbac|permissions?)\b/i, reason: "authentication or security-sensitive code changed", severity: "high" },
    { pattern: /(^|\/)(infra|terraform|k8s|kubernetes|helm)\//i, reason: "infrastructure or deployment configuration changed", severity: "high" },
    { pattern: /(^|\/)\.env(\.|$)/i, reason: "environment or secret-related file changed", severity: "critical" },
    { pattern: /(^|\/)(payments?|billing|checkout)\b/i, reason: "payment or billing-related code changed", severity: "high" }
];
const testPattern = /(^|\/)(__tests__|tests?|spec|e2e)\/|(\.|-)(test|spec)\.[cm]?[jt]sx?$/i;
export function classifySensitiveTouches(files) {
    return files.flatMap((file) => sensitivePatterns
        .filter((item) => item.pattern.test(file.path))
        .map((item) => ({
        path: file.path,
        reason: item.reason,
        severity: item.severity
    })));
}
export function hasDependencyChanges(files) {
    return files.some((file) => dependencyFiles.has(file.path.split("/").at(-1) ?? file.path));
}
export function hasWorkflowChanges(files) {
    return files.some((file) => /(^|\/)\.github\/workflows\//.test(file.path));
}
export function hasTestChanges(files) {
    return files.some((file) => testPattern.test(file.path));
}
//# sourceMappingURL=classifier.js.map