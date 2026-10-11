<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep reference-style Dashboard and CRM presentation primitives in OverviewUI; other modules retain their existing UI primitives to limit visual changes.
- Keep all demo data and actions in the existing shared in-memory store; presentation updates must not change business records or conversion rules.
