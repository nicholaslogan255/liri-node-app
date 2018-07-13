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

// combine all user arguments after the first one into one string
let searchTerm = process.argv.splice(3).join(" ");

// interpret the first two user arguments and return the desired result
interpret(process.argv[2], searchTerm);

//  a function that takes in a possible command & search term and returns corresponding data
//  function exists for possible recursive call in do-what-it-says
function interpret(searchCommand, searchValue) {

    // determine if first element is one of the predefined commands
    switch (searchCommand) {
        case "my-tweets":
            console.log("Running my-tweets");

            let numTweetsToFind = 20;

            // if user entered a number argument after 'my-tweets', update numTweetsToFind to argument
            if (searchValue != null && !isNaN(searchValue) ){
                numTweetsToFind = searchValue;
            }

            findTweets(numTweetsToFind);

            break;
        case "spotify-this-song":
            console.log("Running spotify-this-song");

            let songToSearch = "The Sign";

            // if user entered song argument after 'spotify-this-song'...
            if (searchValue != null) {
                songToSearch = searchValue;
            }

            console.log("Searching for: ", songToSearch);
            findSong(songToSearch);               

            break;
        case "movie-this":
            //console.log("Running movie-this");

            let movieToSearch = "Mr. Nobody"; // default movie

            // if user argument exists for movie, search for that to search for movies
            if (searchValue != null) { movieToSearch = searchValue }

            findMovie(movieToSearch);
            break;
        case "do-what-it-says":
            console.log("Running do-what-it-says");

            // pull instruction from the random.txt
            fs.readFile("random.txt", "utf8", function (err, data) {
                if (!err) {
                    // split text file into an array using the comma as a delimeter
                    let instructArr = data.split(",");

                    // if the first value is not the read from a file instruction (to avoid infinite loop)
                   if(instructArr[0] != "do-what-it-says"){
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

            // Log the important statistics about the movie
            console.log("The movie's title is: " + JSON.parse(body).Title);
            console.log("The movie's release year is: " + JSON.parse(body).Year);
            console.log("The movie's imbd rating is: " + JSON.parse(body).imdbRating);
            console.log("The movie's rotton tomatoes rating is: " + JSON.parse(body).Ratings[1].Value);
            console.log("The movie's country of origin is: " + JSON.parse(body).Country);
            console.log("The movie's language is: " + JSON.parse(body).Language);
            console.log("The movie's plot is: \n" + JSON.parse(body).Plot);
            console.log("The movie's actors are: " + JSON.parse(body).Actors);
        }
    });
}

// TODO: implement twitter api
function findTweets() {

}

// gets the song from the spotify api

function findSong(songSearch) {

    spotify.search({ type: 'track', query: songSearch }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log(data);
        console.log("--------------------------------");
        console.log(data.tracks.items[0]);
        console.log("--------------------------------");
    
        console.log("Album: ", JSON.stringify(data.tracks.items[0].album));
        console.log("release: ", JSON.stringify(data.tracks.items[0].release_date));
    });

}

