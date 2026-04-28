# User Preferences & Approved Actions

This file documents permissions and preferences granted by the user so they
can be quickly re-confirmed at the start of a new session.

## Approved Actions (no need to ask each time)
- ✅ Run `npm install` (including with `--legacy-peer-deps`)
- ✅ Run `npm run build`, `npm run dev`, `npm run lint`
- ✅ Create, edit, and delete files anywhere in the repository
- ✅ Create new folders and placeholder files
- ✅ `git add`, `git commit`, `git push` without asking for confirmation
- ✅ Update `.gitignore`
- ✅ Modify `vite.config.ts`, `tsconfig.app.json`, `package.json`
- ✅ Update memory bank files after each completed step

## Preferences
- After each completed step: update `memory-bank/activeContext.md` and `memory-bank/progress.md`, and store key facts with `store_memory`
- Commit after each step is fully verified (build passes)
- Use conventional, descriptive commit messages with the Copilot co-author trailer
- Follow the prompt files in `.github/prompts/` step by step (01 → 15)
- Do not skip steps or combine steps unless explicitly asked

## npm Install Note
Always use `--legacy-peer-deps` for this project due to vite-plugin-pwa not
supporting Vite 8 via standard peer dep resolution.
