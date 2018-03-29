require("dotenv").config();

var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('file-system');

var spotify = new Spotify( {
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
    });
var client = new Twitter( { 
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    });

var command = process.argv[2]
var dirObject = process.argv.splice(3, process.argv.length)
var params = []
var songQ = ""
var movieFilm = ""

function getTweets() {
    if (command == "get-tweets") {
        if(!dirObject.length){
            params = {
                screen_name: '@jane_fausse', 
                count: 20
            }
        }
        else {
            params = {
                screen_name: dirObject[0], 
                count: 20
            }
        }
        runTwitter()
    }
}

getTweets()

function getSongs() {
    if (command == "spotify-this-song") {
        if(!dirObject.length){
            songQ = "The Sign Ace of Base"
        }
        else {
            songQ = dirObject;
        }
        runSpotify()
    }
}
getSongs()

function getMovies() {
    if (command == "movie-this") {
        if(!dirObject.length){
            movieFilm ="Mr. Nobody"
        }
        else {
            movieFilm = dirObject.join(" ")  
        }
        runOmdb()
    }
}
getMovies()

function randomTask() {
    if (command == "do-what-it-says") {
        runRandom()
    }
}
randomTask()

function runTwitter() {
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            for (var i=0; i<tweets.length; i++){
                console.log(tweets[i].created_at + " : "+tweets[i].text)
                fs.appendFile('log.txt', tweets[i].created_at + " : "+tweets[i].text +'\r\n', function (e){
                    if(e){console.log(e)}
                })
            }
        }
    })
}

function runSpotify(){
    spotify
    .search({ type: 'track', query: songQ, limit: 1})
    .then(function(response) {
    console.log("Artist: "+response.tracks.items[0].artists[0].name)
    console.log("Song Name: "+response.tracks.items[0].name)
    console.log("Preview: "+response.tracks.items[0].preview_url)
    console.log("Album: "+response.tracks.items[0].album.name)
    fs.appendFile('log.txt', "Artist: "+response.tracks.items[0].artists[0].name +'\r\n' 
                            + "Song Name: "+response.tracks.items[0].name +'\r\n'
                            + "Preview: "+response.tracks.items[0].preview_url+'\r\n'
                            + "Album: "+response.tracks.items[0].album.name+'\r\n', function (e){
            if(e){console.log(e)}
        })
    })
    .catch(function(err) {
    console.log(err)
  })
}

function runOmdb() {
    request('http://www.omdbapi.com/?t=' + movieFilm + '&apikey=trilogy', function (error, response, body) {
        // console.log('error:', error); // Print the error if one occurred
        // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log("Title: "+JSON.parse(body).Title)
        console.log("Year: "+JSON.parse(body).Year)
        console.log("IMDB Rating: "+JSON.parse(body).imdbRating)
        console.log("Rotten Tomatoes Rating: "+JSON.parse(body).Ratings[1].Value)
        console.log("Country: "+JSON.parse(body).Country)
        console.log("Language: "+JSON.parse(body).Language)
        console.log("Synopsis: "+JSON.parse(body).Plot)
        console.log("Starring: "+JSON.parse(body).Actors)
        fs.appendFile('log.txt', "Title: "+JSON.parse(body).Title+'\r\n'
                                +"Year: "+JSON.parse(body).Year +'\r\n'
                                +"IMDB Rating: "+JSON.parse(body).imdbRating+'\r\n'
                                +"Rotten Tomatoes Rating: "+JSON.parse(body).Ratings[1].Value+'\r\n'
                                +"Country: "+JSON.parse(body).Country+'\r\n'
                                +"Language: "+JSON.parse(body).Language+'\r\n'
                                +"Synopsis: "+JSON.parse(body).Plot+'\r\n'
                                +"Starring: "+JSON.parse(body).Actors+'\r\n', function (e){
            if(e){console.log(e)}
        })
    })
}

function runRandom() {
    fs.readFile('random.txt', 'utf8', function(e,d){
        if(e){console.log(e)}
        var randomString = d
        var randomArr = randomString.split(" ", randomString.length)
        command = randomArr[0]
        dirObject = randomArr.splice(1, randomArr.length)
        getTweets()
        getSongs()
        getMovies()
    })
}