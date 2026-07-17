# License Compliance Record

This document records third-party license compliance decisions for the eForm
platform. It exists as an audit trail for automated license scanning (FOSSA)
and for internal reference. It is informational and is not itself a license.

**Project license:** MIT (see `LICENSE`).

**Last reviewed:** 2026-07-17

---

## QuestPDF — Community License eligibility

**Package:** `QuestPDF` (used by the BackendConfiguration and Workflow API
plugins for PDF/report generation).

**License:** QuestPDF is dual-licensed. The package ships a custom license file
(`LICENSE.md`, "QuestPDF Licensing", License Selection Guide v3.0, effective
2026-07-06) offering either:

1. the **QuestPDF Community License** (free, for eligible users), or
2. a paid **Professional / Enterprise License**.

Because the package declares a custom, non-SPDX license, automated scanners
cannot auto-classify it and may flag it as a policy issue.

### Determination

Microting uses QuestPDF under the **Community License**. As of the review date,
Microting meets all Community License eligibility conditions:

| Condition (per QuestPDF Community License) | Microting status |
| --- | --- |
| Annual gross revenue under **USD 1,000,000** (consolidated across entities under common control, most recent completed fiscal year) | Met — under the threshold |
| Not a **publicly traded** company | Met — privately held |
| Not a **public-sector entity** | Met — private company (public-sector customers do not affect the licensee's status) |

No paid license is required while these conditions hold.

### Ongoing obligations

- **Threshold transition:** If Microting's annual gross revenue exceeds
  USD 1,000,000, or Microting becomes publicly traded or otherwise loses
  eligibility (including via merger/acquisition on a consolidated basis),
  the Community License provides a **90-day transition period** to purchase a
  Professional/Enterprise license. This determination must be re-reviewed on
  any such change and at least annually.
- **Reference:** https://www.questpdf.com/pricing and the `LICENSE.md` shipped
  with the referenced QuestPDF package version.

### Scanner action

QuestPDF is an approved dependency for this project. Add a corresponding
policy exception / license allowance in FOSSA so the QuestPDF issue is marked
resolved.

---

## Resolved license issues (history)

For context, the following items were remediated during the 2026-07-17 review:

- **TinyMCE (GPL-2.0-or-later / commercial):** Removed. The CMS rich-text editor
  was migrated to the MIT-licensed `ngx-editor`-based `formatting-text-editor`
  component. Packages `tinymce` and `@tinymce/tinymce-angular` were dropped.
- **`jsmin` ("Good, not Evil" — non-OSI) and the `build` package cluster
  (unlicensed):** Removed. The unused stray `build` dependency, which pulled in
  `jsmin` plus five unlicensed transitive packages, was deleted from
  `eform-client`.
- **First-party `Microting.*` NuGet packages (missing license metadata):**
  `<PackageLicenseExpression>MIT</PackageLicenseExpression>` was added to each
  package's project file so published packages declare their MIT license.
  The declaration reaches nuget.org when each source repository publishes a new
  tagged release.
