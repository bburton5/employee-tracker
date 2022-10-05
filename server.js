// Imports
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
      prompts();
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
      prompts();
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
        prompts();
      }
    }
  );
};

// Function to add a department to db
let addADepartment = async () => {
  let response = await inquirer.prompt([
    {
      name: "departmentName",
      type: "input",
      message: "What is the name of the department?",
    },
  ]);

  db.query(
    `INSERT INTO department (department_name)
              VALUES (?)`,
    response.departmentName,
    (err, result) => {
      if (err) console.log(err);
      console.log("Department added successfully!");
    }
  );
  db.query(`SELECT * FROM department;`, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.table(result);
      prompts();
    }
  });
};

// Function to query departments outside of inquirer/without calling prompt()
let queryDepartments = () => {
  return new Promise((resolve, reject) => {
    let theActualQuery = `SELECT * FROM department`;
    db.query(theActualQuery, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

// Function to add a role to db
let addARole = async () => {
  console.log("inside the addARole async function");
  let queriedDepartments = await queryDepartments();
  let responses = await inquirer.prompt([
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
      name: "department",
      type: "list",
      choices: queriedDepartments.map(
        (department) => department.department_name
      ),
      message: "What department is this role under?",
    },
  ]);

  queriedDepartments.forEach((department) => {
    if (department.department_name === responses.department) {
      responses.department = department.id;
    }
  });

  db.query(
    `INSERT INTO roles SET ?`,
    {
      title: responses.roleTitle,
      salary: responses.roleSalary,
      department_id: responses.department,
    },
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Role added successfully!");
        db.query(`SELECT * FROM roles`, (err, result) => {
          if (err) {
            console.log(err);
          } else {
            console.table(result);
            prompts();
          }
        });
      }
    }
  );
};

// Function to add an employee to db
let addAnEmployee = async () => {
  db.query("SELECT * FROM roles", async (err, roless) => {
    if (err) {
      console.log(err);
    }

    const responses = await inquirer.prompt([
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
        type: "list",
        message: "What is the employee's role?",
        choices: roless.map((roles) => ({
          name: roles.title,
          value: roles.id,
        })),
      },
    ]);

    db.query(
      `INSERT INTO employee SET?`,
      {
        first_name: responses.employeeFirstName,
        last_name: responses.employeeLastName,
        role_id: responses.employeeRole,
      },
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Employee added successfully!");
          db.query(`SELECT * FROM employee`, (err, result) => {
            if (err) {
              console.log(err);
            } else {
              console.table(result);
              prompts();
            }
          });
        }
      }
    );
  });
};

// Function to update an employee info in db
let updateAnEmployeeRole = async () => {
  db.query(`SELECT * FROM employee`, async (err, employees) => {
    if (err) {
      console.log(err);
    }
    let employeeSelected = await inquirer.prompt([
      {
        name: "employeeName",
        type: "list",
        message: "Which employee's role do you want to update?",
        choices: employees.map((employee) => ({
          name: employee.first_name + " " + employee.last_name,
          value: employee.id,
        })),
      },
    ]);

    db.query(`SELECT * FROM roles`, async (err, roles) => {
      if (err) {
        console.log(err);
      }
      let roleSelected = await inquirer.prompt([
        {
          name: "employeeRole",
          type: "list",
          message:
            "Which role would you like to update this employee's role to?",
          choices: roles.map((role) => ({
            name: role.title,
            value: role.id,
          })),
        },
      ]);

      db.query(
        `UPDATE employee SET ? WHERE ?`,
        [
          {
            role_id: roleSelected.employeeRole,
          },
          {
            id: employeeSelected.employeeName,
          },
        ],
        (err, result) => {
          if (err) {
            console.log(err);
          }
          console.log("Employee updated successfully!");
          console.log(viewAllEmployees());
          prompts();
        }
      );
    });
  });
};

// All possible repeated prompts
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
          updateAnEmployeeRole();
          break;
        default:
          console.log("Please select a valid case/option");
      }
    });
};

prompts();
