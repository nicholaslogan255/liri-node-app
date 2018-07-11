// Load the NPM Package inquirer
const inquirer = require("inquirer");


let command = process.argv[2]; // get first user argument

switch (command) {
    case "my-tweets":
        console.log("Running my-tweets");

        break;
    case "spotify-this-song":
        console.log("Running spotify-this-song");

        let songToSearch = "";

        if(process.argv[3] != null ){songToSearch = process.argv[3]}
        else{console.log(`ERROR: Missing argument | Must include song title`);}

        // TODO search for song

        break;
    case "movie-this":
        console.log("Running movie-this");

        if(process.argv[3] != null ){songToSearch = process.argv[3]}
        else{console.log(`ERROR: Missing argument | Must include movie title`);}



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