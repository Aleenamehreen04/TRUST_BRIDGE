// Checks the AI's JSON before it is allowed to reach the browser.
const LEVELS = ['LOW', 'MEDIUM', 'HIGH']
const str = (v, max = 600) => typeof v === 'string' && v.trim().length > 0 && v.length <= max
const strList = (a, min, max) => Array.isArray(a) && a.length >= min && a.length <= max && a.every((x) => str(x, 200))

export function validateAnalysis(d) {
  if (!d || typeof d !== 'object') return null
  const level = typeof d.riskLevel === 'string' ? d.riskLevel.toUpperCase() : ''
  if (!LEVELS.includes(level)) return null
  if (!str(d.summary) || !str(d.whyItMatters, 1500)) return null
  if (!Array.isArray(d.riskFactors) || d.riskFactors.length < 1 || d.riskFactors.length > 8) return null
  if (!d.riskFactors.every((f) => f && str(f.title, 80) && str(f.description))) return null
  if (!Array.isArray(d.verificationPlan) || d.verificationPlan.length < 3 || d.verificationPlan.length > 7) return null
  if (!d.verificationPlan.every((s) => s && str(s.title, 100) && str(s.description))) return null
  if (!strList(d.doActions, 1, 8) || !strList(d.dontActions, 1, 8)) return null

  // Return a clean copy: only the fields we expect, steps renumbered by us.
  return {
    riskLevel: level,
    summary: d.summary,
    riskFactors: d.riskFactors.map((f) => ({ title: f.title, description: f.description })),
    whyItMatters: d.whyItMatters,
    verificationPlan: d.verificationPlan.map((s, i) => ({ step: i + 1, title: s.title, description: s.description })),
    doActions: d.doActions,
    dontActions: d.dontActions,
  }
}
