import fs from 'node:fs/promises';
const html = await fs.readFile('index.html','utf8');
const css = (await Promise.all(['styles.css','overrides.css'].map(f=>fs.readFile(f,'utf8')))).join('\n');
const js = (await Promise.all(['forest.js','app.js'].map(f=>fs.readFile(f,'utf8')))).join('\n');
const insightPhoto = await fs.readFile('media/course15-participants.jpg');
const insightPhotoData = `data:image/jpeg;base64,${insightPhoto.toString('base64')}`;
const bundled = html
  .replace(/\s*<link rel="stylesheet" href="styles\.css">/, '')
  .replace(/\s*<link rel="stylesheet" href="overrides\.css(?:\?[^\"]*)?">/, `<style>\n${css}\n</style>`)
  .replace(/\s*<script src="forest\.js(?:\?[^\"]*)?"><\/script>/, '')
  .replace(/\s*<script src="app\.js(?:\?[^\"]*)?"><\/script>/, `<script>\n${js}\n</script>`)
  .replaceAll('media/course15-participants.jpg', insightPhotoData);
await fs.mkdir('dist',{recursive:true});
await fs.writeFile('dist/Actuarial-Session-OFFLINE.html',bundled);
