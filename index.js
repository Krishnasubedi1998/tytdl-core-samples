/*
	
	Youtube downloader module using ytdl-core
	NPM: https://www.npmjs.com/package/ytdl-core
*/

const readline = require('readline');
const ytdl     = require('ytdl-core');
const ffmpeg   = require('fluent-ffmpeg');


const arguments = process.argv.slice(2);
if(!arguments[0]) {
  console.log('\n|----------------------------------------');
  console.log('| Download mp3 from youtube id');
  console.log('| [!] 1 argument required youtubeid');
  console.log('| [usuage]$ node downloadscript.js sDLsSQf3Hc0');
  console.log('| ----------------------------------------\n');
  process.exit(1);
}

// let id = 'sDLsSQf3Hc0';
let id = arguments[0];


let stream = ytdl(id, {
  quality: 'highestaudio',
  //filter: 'audioonly',
});

let start = Date.now();
ffmpeg(stream)
  .audioBitrate(128)
  .save(`${__dirname}/${id}.mp3`)
  .on('progress', (p) => {
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(`=========== ${p.targetSize}kb downloaded ===========`);
  })
  .on('end', () => {
    console.log(`\nDone ! download time : ${(Date.now() - start) / 1000}s`);
  });