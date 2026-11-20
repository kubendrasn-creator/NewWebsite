// scripts/deploy_gh_pages.cjs
const { execSync } = require('child_process');
const path = require('path');
const distPath = path.resolve(__dirname, '../dist');

console.log('Deploying dist to gh-pages branch...');
try {
  execSync('git init', { cwd: distPath, stdio: 'inherit' });
  execSync('git config user.email "info@aptinfosoft.com"', { cwd: distPath, stdio: 'inherit' });
  execSync('git config user.name "Apt Infosoft"', { cwd: distPath, stdio: 'inherit' });
  execSync('git checkout -B gh-pages', { cwd: distPath, stdio: 'inherit' });
  execSync('git add -A', { cwd: distPath, stdio: 'inherit' });
  execSync('git commit -m "deploy: compiled static site"', { cwd: distPath, stdio: 'inherit' });
  try {
    execSync('git remote add origin https://github.com/kubendrasn-creator/NewWebsite.git', { cwd: distPath, stdio: 'inherit' });
  } catch {
    execSync('git remote set-url origin https://github.com/kubendrasn-creator/NewWebsite.git', { cwd: distPath, stdio: 'inherit' });
  }
  execSync('git push origin gh-pages -f', { cwd: distPath, stdio: 'inherit' });
  console.log('Successfully deployed to gh-pages branch!');
} catch (e) {
  console.error('Deployment failed:', e.message);
  process.exit(1);
}
