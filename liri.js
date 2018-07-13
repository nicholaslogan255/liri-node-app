// Load the NPM Packages: inquirer, request, twitter, dotenv
// const inquirer = require("inquirer");
const request = require("request");
const Twitter = require('twitter');
const Spotify = require('node-spotify-api');
const fs = require("fs");
require('dotenv').config()

// create instances of spotify and twitter objects with keys loaded in from the keys.js file
// TODO update keys.js with working keys
let keys = require("./keys.js");
let spotify = new Spotify(keys.spotify);
let client = new Twitter(keys.twitter);

let searchTerm;
if (process.argv[3] != null) {
    // combine all user arguments after the first one into one string
    searchTerm = process.argv.splice(3).join(" ");
}
// else {
//     console.log("NOTICE: No search term | Using default values when applicable.");
// }

// interpret the first two user arguments and return the desired result
interpret(process.argv[2], searchTerm);

//  a function that takes in a possible command & search term and returns corresponding data
//  function exists for possible recursive call in do-what-it-says
function interpret(searchCommand, searchValue) {

    // determine if first element is one of the predefined commands
    switch (searchCommand) {
        case "my-tweets":
            LOG("Running my-tweets");

            // let numTweetsToFind = 20;

            // if user entered a number argument after 'my-tweets', update numTweetsToFind to argument
            // if (searchValue != null && !isNaN(searchValue)) {
            //     numTweetsToFind = searchValue;
            // }

            // searches for the tweets
            findTweets();

            break;
        case "spotify-this-song":
            LOG("Running spotify-this-song");

            let songToSearch = "The Sign  Ace of Base";

            // if user entered song argument after 'spotify-this-song'...
            if (searchValue != null) {
                
                songToSearch = searchValue; // .. use that song instead of default
            }

            console.log("Searching for: ", songToSearch);
            findSong(songToSearch);

            break;
        case "movie-this":
            LOG("Running movie-this");

            let movieToSearch = "Mr. Nobody"; // default movie

            // if user argument exists for movie, search for that to movie instead of default
            if (searchValue != null) { movieToSearch = searchValue }
            console.log("Searching for: ", movieToSearch);

            findMovie(movieToSearch); // search for the movie
            break;
        case "do-what-it-says":
            LOG("Running do-what-it-says");

            // pull instruction from the random.txt
            fs.readFile("random.txt", "utf8", function (err, data) {
                if (!err) {
                    // split text file into an array using the comma as a delimeter
                    let instructArr = data.split(",");

                    // if the first value is not the read from a file instruction (to avoid infinite loop)
                    if (instructArr[0] != "do-what-it-says") {
                        // run the liri search on the file contents
                        interpret(instructArr[0], instructArr[1]);
                    }

                }
            });
            break;

        default:
            console.log(`ERROR: Missing/invalid argument | Must be one of the following: 
        my-tweets
        spotify-this-song
        movie-this
        do-what-it-says`);
    }
}

// searches for the inputted movie via omdb and logs important statistics
function findMovie(movieSearch) {
    request("http://www.omdbapi.com/?t=" + movieSearch + "&y=&plot=short&apikey=trilogy", function (error, response, body) {

        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {

            // Log the results (custom log function will log to both console and log.txt file)
            LOG("--------------------------------");
            LOG("The movie's title is: " + JSON.parse(body).Title);
            LOG("The movie's release year is: " + JSON.parse(body).Year);
            LOG("The movie's imbd rating is: " + JSON.parse(body).imdbRating);
            LOG("The movie's rotton tomatoes rating is: " + JSON.parse(body).Ratings[1].Value);
            LOG("The movie's country of origin is: " + JSON.parse(body).Country);
            LOG("The movie's language is: " + JSON.parse(body).Language);
            LOG("The movie's plot is: \n" + JSON.parse(body).Plot);
            LOG("The movie's actors are: " + JSON.parse(body).Actors);
        }
    });
}


function findTweets() {

    var params = { screen_name: 'DeveloperNic' };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {

            // Log the results (custom log function will log to both console and log.txt file)
            LOG("--------------------------------");

            // log the tweets
            for(var i in tweets){
                LOG(tweets[i].text);
            }
            
        }
    });

}

// gets the song from the spotify api
function findSong(songSearch) {

    spotify.search({ type: 'track', query: songSearch }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        // Log the results (custom log function will log to both console and log.txt file)
        LOG("--------------------------------");
        LOG("Album: "+ JSON.stringify(data.tracks.items[0].album.name));
        LOG("Release Date: "+ JSON.stringify(data.tracks.items[0].album.release_date));
        LOG("Song Name: "+ JSON.stringify(data.tracks.items[0].name));
        LOG("Artist(s): "+ JSON.stringify(data.tracks.items[0].album.artists[0].name));
        LOG("Preview URL: "+ JSON.stringify(data.tracks.items[0].preview_url));
    });

}

// create function that logs important info to the terminal and to the log.txt file
function LOG(stringToLog){

    console.log(stringToLog); // log the traditional way (lame)

    let formattedStr = stringToLog + "\n"

    // append formmated string to the log.txt file  (it will be in the current folder) {Cool!}
    fs.appendFile("log.txt", formattedStr, function (err) {

        // If the code experiences any errors it will log the error to the console.
        if (err) {
            return console.log(err);
        }
    });

}

