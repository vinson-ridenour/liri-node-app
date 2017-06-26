'use strict';

var keys = require("./keys.js");
var keysListTwitter = keys.twitterKeys;
var keysListSpotify = keys.spotifyKeys;
var request = require('request');
var inquirer = require("inquirer");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var moment = require("moment");
var fs = require("fs");
var userAction = process.argv[2];
var userActionItem = process.argv[3];

getUserAction(userAction);

function getUserAction(userAction) {
  if (userAction === "my-tweets") {
    getTweets();
  }
  else if (userAction === "spotify-this-song") {
    getSong(userActionItem);
  }
  else if (userAction === "movie-this") {
    getMovie(userActionItem);
  }
  else if (userAction === "do-what-it-says") {
    // grab text from random.txt and use it to spotify-this-song
  }
  else {
    console.log("ERROR!");
  }
}

function getTweets() {
  //Twitter
  console.log("Vinse tweeted: ");

  var client = new Twitter({
        consumer_key: keysListTwitter.consumer_key,
        consumer_secret: keysListTwitter.consumer_secret,
        access_token_key: keysListTwitter.access_token_key,
        access_token_secret: keysListTwitter.access_token_secret
    });

  var params = {
    screen_name: 'RidenourVinse',
    count: 20
  };

  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    	console.log("It is " + moment().format("MMM Do YYYY, hh:mm:ss a"));
        console.log(tweets[0].created_at);
        console.log(tweets[0].text);
        if (error) {
            console.log('ERROR!');
        }
    });
  append('my-tweets');
}

function getSong() {
    if (userActionItem !== undefined) {
        console.log(userActionItem);

        var spotify = new Spotify({
          id: '72e1001851744d73ae721e3d33c8f35f',
          secret: 'fff69320e9b844148331237fd0377559'
        });
  spotify.search({
    type: 'track', 
    query: userActionItem,
    limit: 1
  }, function(err, data) {
            if (err) {
                return console.log(err);
            }
            console.log("It is " + moment().format("MMM Do YYYY, hh:mm:ss a"));
            console.log('Artist: ', data.tracks.items[0].album.artists[0].name);
            console.log('Name: ', data.tracks.items[0].name);
            console.log('Preview Link: ', data.tracks.items[0].album.preview_url);
            console.log('Album: ', data.tracks.items[0].album.name);
        });
    } 
    else {
        console.log('Try again!');
    }
    append('spotify-this-song');
}

function getMovie() {
  
    if (userActionItem !== undefined) {
        var movie = userActionItem;
        var queryURL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=40e9cece";
        request(queryURL, function(error, response, body) {
            // If the request was successful...
            var results = JSON.parse(body);
            if (!error && response.statusCode === 200) {
            	console.log("It is " + moment().format("MMM Do YYYY, hh:mm:ss a"));
                console.log('Title: ', results.Title);
                console.log('Release Year: ', results.Year);
                console.log('Rating: ', results.Ratings[0].Value);
                console.log('Country: ', results.Country);
                console.log('Language: ', results.Language);
                console.log('Plot: ', results.Plot);
                console.log('Actors: ', results.Actors);
                // console.log('Rotten Tomatoes URL: ');
            } 
            else {
                console.log('Movie could not be found!')
            }
        });
    } 
    else {
        var movie = 'Mr. Nobody';
        var queryURL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=40e9cece";
        request(queryURL, function(error, response, body) {
            // If successful
            if (!error && response.statusCode === 200) {
            	console.log("It is " + moment().format("MMM Do YYYY, hh:mm:ss a"));
                console.log('Title: ', JSON.parse(body).Title);
                console.log('Release year: ', JSON.parse(body).Year);
                console.log('Rating: ', JSON.parse(body).Ratings[0].Value);
                console.log('Country: ', JSON.parse(body).Country);
                console.log('Language: ', JSON.parse(body).Language);
                console.log('Plot: ', JSON.parse(body).Plot);
                console.log('Actors: ', JSON.parse(body).Actors);
                // console.log('Rotten Tomatoes URL: ', 'Umm...?');
            } else {
                // if error
                console.log("We/'re sorry, we ran into an error!");
            }
        });
    }
    append('movie-this');
}

function getWhatever() {
    fs.readFile('random.txt', 'utf8', function(error, data) {
        if (error) {
            return console.log(error);
        }
        console.log("It is "+ moment().format("MMM Do YYYY, hh:mm:ss a"));
        console.log(data);
        var dataArray = data.split(',');
        // console.log(dataArray);
        userActionItem = dataArray[1];
        getUserAction(dataArray[0]);
    });
    append('do-what-it-says');
}

function append(argv) {
    fs.appendFile('log.txt', argv + ', ', function(error) {
        if (error) {
            return console.log(err);
        } 
        else {
            console.log("New info added!");
        }
    });
}
