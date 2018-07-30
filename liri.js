require("dotenv").config();

var twitter_keys = require("./keys.js");

var spotify_keys = require("./keys.js");

var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");

var command = process.argv[2];
var argument = process.argv[3];



function runCommand(command, argument) {

	if (command === 'my-tweets') {

		var client = new Twitter (twitter_keys.twitter);
		
		var params = {
			screen_name: 'jkush80'
		};
		client.get('statuses/user_timeline', params, function (error, tweets) {
			if (!error) {
				console.log("Tweets")
				console.log("______________")
				tweets.forEach((tweets) => {
					console.log(tweets.created_at),
					console.log(tweets.text)
				})
			}
		});
	} else if (command === 'spotify-this-song') {
		
		var spotify = new Spotify (spotify_keys.spotify);

		spotify.search({
			type: 'track',
			query: argument
		}, function (err, data) {
			if (err) {
				return console.log('Error occurred: ' + err);
			}
			var artist = data.tracks.items[0].artists[0].name;
			var songName = data.tracks.items[0].name;
			var previewUrl = data.tracks.items[0].external_urls.spotify;

			console.log("Artist: " + artist);
			console.log("Song Name: " + songName);
			console.log("preview url: " + previewUrl)
		});

	} else if (command === 'movie-this') {

		var queryUrl = "http://www.omdbapi.com/?t=" + argument + "&y=&plot=short&apikey=36ab58fc";

		request(queryUrl, function (error, response, body) {

			if (!error && response.statusCode === 200) {

				var res = JSON.parse(body);
				console.log("Title: " + res.Title);
				console.log("Year: " + res.Year);
				console.log("IMDB Rating: " + res.imdbRating);
				console.log("Rotten Tomatos Rating: " + res.Ratings[1]);
				console.log("Country: " + res.Country);
				console.log("Language: " + res.Language);
				console.log("Plot: ", res.Plot);
				console.log("Actors: ", res.Actors);

			}
		});
	}


}
if (command === 'do-what-it-says') {
	fs.readFile("random.txt", "utf-8", function (err, data) {
		if (err) {
			return console.log(error);
		}
		data = data.toString().split(",");
		runCommand(data[0], data[1]);
	})

} else {
	runCommand(command, argument)
}
