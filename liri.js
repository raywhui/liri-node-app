//Arguments my-tweets, spotify-this-song [song name], movie-this [movie screen_name]


//Arguments in terminal
var arg = process.argv[2];
var arg2 = [];
var newArg	2;

//For multi-worded arguments, terminal now takes multiple words without ''
for (var j=3; j<process.argv.length; j++){
	arg2.push(process.argv[j]);
}
newArg2 = arg2.join(" ");

//required files
var keys = require('./keys.js');
var request = require("request");
var spotify = require("node-spotify-api");
var twitter = require("twitter");
var fs = require('fs');

//Linking twitter keys to twitter api
var Twitter = new twitter({
	consumer_key: keys.twitterKeys.consumer_key,
	consumer_secret: keys.twitterKeys.consumer_secret,
	access_token_key: keys.twitterKeys.access_token_key,
	access_token_secret: keys.twitterKeys.access_token_secret
});

//Linking spotify keys to spotify api
var Spotify = new spotify({
	id: keys.spotifyKeys.id,
	secret: keys.spotifyKeys.secret
});

//Bonus: Write agruments into log.txt
//Synchronious Files? .writeFileSync vs .writeFile
fs.appendFile('log.txt', arg +', '+ newArg2 + '\n', function(err){
	if (err){
		console.log('failure to write');
	}else{
		console.log('written success');
	}
})



//For fun
var endQuote = "Morpheus: Throughout human history, we have been dependent on machines to survive. Fate, it seems, is not without a sense of irony. What would you like to do?";

//Twitter function
function tweetz(){
	//Change screen_name to anyones Twitter handle.
	//By default, get(statuses/user_timeline) displays max 20 tweets.
	Twitter.get('statuses/user_timeline', {screen_name: 'Robot_Ramen'},  function(error, tweets, response) {	
		if(error){
			console.log('failure');
		}else{
			console.log("\n" + "Morpheus: Neo, sooner or later you're going to realize just as I did that there's a difference between knowing the path and Tweeting the path." + "\n");
			for (var i=0; i < tweets.length; i++){
				console.log('Tweet ' + (i + 1) + '. ' + tweets[i].text + '\n');
			}//for
			console.log(endQuote);
		}//else
	});
}

//Spotify with newArg2
function spotifyArg2(){	
	//Searches via process.argv[3]
	Spotify.search({ type: 'track', query: newArg2}, function(err, songInfo){
		//Path to first track item
		var songSearch = songInfo.tracks.items[0];
		if (err){
			console.log('failure');
		}else{
			console.log('\n' + "Neo: Why do my ears hurt?");
			console.log("Morpheus: You've never used them before." + '\n');
			console.log('Artist:',songSearch.artists[0].name + '\n');
			console.log('Title:',songSearch.name + '\n');
			console.log('Preview Link:',songSearch.external_urls.spotify + '\n');
			console.log('Album:',songSearch.album.name + '\n');
			console.log(endQuote);
		}//else
	});
}

//Spotify no newArg2
function spotifyDefault(){
	Spotify.search({ type: 'track', query: 'Ace of Base'}, function(err, songInfo){
		//Path to first track item
		var songSearch = songInfo.tracks.items[0];
		if (err){
			console.log('failure');
		}else{
			console.log('\n' + "Neo: Why do my ears hurt?");
			console.log("Morpheus: You've never used them before." + '\n');
			console.log('Artist:',songSearch.artists[0].name + '\n');
			console.log('Title:',songSearch.name + '\n');
			console.log('Preview Link:',songSearch.external_urls.spotify + '\n');
			console.log('Album:',songSearch.album.name + '\n');
			console.log(endQuote);

		}//else
	});
}


//OMDB with newArg2
function movieThisArg2(){
	var omdb = 'http://www.omdbapi.com/?apikey=' + keys.omdbKey + '&t=' + newArg2;
	request(omdb, function(err, response, contents){
		if (err){
			console.log('failure');
		}else{//JSON.parse(contents) needs to be used to access the object
			console.log('\n'+'Neo: What are you trying to tell me? That I have use Google to look up movies?');
			console.log("Morpheus: No, Neo. I'm trying to tell you that when you're ready, you won't have to."+'\n');
			console.log('Title:', JSON.parse(contents).Title, '\n');
			console.log('Release Date:', JSON.parse(contents).Year, '\n');
			console.log('IMDB Rating:', JSON.parse(contents).imdbRating, '\n');
			console.log('Rotten Tomatoes Rating:', JSON.parse(contents).Ratings[1].Value, '\n');
			console.log('Produced in:', JSON.parse(contents).Country, '\n');
			console.log('Language:', JSON.parse(contents).Language, '\n');
			console.log('Plot:', JSON.parse(contents).Plot, '\n');
			console.log('Actors:', JSON.parse(contents).Actors, '\n');
			console.log(endQuote);
		};
	});
};


//OMDB no newArg2
function movieThisDefault(){
	var omdb = 'http://www.omdbapi.com/?apikey=' + keys.omdbKey + '&t=Mr.Nobody';
	request(omdb, function(err, response, contents){
		if (err){
			console.log('failure');
		}else{//JSON.parse(contents) needs to be used to access the object
			//wtf is the difference btwn JSON.parse and JSON.Stringify??
			console.log('\n'+'Neo: What are you trying to tell me? That I have use Google to look up movies?');
			console.log("Morpheus: No, Neo. I'm trying to tell you that when you're ready, you won't have to." + '\n');
			console.log('Title:', JSON.parse(contents).Title, '\n');
			console.log('Release Date:', JSON.parse(contents).Year, '\n');
			console.log('IMDB Rating:', JSON.parse(contents).imdbRating, '\n');
			console.log('Rotten Tomatoes Rating:', JSON.parse(contents).Ratings[1].Value, '\n');
			console.log('Produced in:', JSON.parse(contents).Country, '\n');
			console.log('Language:', JSON.parse(contents).Language, '\n');
			console.log('Plot:', JSON.parse(contents).Plot, '\n');
			console.log('Actors:', JSON.parse(contents).Actors, '\n');
			console.log(endQuote);
		};//else
	});//if
};




if (arg === `my-tweets`){
	tweetz();

//Order does matter. If switched with else if (arg === `spotify-this-song`), even with newArg2, will run specified first because condition is satisfied.
}else if (arg === `spotify-this-song` && newArg2 !== ""){
	spotifyArg2();

}else if (arg === `spotify-this-song`){
	spotifyDefault();

//Order matters again.
}else if (arg === 'movie-this' && newArg2 !== ""){
	movieThisArg2();

}else if (arg === 'movie-this'){
	movieThisDefault();

//Ugh this is hella long.
}else if (arg === 'do-what-it-says'){
	//idk how to make it shorter. help plz.
	//do-what-it-says
	fs.readFile('random.txt','UTF-8',function(err, text){
		if(err){
			console.log('failure');
		}else{
			console.log('\n'+'LIRI: There is no input.')
			console.log('Neo: There is no input?');
			console.log("LIRI: Then you'll see, that it is not the user that inputs, it is only random.txt."+'\n');

			var textSplit = text.split(",");
			arg = textSplit[0];

			//in case there is no index[1] in random.txt
			if (textSplit[1] !== undefined){
				newArg2 = textSplit[1];
			};

			if(arg === `my-tweets`){
				tweetz();
			}else if(arg === `spotify-this-song` && newArg2 !== ""){
				spotifyArg2();
			}else if(arg === `spotify-this-song`){
				spotifyDefault();
			}else if(arg === 'movie-this' && newArg2 !== ""){
				movieThisArg2();
			}else if(arg === 'movie-this'){
				movieThisDefault();
			}else{
				console.log('Morpheus: This is your last chance. After this, there is no turning back. You take the blue pill - the story ends, you wake up in your bed and believe whatever you want to believe. You take the red pill - you stay in Wonderland and I show you how deep LIRI goes.');
			};
		};
	});//fs

}else{
	console.log('Morpheus: This is your last chance. After this, there is no turning back. You take the blue pill - the story ends, you wake up in your bed and believe whatever you want to believe. You take the red pill - you stay in Wonderland and I show you how deep LIRI goes.');
}