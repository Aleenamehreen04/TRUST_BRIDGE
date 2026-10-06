// Quick checks that need no API key: input validation + AI-output validation.
import assert from 'node:assert'
import { validateAnalysis } from './validate.js'
const good = { riskLevel: 'high', summary: 's', whyItMatters: 'w', riskFactors: [{ title: 'Urgency', description: 'd' }],
  verificationPlan: [1, 2, 3].map((n) => ({ step: n, title: 't', description: 'd' })), doActions: ['a'], dontActions: ['b'] }
assert.equal(validateAnalysis(good).riskLevel, 'HIGH')
assert.equal(validateAnalysis({ ...good, riskLevel: '92% scam' }), null)
assert.equal(validateAnalysis({ ...good, riskFactors: [] }), null)
assert.equal(validateAnalysis('nonsense'), null)
console.log('validator tests passed')
