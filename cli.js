#!/usr/bin/env node

var readTorrent = require('./index');
var units = ['B','KB','MB','GB'];

var pad = function(s) {
	return s < 10 ? '0'+s : s;
};
var formatDate = function(d) {
	return pad(d.getUTCDate())+'/'+pad(d.getUTCMonth()+1)+'/'+d.getUTCFullYear();
};
var formatSize = function(s, mag) {
	mag = mag || 0;
	if (mag < 3 && s > (1 << 10*(mag+1))) return formatSize(s, mag+1);
	return (Math.round(10*(s >> 10*mag-3) / 8)/10) + units[mag];
};

if (!process.argv[2]) {
	console.error('usage: read-torrent torrent');
	process.exit(1);
}

readTorrent(process.argv[2], function(err, torrent) {
	console.log('info hash: '+torrent.infoHash);
	console.log('created:   '+formatDate(torrent.created));
	console.log('pieces:    '+torrent.pieces.length + ' x '+formatSize(torrent.pieceLength));

	console.log('name:      '+torrent.name);
	console.log('files:     '+torrent.files[0].name+ ' ('+formatSize(torrent.files[0].length)+')');
	for (var i = 1; i < torrent.files.length; i++) {
		console.log('           '+torrent.files[i].name+ ' ('+formatSize(torrent.files[i].length)+')');
	}

	console.log('trackers:  '+torrent.announce[0]);
	for (var i = 1; i < torrent.announce.length; i++) {
		console.log('           '+torrent.announce[i]);
	}
});