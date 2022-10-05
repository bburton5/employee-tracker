const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "",
    database: "company_db",
  },
  console.log(`Connected to the company_db database.`)
);
// Function to query all departments
let viewAllDepartments = () => {
  db.query(`SELECT * FROM department;`, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.table(result);
    }
  });
};

// Function to query all roles
let viewAllRoles = () => {
  db.query(`SELECT * FROM roles;`, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.table(result);
    }
  });
};

// Function to query all employees
let viewAllEmployees = () => {
  db.query(
    `SELECT employee.id, employee.first_name, employee.last_name, roles.title, roles.salary, department.department_name FROM employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN department ON roles.department_id = department.id ORDER BY employee.id; `,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.table(result);
      }
    }
  );
};

// Function to add a department to db
let addADepartment = () => {
  inquirer
    .prompt([
      {
        name: "departmentName",
        type: "input",
        message: "What is the name of the department?",
      },
    ])
    .then((answers) => {
      console.log("inside department prompt");
      db.query(
        `INSERT INTO department (department_name)
              VALUES (?)`,
        answers.departmentName,
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            db.query(`SELECT * FROM department`, (err, result) => {
              if (err) {
                console.log(err);
              } else {
                console.table(result);
              }
            });
          }
        }
      );
    });
};

// Function to add a role to db
let addARole = () => {
  inquirer
    .prompt([
      {
        name: "roleTitle",
        type: "input",
        message: "What is the title of the role?",
      },
      {
        name: "roleSalary",
        type: "number",
        message: "What is this role's salary?",
      },
      {
        name: "roleDepartmentId",
        type: "number",
        message: "What department number is this role under?",
      },
    ])
    .then((answers) => {
      console.log("inside role prompt");
      db.query(
        `INSERT INTO roles (title, salary, department_id)
              VALUES (?, ?, ?)`,
        [answers.roleTitle, answers.roleSalary, answers.roleDepartmentId],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            db.query(`SELECT * FROM roles`, (err, result) => {
              if (err) {
                console.log(err);
              } else {
                console.table(result);
              }
            });
          }
        }
      );
    });
};

// Function to add an employee to db
let addAnEmployee = () => {
  inquirer
    .prompt([
      {
        name: "employeeFirstName",
        type: "input",
        message: "What is the employee's first name?",
      },
      {
        name: "employeeLastName",
        type: "input",
        message: "What is the employee's last name?",
      },
      {
        name: "employeeRole",
        type: "number",
        message: "What is the employee's role?",
      },
    ])
    .then((answers) => {
      console.log("inside add employee prompt");
      db.query(
        `INSERT INTO employee (first_name, last_name, role_id)
              VALUES (?, ?, ?)`,
        [
          answers.employeeFirstName,
          answers.employeeLastName,
          answers.employeeRole,
        ],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            db.query(`SELECT * FROM employee`, (err, result) => {
              if (err) {
                console.log(err);
              } else {
                console.table(result);
              }
            });
          }
        }
      );
    });
};

let employeeChoices = async () => {
  const employeeQuery = `SELECT CONCAT(employee.first_name, " ", employee.last_name) AS name FROM employee;`;
  const employees = await db.query(employeeQuery);
  return employees[0];
};

const prompts = async () => {
  return inquirer
    .prompt([
      {
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add a Department",
          "Add a Role",
          "Add an Employee",
          "Update an Employee Role",
        ],
      },
    ])
    .then((answers) => {
      switch (answers.action) {
        case "View All Departments":
          console.log("Running View All Departments Case");
          viewAllDepartments();
          break;
        case "View All Roles":
          console.log("Running View All Roles Case");
          viewAllRoles();
          break;
        case "View All Employees":
          console.log("Running View All Employees Case");
          viewAllEmployees();
          break;
        case "Add a Department":
          console.log("Running Add a Department Case");
          addADepartment();
          break;
        case "Add a Role":
          console.log("Running Add a Role Case");
          addARole();
          break;
        case "Add an Employee":
          console.log("Running Add an Employee Case");
          addAnEmployee();
          break;
        case "Update an Employee Role":
          console.log("Running Update an Employee Role Case");
          inquirer
            .prompt([
              {
                name: "employeeName",
                type: "list",
                message: "Which employee's role do you want to update?",
                choices: employeeChoices(),
              },
            ])
            .then((answers) => {
              console.log("inside Update Employee Role prompt");
              console.log(answers);
            });
          break;
        default:
          console.log("Default Case");
      }
    });
};

prompts();
