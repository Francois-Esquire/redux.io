# Contributing to redux.io

For installation, API usage, and migration guidance, see the [README](README.md). For the runnable tutorial, see [Signal Station](examples/README.md).

## Local development

Use Node 22.22.2+, 24.15+, or 26+ and npm. Run the following commands from the repository root:

```sh
npm ci
npm run hooks:install
npm test
npm run cov
npm run check
npm pack --dry-run
```

`npm run check` runs lint, formatting checks, strict TypeScript checks, tests with coverage thresholds, library and example builds, and tests of the npm tarball's CommonJS, ESM, and UMD entry points. Package tests also compile valid and invalid TypeScript consumers against the unpacked declarations. The integration tests start a real Socket.IO server on an OS-assigned localhost port and close every connection after each test.

Browser tests run separately with `npm run test:browser`. Install Chromium first with `npx playwright install chromium`, and stop any running demo so the tests can use port 5173. See the [example validation guide](examples/README.md#check-the-wiring) for the server, proxy, and browser checks.

CI checks Node 22, 24, and 26 with React 18 and 19, with a separate Chromium job. Library coverage thresholds are 100% for statements, branches, functions, and lines. `npm run watch:test` watches tests. `npm run watch:build` watches TypeScript compilation into `.build`; run `npm run build` to refresh packaged bundles.

Generated `dist`, `.build`, and `examples/dist` directories are ignored by Git. The npm tarball still includes compiled JavaScript and declarations in `dist`, plus the original TypeScript in `lib`. A clean checkout builds these artifacts before testing package imports.

The `prepack` hook builds ordinary npm packages. CI builds explicitly before packing with `--ignore-scripts`, so packing and publishing the tested artifact do not rerun the build.

Implementation references: [React Redux connect](https://react-redux.js.org/api/connect), [Socket.IO client API](https://socket.io/docs/v4/client-api/), [Socket.IO with React](https://socket.io/how-to/use-with-react), and [Redux side effects](https://redux.js.org/usage/side-effects-approaches).

### Git hooks

Run `npm run hooks:install` once per clone after installing dependencies. Husky runs `lint-staged` before commits to fix lint and formatting issues in staged TypeScript source, examples, tests, configuration, and release documentation. It preserves unstaged portions of partially staged files. Generated bundles are excluded.

Before a push, Husky runs `npm run check`, including the 100% coverage requirements and package smoke tests. CI runs the same checks independently. Hooks run installed local tools; they do not download dependencies.

Hook installation is explicit rather than an npm lifecycle hook. Installing or publishing the package does not configure Git hooks, and the isolated publish job needs no Husky installation.

## Changelog and versioning

[CHANGELOG.md](CHANGELOG.md) is generated from Conventional Commits by `npm run changelog`. The next release is `1.0.0`, which moves the old `0.2.x` API onto the supported framework versions. Detailed migration instructions live in the [README](README.md#migration-from-02x).

For each subsequent release:

1. Commit changes using Conventional Commits: `fix(socket): handle disconnects`, `feat(api): add an option`, or `feat(api)!: change connection ownership`. Explain migration requirements in a `BREAKING CHANGE:` commit-body footer.
2. Choose a major version for incompatible API or supported-runtime changes, minor for compatible features, and patch for compatible fixes.
3. Run `npm version major --no-git-tag-version --ignore-scripts`, substituting `minor` or `patch` as appropriate. This updates the manifest and lockfile without creating a Git commit or tag.
4. Run `npm run changelog`, review the generated entry, and run `npm run check`.
5. Commit and push the release changes when approved, then create and push the matching `vX.Y.Z` tag. The tag triggers the isolated npm workflow, which creates the GitHub release and its notes after npm publishing succeeds.

The generator groups features, fixes, and breaking changes and links entries to commits. It rebuilds the file from Git history, so repeated runs do not append duplicate releases. Do not edit generated entries by hand; correct the commit metadata or add migration detail here. Uncommitted changes cannot appear in the generated changelog, and generation does not publish a release or create commits or tags. Fetch the full history and release tags before generating notes in a new clone.

Version selection remains explicit; the changelog generator does not bump versions. The current 1.0.0 version is prepared locally and has not been released.

## Publishing

The `Publish Package` workflow in `.github/workflows/publish.yml` uses npm trusted publishing with GitHub OIDC, not an `NPM_TOKEN` secret. It runs on pushed `v*` tags. For manual recovery, select the matching release tag, for example `gh workflow run publish.yml --ref v1.0.0`; running from a branch is rejected. The workflow must already be committed and pushed at that tag. Creating a GitHub release does not trigger another npm publish.

The workflow uses two jobs on separate runners:

1. **Build:** validate the tag against the package version, install dependencies, regenerate the changelog from full Git history, extract notes, run the full checks, and upload the built npm tarball and `release-notes.md`. This job has read-only repository access and no OIDC permission.
2. **Publish:** `needs: [build]` and a success condition ensure this job starts only after that build succeeds. It downloads and unpacks the tested artifact, then runs `npm publish ./package --ignore-scripts`. This runner does not check out source, install dependencies, restore caches, or run package lifecycle scripts. Only this job has `id-token: write` for OIDC. Both jobs explicitly disable setup-node's package-manager caching.

The separate `CI` workflow may run concurrently. Publication is gated by the publish workflow's own full build/test job, not by the separately scheduled CI run.

Only the publish job uses the GitHub environment `npm`. Any required approvals configured on that environment must pass before the publish job runs. The build job does not require environment approval.

After npm publishing succeeds, a separate step uses GitHub's token to create a release at the built commit or update its description with the generated notes. Authentication failures now fail the job instead of silently skipping publication. If npm succeeds but GitHub release creation fails, use the uploaded notes to create or edit the release manually; do not attempt to republish the same npm version.

### npm trusted-publisher checklist

Configure the trusted publisher on the existing `redux.io` package with these exact values:

| Field                | Value                                       |
| -------------------- | ------------------------------------------- |
| Provider             | GitHub Actions                              |
| Organization or user | `Francois-Esquire`                          |
| Repository           | `redux.io`                                  |
| Workflow filename    | `publish.yml`, not its path or display name |
| Environment          | `npm`                                       |
| Allowed actions      | Enable direct `npm publish`                 |

New npm trusted publishers may default to stage-only access. This workflow publishes directly, so stage-only access is insufficient. If you want staged publishing instead, the workflow and GitHub release timing must be changed together so an unapproved staged package is not announced as released.

Node 24 is selected for both GitHub-hosted runners. The publish job checks that its bundled npm is at least 11.5.1 before requesting publication; it never installs a replacement CLI on the privileged runner. The package's `repository.url` must match this GitHub repository. OIDC automatically generates provenance for a public package published from a public repository, without an extra `--provenance` flag.

Before publishing, confirm the provider fields and direct-publish permission in npm settings. npm does not validate them when saved. A local dry run cannot verify GitHub OIDC; the first authorized tag run is the end-to-end check. Inspect its publish result and the package's provenance after it succeeds.

After the first successful trusted publish, npm recommends selecting **Require two-factor authentication and disallow tokens** under Publishing access, revoking obsolete npm automation tokens, and removing the unused GitHub `NPM_TOKEN` secret. Configure release-tag protection to restrict who can start publishing. The environment name `npm` must match the npm trusted-publisher configuration exactly. See the [npm trusted-publishing setup and migration guide](https://docs.npmjs.com/trusted-publishers/).

Update the package version and lockfile before publishing. Release tags must match `v` followed by the package version. Stable versions use npm's `latest` tag; prerelease versions use `next`. npm rejects versions that have already been published.

The lifecycle-script boundary uses npm's documented [ignore-scripts option](https://docs.npmjs.com/cli/v11/using-npm/config/#ignore-scripts).
