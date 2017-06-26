'use strict';

var require = require("./keys.js");
var request = require('request');
var inquirer = require("inquirer");

inquirer
  .prompt([
    // Creating the user prompts
    {
      type: "list",
      message: "What action do you want to take?",
      choices: ["Bulbasaur", "Squirtle", "Charmander"],
      name: "userChoice"
    },

    ])
  .then(function(inquirerResponse) {
    // If the inquirerResponse confirms, we displays the inquirerResponse's username and pokemon from the answers.
    if (inquirerResponse.confirm) {
      console.log("\nWelcome " + inquirerResponse.username);
      console.log("Your " + inquirerResponse.pokemon + " is ready for battle!\n");
    }
    else {
      console.log("\nThat's okay " + inquirerResponse.username + ", come again when you are more sure.\n");
    }
  });