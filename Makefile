css:
	cat styles/styles.pss | pss >  styles/pstyles.css
	cat styles/pstyles.css styles/pseudo-classes.css  >  styles/styles.css
	
git-ignore-fix:
	git rm -r --cached .;
	git add .;
	git commit -m "Untracked files issue resolved to fix .gitignore";
