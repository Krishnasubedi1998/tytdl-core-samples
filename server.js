// simple http server
/*
	HOW TO USE THIS

	[+] WATCH VIDEO AND AUDIO
	 -> http://localhost:3000/?ytid=IUFPs3j341k

	[+] WATCH VIDEO AND AUDIO (SELECT VIDEO QUALITY)
	 -> http://localhost:3000/?ytid=IUFPs3j341k&quality=360p
	 [quality can be 360p, 480p, 720p, 1080p]

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
	quality=>Optional(for video only) and must be any one of these values [360p, 480p, 720p, 1080p]

*/

const http = require('http');

const url = require('url');

const ytdl     = require('ytdl-core');

const ffmpeg   = require('fluent-ffmpeg');

// video quality map query: itag --> (only mp4 choosen) there are more itags(for webm) in ytdl-core docs
const videoQuality = {
	'360p': 18,
	'480p': 135,
	'720p': 136,
	'1080p': 137
};

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

		const options = {};

		if(q.quality && q.quality != '') {
			if(Object.keys(videoQuality).includes(q.quality))
				options['quality'] = videoQuality[q.quality];
		}

		stream = ytdl(q.ytid, options);
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