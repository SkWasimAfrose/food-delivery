# GitHub Push & Workflow Guide

## 🚀 First Time Push (from your PC to GitHub)

### Step 1: Open Terminal / Command Prompt

```sh
cd path/to/your/project
```

### Step 2: Initialize Git (if not already)

```sh
git init
```

### Step 3: Add Remote Repository

Replace `<your-repo-url>` with your GitHub repo URL.

```sh
git remote add origin https://github.com/your-username/your-repo.git
git remote -v
```

### Step 4: Add Files and Commit

```sh
git add .
git commit -m "Initial commit"
```

### Step 5: Push to GitHub

```sh
git branch -M main
git push -u origin main
```

If it shows:

    fatal: The current branch main has no upstream branch.

Then run:

```sh
git push --set-upstream origin main
```

---

## 🔄 Updating Your Repo (after making changes)

### Step 1: Check what changed

```sh
git status
```

### Step 2: Stage your changes

```sh
git add .
# or add a specific file:
git add filename.ext
```

### Step 3: Commit your changes

```sh
git commit -m "Added new navbar design"
```

### Step 4: Push to GitHub

```sh
git push
```

### Step 5: Pull before pushing (good practice if using multiple devices or team work)

```sh
git pull
```

---

## ⚡ Full Workflow after editing files

```sh
git status
git add .
git commit -m "Your message"
git pull
git push
```

## Force Push

```sh
git push origin main --force
```

---

## 💻 Cloning Repo on Another PC

To work on another PC:

```sh
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

Now you can continue with the same workflow!
