const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // TODO: Add MySQL password here
    password: "",
    database: "company_db",
  },
  console.log(`Connected to the company_db database.`)
);

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
      console.log(answers);
      console.log(answers.action);
      switch (answers.action) {
        case "View All Departments":
          console.log("View All Departments Case");
          db.query(`SELECT * FROM department;`, (err, result) => {
            if (err) {
              console.log(err);
            } else {
              console.table(result);
            }
          });
          break;
        case "View All Roles":
          console.log("View All Roles Case");
          db.query(`SELECT * FROM roles;`, (err, result) => {
            if (err) {
              console.log(err);
            } else {
              console.table(result);
            }
          });
          break;
        case "View All Employees":
          console.log("View All Employees Case");
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
          break;
        case "Add a Department":
          console.log("Add a Department Case");
          break;
        case "Add a Role":
          console.log("Add a Role Case");
          break;
        case "Add an Employee":
          console.log("Add an Employee Case");
          break;
        case "Update an Employee Role":
          console.log("Update an Employee Role");
          break;
        default:
          console.log("Default Case");
      }
    });
};

prompts();
