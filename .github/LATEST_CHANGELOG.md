## 🐳 2.0.8 - Container run without root [PR #606](https://github.com/Lissy93/dashy/pull/606)
- Uses an unprivileged port (8080 instead of 80)
- Adds the UID and GID variables to not be 0
- Adds a DEST_DIRECTORY variable to control where build output goes
- Adds a RUN block to set permissions on the DEST_DIRECTORY so the non-root user can write
- Adds a USER directive to make the process run as the non-root user
