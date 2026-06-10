# Publishing

This package is published to npmjs.com by the [publish workflow](.github/workflows/publish.yml) using [npm trusted publishing](https://docs.npmjs.com/trusted-publishers). No npm tokens are stored in GitHub. The workflow authenticates with a short-lived OIDC token exchanged at publish time, and npm generates provenance attestations automatically.

## Releasing a new version

1. Bump `version` in `package.json` on a branch and open a PR
2. Merge to `master`
3. The publish workflow runs on every push to `master`; it publishes only if the version in `package.json` does not already exist on the registry, otherwise it skips

## One-time setup on npmjs.com

A package maintainer with 2FA enabled must configure the trusted publisher at
`https://www.npmjs.com/package/create-twinit-app/access` under Trusted Publisher:

1. Publisher: GitHub Actions
2. Organization or user: `Invicara`
3. Repository: `create-twinit-app`
4. Workflow filename: `publish.yml` (filename only, exact match including extension)
5. Environment name: `npm-publish` (must match the `environment:` in the workflow)
6. Allowed actions: `npm publish`

After the trusted publisher is configured and verified working, set the package
publishing access to "Require two-factor authentication and disallow tokens" so
token-based publishing is fully disabled.

## Optional GitHub-side hardening

In the GitHub repository settings, create the `npm-publish` environment (it is
auto-created on first workflow run if it does not exist) and add protection
rules such as required reviewers to gate publishes behind a manual approval.

## Requirements baked into the workflow

- `permissions: id-token: write` is required for OIDC
- npm 11.5.1 or newer is required for trusted publishing; Node 24.5+ bundles it
- Publishing runs on GitHub-hosted runners only (a trusted publishing restriction)
- `repository.url` in `package.json` must exactly match this GitHub repository or provenance verification fails
