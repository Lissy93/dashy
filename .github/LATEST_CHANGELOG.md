### Partially revert 2.0.4, fixing several issues caused by `conf.yml` not being loaded at startup.
This change requires a rebuild of the application when several options under `appConfig` are changed.
Fixes #544 #555

### Several other changes since 2.0.4, including:
The `Add New Section` button on the UI editor now displays if no sections are present. #536
When using SSL, the server can now redirect from HTTP to HTTPS. This is enabled by default when using SSL. #538
Section context menus are now accessible on mobile, and will no longer clip off the screen. #541
Italian translations have been added. #556