// The decision challenge is fixed on purpose: it is graded locally, not by the AI.
export const challenge = {
  scenario: "Your manager asks you to urgently transfer ₹25,000 from a new phone number and tells you not to call because they're in a meeting.",
  options: [
    { id: 'A', text: 'Send the money because the request sounds urgent.', correct: false,
      feedback: 'Urgency is a pressure tactic. Acting before checking is exactly what this kind of request is designed to make you do.' },
    { id: 'B', text: 'Reply to the same number asking for confirmation.', correct: false,
      feedback: 'Replying keeps you inside the sender\u2019s control. Whoever controls that number can simply answer "yes, it\u2019s me".' },
    { id: 'C', text: 'Contact your manager using a phone number or communication channel you already trust.', correct: true,
      feedback: 'Independent verification breaks the chain of trust controlled by the suspicious request.' },
  ],
  safestAction: 'Contact the person through a communication channel you already trust.',
}
export const exampleRequest =
  "Hi, I'm your manager. I'm using a different number because my phone isn't working. I'm in an urgent meeting. Please send ₹25,000 to this account immediately. Don't call me because I'm presenting."
