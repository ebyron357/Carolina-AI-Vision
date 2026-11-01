import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
const files = execFileSync(
  'git',
  ['ls-files', '--cached', '--others', '--exclude-standard'],
  { encoding: 'utf8' }
)
  .trim()
  .split('\n')
const rules = [
  ['private-key', /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
  ['github-token', /gh[pousr]_[A-Za-z0-9]{30,}/],
  ['stripe-live-key', /sk_live_[A-Za-z0-9]{20,}/],
  ['aws-access-key', /AKIA[A-Z0-9]{16}/],
]
const findings = []
for (const file of files) {
  if (file === 'scripts/scan-source.mjs') continue
  if (/(?:^|\/)\.env(?:\.|$)/.test(file) || /\.(?:pem|key)$/.test(file))
    findings.push({ file, rule: 'sensitive-file' })
  const text = readFileSync(file, 'utf8')
  for (const [rule, re] of rules)
    if (re.test(text)) findings.push({ file, rule })
}
process.stdout.write(
  JSON.stringify(
    {
      filesScanned: files.length,
      findings,
      scope:
        'Current source tree; selected high-confidence patterns, not full history or proof of no secrets.',
    },
    null,
    2
  ) + '\n'
)
if (findings.length) process.exitCode = 1
