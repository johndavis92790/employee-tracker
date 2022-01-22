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

    } else if (choice.type[0] === 'View all roles'){

    } else if (choice.type[0] === 'View all employees'){

    } else if (choice.type[0] === 'Add a department'){

    } else if (choice.type[0] === 'Add a role'){

    } else if (choice.type[0] === 'Add an employee'){

    } else if (choice.type[0] === 'Update an employee role'){

    }
  });
};

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