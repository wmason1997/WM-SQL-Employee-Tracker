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

// Was not able to get this EC working yet.
// async function updateEmployeeManager() {
//   const [employees] = await connection.promise().query('SELECT * FROM employee');
//   const [managers] = await connection.promise().query('SELECT DISTINCT manager_id FROM employee');
//   return prompt([
//     {
//       type: "list",
//       name: "employeeToUpdateManager",
//       choices: employees.map(({id, first_name, last_name}) => ({value: id, name: `${first_name} ${last_name}`})),
//       message: "For which employee do you want to update their manager?",
//     },
//     {
//       type: "list",
//       name: "newManager",
//       choices: managers.map(({manager_id, first_name, last_name}) => ({value: manager_id, name: `${first_name} ${last_name}`})),
//       message: "Who will be their new manager?",
//     }
//   ]).then(async answers => {
//     await connection.promise().query(`UPDATE employee SET manager_id = ${answers.newManager} WHERE id = ${answers.employeeToUpdateManager}`);
//     return viewAllEmployees();
//   });
// };

async function deleteDepartment() {
  const [departments] = await connection.promise().query('SELECT * from department');
  return prompt([
    {
      type: "list",
      name: "departmentToDelete",
      choices: departments.map(({id, name}) => ({value: id, name: name})),
      message: "Which department do you want to delete?",
    }
  ]).then(async answers => {
    await connection.promise().query(`DELETE FROM department WHERE id = ${answers.departmentToDelete}`);
    return viewAllDepartments();
  })
};

async function deleteRole() {
  const [roles] = await connection.promise().query('SELECT * FROM role');
  return prompt([
    {
      type: "list",
      name: "roleToDelete",
      choices: roles.map(({id, title}) => ({value: id, name: title})),
      message: "Which role do you want to delete?",
    }
  ]).then(async answers => {
    await connection.promise().query(`DELETE FROM role WHERE id = ${answers.roleToDelete}`);
    return viewAllRoles();
  })
};

async function deleteEmployee() {
  const [employees] = await connection.promise().query('SELECT * FROM employee');
  return prompt([
    {
      type: "list",
      name: "employeeToDelete",
      choices: employees.map(({id, first_name, last_name}) => ({value: id, name: `${first_name} ${last_name}`})),
      message: "Which employee do you want to delete?",
    }
  ]).then(async answers => {
    await connection.promise().query(`DELETE FROM employee WHERE id = ${answers.employeeToDelete}`);
    return viewAllEmployees();
  })
};

// Was not able to get this EC working yet either.
// async function viewEmployeesByManager() {
//   const [managers] = await connection.promise().query('SELECT DISTINCT manager_id, CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name FROM employee');
// };

async function viewEmployeesByDepartment() {
  const [departments] = await connection.promise().query('SELECT * from department');
  return prompt([
    {
      type: "list",
      name: "departmentToViewEmployeesBy",
      choices: departments.map(({id, name}) => ({value: id, name: name})),
      message: "Which department do you want to view employees by?",
    }
  ]).then(async answers => {
    const departmentId = answers.departmentToViewEmployeesBy;

    const query = `
      SELECT employee.id, employee.first_name, employee.last_name, role.title as role, role.salary, department.name as department
      FROM employee
      JOIN role ON employee.role_id = role.id
      JOIN department on role.department_id = department.id
      WHERE department.id = ?;
    `;

    const [employees] = await connection.promise().query(query, [departmentId]);
    console.log(`Employees in the selected department (${answers.departmentToViewEmployeesBy}):`);
    console.table(employees);
  });
};

function handlePromptChoice(promptChoice) {
  switch (promptChoice) {
    // "View All Employees"
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
        //console.log(`Added ${departmentName} to the database.`);
        console.log('Added department to the database');
        console.log('All Departments:');
        console.table(results[0]);
        // console.log(`A`)
      });

    // "Add Role" case
    // case "Add Role":
    case "Add Role":
      return addRole().then((results) => {
        console.log('Added role to the database.');
        console.log('All Roles:');
        console.table(results[0]);
      });

    // "Add Employee" case
    case "Add Employee":
      return addEmployee().then((results) => {
        console.log('Added employee to the database.');
        console.log('All Employees:');
        console.table(results[0]);
      });

    // "Update Employee Role" case
    case "Update Employee Role":
      return updateEmployeeRole().then((results) => {
        console.log("Updated employee's role");
        console.log('All Employees:');
        console.table(results[0]);
      });

    // "Update Employee Manager" case
    // case "Update Employee Manager":
    //   return updateEmployeeManager().then((results) => {
    //     console.log('Manager updated');
    //     console.log('All Employees:');
    //     console.table(results[0]);
    //   });

    // "Delete a Department" case
    case "Delete a Department":
      return deleteDepartment().then((results) => {
        console.log("Deleted department.");
        console.log('All Departments:');
        console.table(results[0]);
      });


    // "Delete a Role" case
    case "Delete a Role":
      return deleteRole().then((results) => {
        console.log("Deleted role.");
        console.log('All Roles:');
        console.table(results[0]);
      });

    // "Delete an Employee" case
    case "Delete an Employee":
      return deleteEmployee().then((results) => {
        console.log("Deleted employee.");
        console.log('All Employees:');
        console.table(results[0]);
      });

    // // "View Employees by Manager"
    // case "View Employees by Manager":
    //   return viewEmployeesByManager().then((results) => {
    //   });

    // "View Employees by Department"
    case "View Employees by Department":
      return viewEmployeesByDepartment().then((results) => {
      });

    // "Quit" case
    case "Quit":
      connection.end();
      process.exit();

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
        "Delete a Department",
        "Delete a Role",
        "Delete an Employee",
        //"View Employees by Manager",
        "View Employees by Department",
        //"Update Employee Manager",
        //"View Total Utilized Budget of a Department",
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