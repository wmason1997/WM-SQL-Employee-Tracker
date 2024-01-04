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

async function viewAllDepartments() {
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

function addDepartment() {
  return prompt([
    {
      type: "input",
      name: "departmentName",
      message: "What is the name of the department?",
    }
  ]).then(async answers => { 
    await connection.promise().query(`INSERT INTO department (name) VALUES ("${answers.departmentName}")`);
    return viewAllDepartments();
    })
}

async function addRole() {
  const [departments] = await connection.promise().query('SELECT * FROM department');
  return prompt([
    {
      type: "input",
      name: "roleName",
      message: "What is the name of the role?",
    },
    {
      type: "input",
      name: "roleSalary",
      message: "What is the salary of the role?",
    },
    {
      type: "list",
      name: "roleDepartment",
      choices: departments.map(({id, name}) => ({value: id, name})),
    }
  ]).then(async answers => { 
    await connection.promise().query(`INSERT INTO role (title, salary, department_id) VALUES ("${answers.roleName}", "${answers.roleSalary}", ${answers.roleDepartment})`);
    return viewAllRoles();
    })
}

async function addEmployee() {
  const [employees] = await connection.promise().query('SELECT * FROM employee');
  const [roles] = await connection.promise().query('SELECT * FROM role');
  return prompt([
    {
      type: "input",
      name: "firstName",
      message: "What is the employee's first name?",
    },
    {
      type: "input",
      name: "lastName",
      message: "What is the employee's last name?",
    },
    {
      type: "list",
      name: "employeeRole",
      choices: roles.map(({id, title}) => ({value: id, name: title})),
      message: "What is the employee's role?",
    },
    {
      type: "list",
      name: "employeeManager",
      choices: employees.map(({id, first_name, last_name}) => ({value: id, name: `${first_name} ${last_name}`})),
      message: "Who is the employee's manager?",
    }
  ]).then(async answers => { 
    await connection.promise().query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${answers.firstName}", "${answers.lastName}", ${answers.employeeRole}, ${answers.employeeManager})`);
    return viewAllEmployees();
  });
}

async function updateEmployeeRole() {
  const [employees] = await connection.promise().query('SELECT * FROM employee');
  const [roles] = await connection.promise().query('SELECT * FROM role');
  return prompt([
    {
      type: "list",
      name: "employeeToUpdateRole",
      choices: employees.map(({id, first_name, last_name}) => ({value: id, name: `${first_name} ${last_name}`})),
      message: "Which employee's role do you want to update?",
    },
    {
      type: "list",
      name: "employeeNewRole",
      choices: roles.map(({id, title}) => ({value: id, name: title})),
      message: "Which role do you want to assign the selected employee?",
    }
  ]).then(async answers => {
    await connection.promise().query(`UPDATE employee SET role_id = ${answers.employeeNewRole} WHERE id = ${answers.employeeToUpdateRole}`); // update query instruction
    return viewAllEmployees();
  })
};

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
    case "Add Department":
      return addDepartment().then((results) => {
        console.log('All Departments:');
        console.table(results[0]);
      });

    // "Add Role" case
    // case "Add Role":
    case "Add Role":
      return addRole().then((results) => {
        console.log('All Roles:');
        console.table(results[0]);
      });

    // "Add Employee" case
    case "Add Employee":
      return addEmployee().then((results) => {
        console.log('All Employees:');
        console.table(results[0]);
      });

    // "Update Employee Role" case
    case "Update Employee Role":
      return updateEmployeeRole().then((results) => {
        console.log('All Employees:');
        console.table(results[0]);
      });

    // "Quit" case
    case "Quit":
      connection.end();
      process.exit();

    // Handle other prompt choices here (EC attempts)

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
        "Quit",
      ],
    },
  ]).then((answers) => {
    const { promptChoice } = answers;
    handlePromptChoice(promptChoice).then(() => {
      //connection.end(); // Close the MySQL connection // Commented this out since we only want it to end when quit is selected.
      loadPrompts(); // Exit the Node.js process
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