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
          break;
        case "View All Roles":
          console.log("View All Roles Case");
          break;
        case "View All Employees":
          console.log("View All Employees Case");
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
