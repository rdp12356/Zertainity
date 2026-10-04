# Data and Content Provenance

## Scope

Zertainity's source code is intended to be licensed under Apache License 2.0.

That license does **not** automatically relicense third-party datasets, factual compilations, images, fonts, trademarks, or other content that may have separate rights. The repository therefore treats application code and content/data as separate review surfaces.

## Current repository policy

- Career, exam, pathway, and college content included in `src/data/` is project content and must be maintained from sources that the maintainers are permitted to use and redistribute.
- Do not copy substantial text, proprietary datasets, rankings, logos, screenshots, or other protected material from third-party websites into the repository.
- When external factual sources are used to update content, preserve the source/provenance in the relevant content-maintenance workflow rather than implying that the source itself is licensed under Apache-2.0.
- Brand names may be used descriptively where appropriate; third-party trademarks and logos are not granted by the Zertainity source-code license.
- The repository does not include the previous `design-md/` third-party design-reference corpus. Zertainity's UI should be developed from its own design system and original implementation rather than redistributing third-party design-system analyses.
- Unused or unverified reference artifacts should not be committed merely for convenience.

## Maintainer release checklist

Before each public release, maintainers should verify:

1. Every newly added dataset or media asset has known provenance.
2. Any third-party license is compatible with the intended distribution and is preserved.
3. Required attribution and NOTICE text are included.
4. Proprietary/private data is excluded.
5. Student/user data is never committed.
6. Claims described as "verified", "official", "current", or "ranked" have an identified source and review date.

If provenance cannot be established, do not include the material in a release.
