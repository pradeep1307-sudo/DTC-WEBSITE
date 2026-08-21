# DTCApp
Denver Tamil Church App

## Local media administration

1. Start the local website with `start-service.cmd`. It safely launches the PowerShell server even when local script execution is disabled.
2. Open `http://localhost:8000/admin/` in Microsoft Edge or Google Chrome. The former `/admin.html` address redirects here automatically.
3. Select the local `DTC App` project folder when prompted.
4. Create Gallery albums, add photos, choose covers, or manage Upcoming Event posters.
5. Preview the public Gallery and Events pages before committing and pushing changes.

The media manager writes directly to `assets/gallery` and `assets/upcoming` and automatically updates each `manifest.json`. It is intentionally excluded from the public navigation and should be used only on the church administration computer.

## Project organization

- Public visitor pages: root-level `.html` files
- Shared browser code: `js/`
- Media Manager: `admin/`
- Church photos and generated media: `assets/`
- Local chatbot guidance: `skills/dtc-website-chatbot/`
- Local servers: `start-service.ps1` and `server.py`
