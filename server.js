// simple http server
/*
	HOW TO USE THIS

	[+] WATCH VIDEO AND AUDIO
	 -> http://localhost:3000/?ytid=IUFPs3j341k
	[+] WATCH AUDIO ONLY
	 -> http://localhost:3000/?ytid=IUFPs3j341k&audioonly

	DETAILS ABOUT QUERY PARAMS

	ytid  => Required => Youtube id (cannot be playlist)
	audioonly => Optional => Must be one of these options (mp3,mp4)

*/

const http = require('http');

const url = require('url');

const ytdl     = require('ytdl-core');

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

	} else {

		stream = ytdl(q.ytid, {});
	}

	// res.writeHead(200, {
	//     'Access-Control-Allow-Origin': '*',
	//     'Connection': 'Keep-Alive',
	//     'Content-Type': 'video/mp4'
	// }); // NOT REQUIRED

	stream.pipe(res);
	stream.on('error', (err) => {
		res.writeHead(404, {'Content-Type': 'application/json'});
		res.end(JSON.stringify({msg: 'Invalid video Id'}));
	})
}


let server = http.createServer(handleRequest);


server.listen(process.env.PORT || 3000, () => {
	console.log("server listening");
});