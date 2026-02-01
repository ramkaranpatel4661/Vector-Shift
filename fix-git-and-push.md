# Fix Git and Push to GitHub

Run these commands **one by one** in PowerShell from `D:\VectorShift`.

## Step 1: Remove frontend as submodule (fix "bad object HEAD")

```powershell
cd D:\VectorShift

# Remove the .git inside frontend so it's no longer a submodule
Remove-Item -Recurse -Force frontend\.git -ErrorAction SilentlyContinue

# Remove submodule entry from main repo (if frontend was registered as submodule)
git config --remove-section submodule.frontend 2>$null
```

## Step 2: Clean and re-add everything

```powershell
git add .
git status
```

If you still see "bad object HEAD", reset the main repo's HEAD:

```powershell
git rev-parse HEAD
```

If that fails:

```powershell
# Backup and re-init if repo is broken
Remove-Item -Recurse -Force .git
git init
git add .
git status
```

## Step 3: Commit and push to GitHub

```powershell
git add .
git commit -m "Add frontend and backend"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your GitHub username and repo name.

---

**If you haven't created the GitHub repo yet:**

1. Go to https://github.com/new
2. Create a new repository (e.g. `VectorShift`)
3. Do **not** add README or .gitignore (you already have files)
4. Copy the repo URL and use it in `git remote add origin ...` above
