# REDLINE Forge application candidate

This is a read-only Jira project-page Custom UI. It requires a registered Forge app and Jira Cloud development site. No installation, build, or live API call has been verified yet.

1. Copy manifest.template.yml to manifest.yml and use your registered Forge app ID (never invent one).
2. In ui/, install dependencies and run npm run build; review resolved versions and commit the lockfile after successful build.
3. In forge/, run forge lint and forge deploy, then install into your authorized Jira development site.
4. Read a synthetic Jira issue and export the evidence. No status-only automatic release approval is permitted.

Official references: https://developer.atlassian.com/platform/forge/manifest-reference/modules/jira-project-page/ and https://developer.atlassian.com/platform/forge/apis-reference/ui-api-bridge/requestJira/. Use only free allowances, no paid add-ons or sensitive customer issues.
