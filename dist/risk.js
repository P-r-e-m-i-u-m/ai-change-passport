export function scoreChange(files, touches, dependencyChanges, testsChanged) {
    const churn = files.reduce((sum, file) => sum + file.additions + file.deletions, 0);
    let score = 0;
    score += Math.min(25, Math.floor(churn / 80));
    score += Math.min(20, Math.floor(files.length / 4) * 5);
    score += dependencyChanges ? 18 : 0;
    score += testsChanged ? 0 : files.length >= 3 ? 12 : 0;
    for (const touch of touches) {
        score += touch.severity === "critical" ? 40 : touch.severity === "high" ? 22 : touch.severity === "medium" ? 12 : 6;
    }
    const bounded = Math.min(100, score);
    return {
        score: bounded,
        risk: toRisk(bounded, touches.some((touch) => touch.severity === "critical"))
    };
}
function toRisk(score, hasCriticalTouch) {
    if (hasCriticalTouch || score >= 75)
        return "critical";
    if (score >= 50)
        return "high";
    if (score >= 20)
        return "medium";
    return "low";
}
//# sourceMappingURL=risk.js.map