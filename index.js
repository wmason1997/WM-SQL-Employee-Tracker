const { prompt } = require("inquirer");
const mysql = require("mysql2");
const fs = require("fs/promises");
const path = require("path");

const connection = mysql.createConnection({
  host: 'your_database_host',
  user: 'your_database_user',
  password: 'your_database_password',
  database: 'your_database_name',
});

function viewAllEmployees() {
  return fs.readFile(path.join(__dirname, 'db', 'seeds.sql'), 'utf8')
    .then((querySql) => {
      return connection.query(querySql);
    });
}

function handlePromptChoice(promptChoice) {
  switch (promptChoice) {
    case "View All Employees":
      return viewAllEmployees().then((results) => {
        console.log('All Employees:');
        console.table(results);
      });

    // Handle other prompt choices here

    default:
      console.log("Invalid choice");
  }
}

function loadPrompts() {
  prompt([
    {
      type: "list",
      name: "promptChoice",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "Add Employee",
        "Update Employee Role",
        "View All Roles",
        "Add Role",
        "View All Departments",
        "Add Department",
      ],
    },
  ]).then((answers) => {
    const { promptChoice } = answers;
    handlePromptChoice(promptChoice).then(() => {
      // After handling the choice, you can call another function or exit the program
      // For example: loadPrompts();
      loadPrompts();
    });
  });
}

function init() {
  loadPrompts();
}

// Initialize the program
init();