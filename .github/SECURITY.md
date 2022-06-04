
Security is taken very seriously

## Supported Versions
The current versions, and previous minor versions and / or the past 5 versions are supported. Releases either older than 5 versions, or from the last major version are no longer maintained or monitored, and hence the security of which cannot be guaranteed.

## Keeping your Instance of Dashy Secure
See [Docs: Management - Security](/docs/management.md#securing)

## Reporting a Security Issue
If you think you've found a critical issue, please send an email to `security@mail.alicia.omg.lol`, to encrypt it, you can use [`0688 F8D3 4587 D954 E9E5 1FB8 FEDB 68F5 5C02 83A7`](https://keybase.io/aliciasykes/pgp_keys.asc?fingerprint=0688f8d34587d954e9e51fb8fedb68f55c0283a7). You should receive a response within 48 hours.

All non-critical issues can be raised as a ticket.

Please include the following information:
- Type of issue (e.g. buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit the issue

This info will help with finding and fixing the issue.

Please use only English.

## Issues That Should Not Be Raised
Please do not raise issues in this repo which relate to Vue or Vue CLI, we're already using the latest versions of these dependencies, so any issues here to be taken up with Vue. The same applies to other dev dependencies that are at the latest version.

## Known Issues

> **01/09/2021** - [Inefficient Regular Expression Complexity](https://www.huntr.dev/bounties/1e8f07fc-c384-4ff9-8498-0690de2e8c31/) in Axios (Re: [CWE-1333](https://cwe.mitre.org/data/definitions/1333.html)).

This ReDos vuln, was raised and fixed by @ready-research in Axios in August 2021. The issue was resolved in [`5b45711`](https://github.com/axios/axios/commit/5b457116e31db0e88fede6c428e969e87f290929), but Snyk sometime just takes a while to show updates. Dashy is using the latest version of Axios, and so is not affected by this issue.
