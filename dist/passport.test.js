import assert from "node:assert/strict";
import test from "node:test";
import { classifySensitiveTouches, hasDependencyChanges, hasTestChanges } from "./classifier.js";
import { scoreChange } from "./risk.js";
import { sign } from "./passport.js";
const files = [
    { path: ".github/workflows/deploy.yml", status: "modified", additions: 20, deletions: 2 },
    { path: "src/auth/session.ts", status: "modified", additions: 50, deletions: 12 },
    { path: "package-lock.json", status: "modified", additions: 100, deletions: 80 }
];
test("classifies sensitive files", () => {
    const touches = classifySensitiveTouches(files);
    assert.ok(touches.some((touch) => touch.path.includes("deploy.yml")));
    assert.ok(touches.some((touch) => touch.path.includes("auth")));
});
test("detects dependency and test changes", () => {
    assert.equal(hasDependencyChanges(files), true);
    assert.equal(hasTestChanges(files), false);
});
test("scores high-risk changes", () => {
    const touches = classifySensitiveTouches(files);
    const result = scoreChange(files, touches, true, false);
    assert.ok(result.score >= 50);
    assert.equal(result.risk === "high" || result.risk === "critical", true);
});
test("signature is stable for equivalent objects", () => {
    assert.equal(sign({ b: 2, a: 1 }), sign({ a: 1, b: 2 }));
});
//# sourceMappingURL=passport.test.js.map