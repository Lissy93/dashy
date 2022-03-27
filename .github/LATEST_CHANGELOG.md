<<<<<<< HEAD
## 🐛 Fixes user requested issues [PR #557](https://github.com/Lissy93/dashy/pull/557)
- Allows middle click open new tab, Re: #492
- Implements Max redirects for status checks, Re: #494
- Adds Gitpod config for cloud-ready IDE, Re: #497
- Adss new screenshots to showcase. Re: #505
- Adds target attribute to nav links, Re: #552
- Removes fixed max-width on wide-screens, Re: #554
- Updates path to Keycloak API, Re: #564
- Fixes link to @walkxhub homelab icons, Re #568
- Fixes local image path on sub-page, Re: #570
- Adds typecheck on edit item tags, Re: #575
- Fixes item size in config not honored, Re: #576
=======
### Partially revert 2.0.4, fixing several issues caused by `conf.yml` not being loaded at startup.
This change requires a rebuild of the application when several options under `appConfig` are changed.
Fixes #544 #555

### Several other changes since 2.0.4, including:
The `Add New Section` button on the UI editor now displays if no sections are present. #536
When using SSL, the server can now redirect from HTTP to HTTPS. This is enabled by default when using SSL. #538
Section context menus are now accessible on mobile, and will no longer clip off the screen. #541
Italian translations have been added. #556
>>>>>>> b51935f04976a56a27ecd3cd3124766f7148bfd0
