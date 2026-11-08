# GitHub Issues Wall Display

A lightweight, static wall display for the most active open issues in a GitHub repository.

## Live deployment

[Open the Cloudflare Pages dashboard](https://github-issues-wall-display.pages.dev)

Choose a repository with `?repo=owner/repository`, for example:

`https://github-issues-wall-display.pages.dev/?repo=owner/repository`

## Run locally

Open `index.html` in a browser, or serve this folder with any static file server.

Use the URL parameter to choose a repository:

`index.html?repo=owner/repository`

The default repository is `Cybersoulja/github-issues-wall-display`.

## Behavior

- Loads open issues from the GitHub REST API.
- Excludes pull requests.
- Ranks issues by comments plus reactions.
- Shows the top nine issues.
- Refreshes every five minutes, with a manual refresh button.
- Uses large, high-contrast typography for wall displays.
- Saves the selected repository in local browser storage.

## Rate limits

This dashboard uses the public GitHub API without a token. GitHub's unauthenticated rate limit applies. For a permanently mounted display, host the app behind a small server-side proxy if a higher rate limit is needed.
