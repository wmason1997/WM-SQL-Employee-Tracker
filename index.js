const { prompt } = require("inquirer");
const mysql = require("mysql2");
const fs = require("fs/promises");
const path = require("path");

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'IlikeSQL',
  database: 'company_db',
});

function viewAllEmployees() {
  return fs.readFile(path.join(__dirname, 'db', 'viewAllEmployees.sql'), 'utf8')
    .then((querySql) => {
      return connection.promise().query(querySql); // Use promise().query for promises
    });
}

function viewAllDepartments() {
  return fs.readFile(path.join(__dirname, 'db', 'viewAllDepartments.sql'), 'utf8')
  .then((querySql) => {
    return connection.promise().query(querySql); // Use promise().query for promises
  });
}

function viewAllRoles() {
  return fs.readFile(path.join(__dirname, 'db', 'viewAllRoles.sql'), 'utf8')
  .then((querySql) => {
    return connection.promise().query(querySql); // Use promise().query for promises
  });
}

function handlePromptChoice(promptChoice) {
  switch (promptChoice) {
    case "View All Employees":
      return viewAllEmployees().then((results) => {
        console.log('All Employees:');
        console.table(results[0]);
      });


    // "View All Roles" case
    case "View All Roles":
      return viewAllRoles().then((results) => {
        console.log('All Roles:');
        console.table(results[0]);
      });


    // "View All Departments" case 
    case "View All Departments":
      return viewAllDepartments().then((results) => {
        console.log('All Departments:');
        console.table(results[0]);
      });

    // "Add Department" case
    // case "Add Department":

    
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
      connection.end(); // Close the MySQL connection
      process.exit(); // Exit the Node.js process
    });
  }).catch((error) => {
    console.error("Error during prompt:", error);
    connection.end();
    process.exit();
  });
}

function init() {
  loadPrompts();
}

// Initialize the program
init();