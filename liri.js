// Load the NPM Package inquirer
const inquirer = require("inquirer");

// Load the NPM Package request
var request = require("request");

let command = process.argv[2]; // get first user argument

switch (command) {
    case "my-tweets":
        console.log("Running my-tweets");

        break;
    case "spotify-this-song":
        console.log("Running spotify-this-song");

        let songToSearch = "";

        if (process.argv[3] != null) { songToSearch = process.argv[3] }
        else { console.log(`ERROR: Missing argument | Must include song title`); }

        // TODO search for song

        break;
    case "movie-this":
        //console.log("Running movie-this");

        let movieToSearch = "'Mr. Nobody"; // default movie

        if (process.argv[3] != null) { movieToSearch = process.argv[3] } // use user argument to search for movies
        else {
            //console.log(`ERROR: Missing argument | Must include movie title`); 
        }

        // Then run a request to the OMDB API with the movie specified
        request("http://www.omdbapi.com/?t=" + movieToSearch + "&y=&plot=short&apikey=trilogy", function (error, response, body) {

            // If the request is successful (i.e. if the response status code is 200)
            if (!error && response.statusCode === 200) {

                // Parse the body of the site and recover just the imdbRating
                //console.log(JSON.parse(body));
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



        break;
    case "do-what-it-says":
        console.log("Running do-what-it-says");

        // Todo



        break;



    default:
        console.log(`ERROR: Missing argument | Must include one of the following: 
        my-tweets
        spotify-this-song
        movie-this
        do-what-it-says`);
}

// Create a "Prompt" with a series of questions.
// inquirer
//     .prompt([
//         {
//             type: "input",
//             message: "What is your name?",
//             name: "name"
//         }])
//     .then((inqResp) => {
//         console.log(`So you are ${inqResp.name}`);
//     });