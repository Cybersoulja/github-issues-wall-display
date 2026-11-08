# GitHub Issues Wall Display — Development Progress

> **Status:** In development
> **Repository:** https://github.com/Cybersoulja/github-issues-wall-display
> **Live deployment:** https://github-issues-wall-display.pages.dev
> **Notion dashboard:** GitHub Issues Wall Display under the Oneseco Media GitHub Development Hub

## Completed

- [x] Created a Notion development dashboard
- [x] Created the GitHub repository
- [x] Scaffolded a static web app
- [x] Added GitHub REST API issue loading
- [x] Excluded pull requests from the issue list
- [x] Added interaction scoring: comments + reactions
- [x] Added descending interaction sorting
- [x] Added five-minute auto-refresh
- [x] Added manual refresh control
- [x] Added wall-display typography and responsive layout
- [x] Added loading, empty, invalid repository, rate-limit, and API error states
- [x] Added repository selection through `?repo=owner/repository`

## Next

- [x] Push the implementation to GitHub
- [x] Attach the repository bookmark to the Notion dashboard
- [x] Deploy the static dashboard to Cloudflare Pages
- [x] Add the live deployment URL to project documentation
- [ ] Validate the layout in a real wall-display browser
- [ ] Decide whether a server-side proxy is needed for higher API rate limits
- [ ] Add a repeatable deployment workflow

## Decisions

- Use a static app first so it can run on GitHub Pages or a simple local display device.
- Use public GitHub API requests to avoid requiring a token in the browser.
- Keep the score explainable: comments plus all reaction counts.
