// simple http server
/*
	HOW TO USE THIS

	[+] WATCH VIDEO AND AUDIO
	 -> http://localhost:3000/?ytid=IUFPs3j341k

	[+] WATCH AUDIO ONLY [WEBM FORMAT]
	 -> http://localhost:3000/?ytid=IUFPs3j341k&audioonly

	[+] WATCH AUDIO ONLY [MP3 FORMAT]
	 -> http://localhost:3000/?ytid=IUFPs3j341k&audioonly&mp3

	[!] MP3 CONVERSION USES fluent-ffmpeg -> so total length will be unknown as the webm is
	[!] converted to mp3 on the fly. But eventually the mp3 is completely converted without
	[!] any problems at least during the testing

	DETAILS ABOUT QUERY PARAMS

	ytid  => Required => Youtube id (cannot be playlist)
	audioonly => Optional if present then the audio of webm format will be played
	mp3 => Optional audio of mp3 format will be streamed (converted on the fly with fluent-ffmpeg)

*/

const http = require('http');

const url = require('url');

const ytdl     = require('ytdl-core');

const ffmpeg   = require('fluent-ffmpeg');

function handleRequest(req, res) {

	const q = url.parse(req.url, true).query;
	// console.log(q);
	if(!q.ytid && q.ytid === '') {
		res.end('Youtube Id is required');
		return;
	}
	
	let stream = null;

	if( 'audioonly' in q ) {

		stream = ytdl(q.ytid, {
		  quality: 'highestaudio',
		  //filter: 'audioonly',
		});

		if('mp3' in q) {

			ffmpeg(stream)
			  .audioBitrate(128)
			  .format('mp3')
			  .on('error', (err) => {/*console.error(err);*/})
			  .on('end', () => {/*console.log('Finished!');*/})
			  .pipe(res, { end: true });

		} else {

			stream.pipe(res);
		}
	} else {

		stream = ytdl(q.ytid, {});
		stream.pipe(res);
	}

	stream.on('error', (err) => {
		res.writeHead(404, {'Content-Type': 'application/json'});
		res.end(JSON.stringify({msg: 'Invalid video Id'}));
	})
}


let server = http.createServer(handleRequest);


server.listen(process.env.PORT || 3000, () => {
	console.log("server listening");
});