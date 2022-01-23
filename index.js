// GIVEN a command-line application that accepts user input
// WHEN I start the application
// THEN I am presented with the following options: view all departments, view all roles, view all employees, 
      // add a department, add a role, add an employee, and update an employee role
// WHEN I choose to view all departments
// THEN I am presented with a formatted table showing department names and department ids
// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, 
      // departments, salaries, and managers that the employees report to
// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database
// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database

const inquirer = require('inquirer');
const consoleTable = require('console.table');
const mysql = require('mysql2');
const db = require('./db/connection');

//required classes and functions from other files
// const Engineer = require('./lib/Engineer.js');
// const Intern = require('./lib/Intern.js');
// const Manager = require('./lib/Manager.js');
// const { writeHtml } = require('./src/generatePage');

//global variable
// var employees = [];

const initialPrompt = () => {
  return inquirer.prompt([ 
    {
      type: 'checkbox',
      name: 'type',
      choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role']
    }
  ])
  .then(choice => {
    if (choice.type[0] === 'View all departments') {
      viewAllDept();
    } else if (choice.type[0] === 'View all roles'){
      viewAllRoles();
    } else if (choice.type[0] === 'View all employees'){
      viewAllEmp();
    } else if (choice.type[0] === 'Add a department'){
      addDept();
    } else if (choice.type[0] === 'Add a role'){
      addRole();
    } else if (choice.type[0] === 'Add an employee'){
      addEmp();
    } else if (choice.type[0] === 'Update an employee role'){
      updateEmp();
    }
  });
};

const viewAllDept = () => {
  db.promise().query('SELECT * FROM department;')
  .then( ([rows]) => {
    console.log(rows);
    console.table(rows);
  })
  .catch(console.log)
  .then( () => {
    initialPrompt();
  });
};

const viewAllRoles = () => {
  db.promise().query(`
  SELECT role.*, department.name AS department
  FROM role
  LEFT JOIN department ON role.department_id = department.id;
  `)
  .then( ([rows]) => {
    console.table(rows);
  })
  .catch(console.log)
  .then( () => {
    initialPrompt();
  });
};

const viewAllEmp = () => {
  db.promise().query(`
  SELECT e.id AS 'Employee ID#',
      e.first_name AS'First Name', 
      e.last_name AS'Last Name', 
      role.salary AS Salary, 
      department.name AS Department, 
      m.first_name AS 'Manager First Name',
      m.last_name AS 'Manager Last Name'
  FROM employee e
  LEFT JOIN role ON e.role_id = role.id
  LEFT JOIN department ON role.department_id = department.id
  LEFT JOIN employee m ON m.id = e.manager_id;
  `)
  .then( ([rows]) => {
    console.table(rows);
  })
  .catch(console.log)
  .then( () => {
    initialPrompt();
  });
};

const addDept = () => {
  return inquirer.prompt([ 
    {
      type: 'input',
      name: 'departmentName',
      message: `What the department's name? (Required)`,
      validate: departmentInput => {
        if (departmentInput) {
          return true;
        } else {
          console.log(`Please enter the department's name!`);
          return false;
        }
      }
    },
  ])
  .then(choice => {
    db.promise().query(`
    INSERT INTO department
      (name)
    VALUES
      ('${choice.departmentName}');`
    )
    .catch(console.log)
    .then( () => {
      console.log('Department added successful!');
      initialPrompt();
    });
  });
};

// salary, and department
const addRole = () => {
  return inquirer.prompt([ 
    {
      type: 'input',
      name: 'roleTitle',
      message: `What the role's title? (Required)`,
      validate: roleTitleInput => {
        if (roleTitleInput) {
          return true;
        } else {
          console.log(`Please enter the role's title!`);
          return false;
        }
      }
    },
    {
      type: 'input',
      name: 'roleSalary',
      message: `What the role's salary? (Required)`,
      validate: roleSalaryInput => {
        if (roleSalaryInput) {
          return true;
        } else {
          console.log(`Please enter the role's salary!`);
          return false;
        }
      }
    },
    {
      type: 'input',
      name: 'roleDept',
      message: `What the role's department? (Required)`,
      validate: roleDeptInput => {
        if (roleDeptInput) {
          return true;
        } else {
          console.log(`Please enter the role's department!`);
          return false;
        }
      }
    },
  ])
  .then(role => {
    db.promise().query(`
    INSERT INTO role
      (title, salary, department_id)
    VALUES
      ('${role.roleTitle}', ${role.roleSalary}, ${role.roleDept});`
    )
    .catch(console.log)
    .then( () => {
      console.log('Role added successful!');
      initialPrompt();
    });
  });
};

const addEmp = () => {
  return inquirer.prompt(empQuestions)
  .then(emp => {
    console.log(emp);
    if (emp.confirmManager){
      db.promise().query(`
      INSERT INTO employee
        (first_name, last_name, role_id)
      VALUES
        ('${emp.empFirstName}', '${emp.empLastName}', ${emp.empRole});`
      )
      .catch(console.log)
      .then( () => {
        console.log('Employee added successful!');
        initialPrompt();
      });
    } else {
      db.promise().query(`
      INSERT INTO employee
        (first_name, last_name, role_id, manager_id)
      VALUES
        ('${emp.empFirstName}', '${emp.empLastName}', ${emp.empRole}, ${emp.empManager});`
      )
      .catch(console.log)
      .then( () => {
        console.log('Employee added successful!');
        initialPrompt();
      });
    }
  });
};

const updateEmp = () => {
  return inquirer.prompt(empQuestions)
  .then(emp => {
    console.log(emp);
    if (emp.confirmManager){
      db.promise().query(`
      UPDATE employee
      SET first_name = '${emp.empFirstName}', last_name = '${emp.empLastName}', role_id = '${emp.empRole}'
      WHERE id = 1;
      INSERT INTO employee
        (first_name, last_name, role_id)
      VALUES
        ('${emp.empFirstName}', '${emp.empLastName}', ${emp.empRole});`
      )
      .catch(console.log)
      .then( () => {
        console.log('Employee added successful!');
        initialPrompt();
      });
    } else {
      db.promise().query(`
      INSERT INTO employee
        (first_name, last_name, role_id, manager_id)
      VALUES
        ('${emp.empFirstName}', '${emp.empLastName}', ${emp.empRole}, ${emp.empManager});`
      )
      .catch(console.log)
      .then( () => {
        console.log('Employee added successful!');
        initialPrompt();
      });
    }
  });
};

const empQuestions =
[ 
  {
    type: 'input',
    name: 'empFirstName',
    message: `What the employee's first name? (Required)`,
    validate: empFirstNameInput => {
      if (empFirstNameInput) {
        return true;
      } else {
        console.log(`Please enter the employee's first name!`);
        return false;
      }
    }
  },
  {
    type: 'input',
    name: 'empLastName',
    message: `What the employee's last name? (Required)`,
    validate: empLastNameInput => {
      if (empLastNameInput) {
        return true;
      } else {
        console.log(`Please enter the employee's last name!`);
        return false;
      }
    }
  },
  {
    type: 'input',
    name: 'empRole',
    message: `What the employee's role? (Required)`,
    validate: empRoleInput => {
      if (empRoleInput) {
        return true;
      } else {
        console.log(`Please enter the employee's role!`);
        return false;
      }
    }
  },
  {
    type: 'confirm',
    name: 'confirmManager',
    message: 'Is this employee a manger?',
    default: false
  },
  {
    type: 'input',
    name: 'empManager',
    message: `Who is the employee's manager? (Required)`,
    validate: empManagerInput => {
      if (empManagerInput) {
        return true;
      } else {
        console.log(`Please enter the employee's manager!`);
        return false;
      }
    },
    when: ({confirmManager}) => !confirmManager
  }
];

initialPrompt();

// initial prompts, globally used for all employees
// const promptUser = (type) => {
//   return inquirer.prompt([
//     {
//       type: 'input',
//       name: 'employeeName',
//       message: `What the ${type}'s name? (Required)`,
//       validate: nameInput => {
//         if (nameInput) {
//           return true;
//         } else {
//           console.log(`Please enter the ${type}'s name!`);
//           return false;
//         }
//       }
//     },
//     {
//       type: 'input',
//       name: 'employeeID',
//       message: `What the ${type}'s ID #? (Required)`,
//       validate: idInput => {
//         if (idInput) {
//           return true;
//         } else {
//           console.log(`Please enter the ${type}'s ID #!`);
//           return false;
//         }
//       }
//     },
//     {
//       type: 'input',
//       name: 'employeeEmail',
//       message: `What the ${type}'s email? (Required)`,
//       validate: emailInput => {
//         if (emailInput) {
//           return true;
//         } else {
//           console.log(`Please enter the ${type}'s email!`);
//           return false;
//         }
//       }
//     }
//   ]);
// };

// //manager-only prompts
// const promptManager = employeeData =>{
//   employeeData.type = 'Manager'
//   if (!employees.managers) {
//     employees.managers = [];
//   }
//   return inquirer.prompt([ 
//     {
//       type: 'input',
//       name: 'officeNumber',
//       message: `What the manager's office #? (Required)`,
//       validate: officeInput => {
//         if (officeInput) {
//           return true;
//         } else {
//           console.log(`Please enter the manager's office #!`);
//           return false;
//         }
//       }
//     }
//   ])
//   .then(managerData => {
//     employeeData.officeNumber = managerData.officeNumber;
//     const manager = new Manager(
//       employeeData.employeeName,
//       employeeData.employeeID,
//       employeeData.employeeEmail,
//       employeeData.officeNumber
//     );
//     employees.managers.push(manager);
//     return employeeData;
//   })
//   .then(promptAnother);
// }

// //engineer-only prompts
// const promptEngineer = employeeData => {
//   if (!employees.engineers) {
//     employees.engineers = [];
//   }
//   return inquirer.prompt([ 
//     {
//       type: 'input',
//       name: 'github',
//       message: `What the eningeer's github? (Required)`,
//       validate: githubInput => {
//         if (githubInput) {
//           return true;
//         } else {
//           console.log(`Please enter the eningeer's github!`);
//           return false;
//         }
//       }
//     }
//   ])
//   .then(engineerData => {
//     employeeData.github = engineerData.github;
//     const engineer = new Engineer(
//       employeeData.employeeName,
//       employeeData.employeeID,
//       employeeData.employeeEmail,
//       employeeData.github
//     );
//     employees.engineers.push(engineer);
//     return employeeData;
//   })
//   .then(promptAnother);
// }

// //intern-only prompts
// const promptIntern = employeeData => {
//   if (!employees.interns) {
//     employees.interns = [];
//   }
//   return inquirer.prompt([ 
//     {
//       type: 'input',
//       name: 'school',
//       message: `What the intern's school name? (Required)`,
//       validate: schoolInput => {
//         if (schoolInput) {
//           return true;
//         } else {
//           console.log(`Please enter the intern's school name!`);
//           return false;
//         }
//       }
//     }
//   ])
//   .then(internData => {
//     employeeData.school = internData.school;
//     const intern = new Intern(
//       employeeData.employeeName,
//       employeeData.employeeID,
//       employeeData.employeeEmail,
//       employeeData.school
//     );
//     employees.interns.push(intern);
//     return employeeData;
//   })
//   .then(promptAnother);
// }

// //prompts to determine if another employee is needed, 
// //if yes, which kind?
// //if no, finishes app and creates object to send to create index.html file
// const promptAnother = () => {
//   return inquirer.prompt([ 
//     {
//       type: 'confirm',
//       name: 'confirmAnother',
//       message: 'Would you like to add another employee?',
//       default: false
//     },
//     {
//       type: 'checkbox',
//       name: 'type',
//       message: 'Is the new employee going to be an engineer or intern? (Check all that apply)',
//       choices: ['Engineer', 'Intern'],
//       when: ({ confirmAnother }) => confirmAnother
//     }
//   ])
//   .then(choice => {
//     if (choice.confirmAnother){
//       if (choice.type[0] === 'Engineer') {
//         promptUser('engineer')
//           .then(promptEngineer)
//       } else {
//         promptUser('intern')
//           .then(promptIntern)
//       }
//     } else {
//       console.log('employees', employees);
//       writeHtml(employees)
//     }
//   });
// }

// //initial function
// promptUser('manager').then(promptManager);