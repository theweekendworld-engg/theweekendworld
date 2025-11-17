# Cursor Development Rules

## Critical Workflow Rules

### 1. After Every Change - Verify Server Status
**MANDATORY**: After making any code changes, you MUST:
- Check if the development server is running (`bun run dev`)
- Verify there are no build errors or runtime errors
- Test that the changes work as expected
- Only then proceed or say "I completed this"

### 2. Error Handling Protocol
- If you encounter any errors during development:
  - **STOP** and investigate the error
  - Read the full error message carefully
  - Check the relevant files and dependencies
  - Fix the error before proceeding
  - Verify the fix by checking server status again

### 3. Documentation First, No Hallucination
- **NEVER** guess or make assumptions about APIs, functions, or behavior
- When you don't know something:
  - Check the official documentation first
  - Check recent/current documentation (not outdated sources)
  - Look at similar code in the project
  - If still uncertain, ask for clarification rather than guessing

### 4. Completion Confirmation
- After completing any task or fix:
  - Verify the server runs without errors
  - Test the functionality if possible
  - Explicitly state: **"I completed this"** or **"Task completed"**

### 5. Code Quality Checks
Before marking something as complete:
- Ensure TypeScript types are correct
- Verify imports are correct and not missing
- Check that all dependencies are installed
- Ensure no console errors or warnings (unless intentional)

### 6. Testing Protocol
- After implementing features:
  - Start the dev server: `bun run dev`
  - Check browser console for errors
  - Verify API routes respond correctly
  - Test both success and error cases when applicable

## Example Workflow

```
1. Make code changes
2. Run: bun run dev
3. Check terminal for errors
4. Check browser console for errors
5. Test the functionality
6. If all good: "I completed this"
7. If errors: Fix them and repeat from step 2
```

## Important Notes

- **Never assume** - Always verify
- **Always test** - Don't just write code
- **Check documentation** - Don't hallucinate API behavior
- **Verify server status** - After every significant change
- **Be explicit** - State completion clearly

## Quick Commands Reference

```bash
# Start dev server
bun run dev

# Check for TypeScript errors
bun run build

# Generate Prisma client
bun run db:generate

# Run migrations
bun run db:migrate
```

