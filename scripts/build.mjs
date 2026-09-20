import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),preview=path.join(root,'preview'),dist=path.join(root,'dist');
// Keep the directory stable so local preview servers can remain attached on Windows.
fs.mkdirSync(path.join(dist,'assets'),{recursive:true});
const pages=['index','services','booking','about','preparation','contact','cart'];
for(const page of pages){let html=fs.readFileSync(path.join(preview,`${page}.html`),'utf8').replaceAll('../assets/','assets/').replaceAll('href="#">Shop Bambï Beauty <span>↗</span></a>','role="note">Bambï Beauty — hair collection</span>');fs.writeFileSync(path.join(dist,`${page}.html`),html)}
const assets=['studio.css','studio.js','studio-curly-install.jpg','studio-bob.png','studio-curls.png','studio-detail.png','studio-wave.png'];for(const asset of assets)fs.copyFileSync(path.join(root,'assets',asset),path.join(dist,'assets',asset));
const booksySource=path.join(root,'assets','booksy-services'),booksyDist=path.join(dist,'assets','booksy-services');fs.mkdirSync(booksyDist,{recursive:true});for(const asset of fs.readdirSync(booksySource))fs.copyFileSync(path.join(booksySource,asset),path.join(booksyDist,asset));
console.log(`Built ${pages.length} static pages and ${assets.length} shared assets in dist/.`);
