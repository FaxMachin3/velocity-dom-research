> Historical v0.1 environment notes. For v0.4 use V04_PROTOCOL.md, V04_STATUS.md and results/v04/*/run-chromium-cpu1.json metadata. Older release notes below are not the current run record.

# Execution environment

The included runs were produced in a shared Linux container, using a headless browser, localhost serving, and a 1280x900 viewport. Exact dependency versions, CPU description, browser version, timestamps, repetitions, and profile settings are in each raw run's `meta` object.

The standard Playwright Chromium download repeatedly returned an invalid/truncated archive. A Chromium executable distributed through the pinned `@sparticuz/chromium` package was used instead, with normal Playwright launch arguments through BROWSER_EXECUTABLE. Package archives were decompressed locally because the package's default extraction attempted unsupported ownership changes in this container. None of this changes the application bundles.

Firefox downloaded successfully through Playwright's fallback mirror but did not complete browser launch in this environment. Firefox and WebKit runners remain available for local reproduction; do not interpret their support in the harness as measured cross-browser results.

The CPU multiplier 4 profile is Chromium synthetic CPU throttling. It is not a physical mobile device or a network profile. These results cannot establish mobile-browser or real-user performance.
