Here's a simplified process for versioning your next update:

Make your code changes
Run npm version minor (this will create v1.1.0)
Git add all changed files: git add .
Commit: git commit -m "Description of changes"
Push commits and tag: git push origin main --tags

That's it. The npm version command automatically creates the git tag, so you just need to make sure you push both your commits and the tag to GitHub.

Here are the steps to start working on your new page design:

1. Make sure your main branch is up to date:
   ```
   git checkout main
   git pull
   ```

2. Create and switch to a new branch called "new-page-design":
   ```
   git checkout -b new-page-design
   ```

3. Make all your updates for the new page design on this branch

4. Regularly commit your changes:
   ```
   git add .
   git commit -m "Add description of what you changed"
   ```

5. When finished with all changes, version it:
   ```
   npm version minor
   ```

6. Push your branch with tags to GitHub:
   ```
   git push origin new-page-design --tags
   ```

7. Go to GitHub and create a pull request to merge "new-page-design" into main

Now you can start implementing your comic-panel layout for the story reader without affecting your main codebase.