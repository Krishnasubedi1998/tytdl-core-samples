
## Simple Http server

#### HOW TO USE THIS

- WATCH VIDEO AND AUDIO
 - http://localhost:3000/?ytid=IUFPs3j341k

- WATCH VIDEO AND AUDIO (SELECT VIDEO QUALITY)
 - http://localhost:3000/?ytid=IUFPs3j341k&quality=360p
 - [quality can be 360p, 480p, 720p, 1080p]

- WATCH AUDIO ONLY [WEBM FORMAT]
 - http://localhost:3000/?ytid=IUFPs3j341k&audioonly

- WATCH AUDIO ONLY [MP3 FORMAT]
 - http://localhost:3000/?ytid=IUFPs3j341k&audioonly&mp3

> MP3 CONVERSION USES fluent-ffmpeg -> so total length will be unknown as the webm is
converted to mp3 on the fly. But eventually the mp3 is completely converted without
any problems at least during the testing

- DETAILS ABOUT QUERY PARAMS

 - ytid  => Required => Youtube id (cannot be playlist)
 - audioonly => Optional if present then the audio of webm format will be played
 - mp3 => Optional audio of mp3 format will be streamed (converted on the fly with fluent-ffmpeg)
 - quality=>Optional(for video only) and must be any one of these values [360p, 480p, 720p, 1080p]


 ## Simple Youtube-mp3 downloader script
 - Simple script (index.js) that can be cloned and used (requires `npm install`) as:
  - `node index.js <youtube_id>`
  - This will download the mp3 of the video and save it as <youtube_id>.mp3 in the directory where script is located
 - EG -> `node index.js sDLsSQf3Hc0`  will download audio and save as sDLsSQf3Hc0.mp3 in the directory where this script is located
