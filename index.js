const inquirer = require('inquirer');
const consoleTable = require('console.table');
const mysql = require('mysql2');
const db = require('./db/connection');

const initialPrompt = () => {
  return inquirer.prompt([ 
    {
      type: 'checkbox',
      name: 'type',
      choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role'],
      validate: choiceInput => {
        if (choiceInput) {
          return true;
        } else {
          console.log(`Please make a choice!`);
          return false;
        }
      }
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
      addEmp()
    } else if (choice.type[0] === 'Update an employee role'){
      updateEmp();
    }
  });
};

const viewAllDept = () => {
  db.promise().query('SELECT * FROM department;')
  .then( ([rows]) => {
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
      e.first_name AS 'First Name', 
      e.last_name AS 'Last Name', 
      role.title AS 'Title',
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

async function addRole() {
  var deptArray  = await getDepts;
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
      type: 'checkbox',
      name: 'roleDept',
      message: `What the role's department? (Required)`,
      validate: roleDeptInput => {
        if (roleDeptInput) {
          return true;
        } else {
          console.log(`Please choose the role's department!`);
          return false;
        }
      },
      choices: deptArray
    }
  ])
  .then(role => {
    var dept = role.roleDept;
    var newDept = dept.toString(dept);
    var deptArray = newDept.split(' ');
    db.promise().query(`
    INSERT INTO role
      (title, salary, department_id)
    VALUES
      ('${role.roleTitle}', ${role.roleSalary}, ${deptArray[0]});`
    )
    .catch(console.log)
    .then( () => {
      console.log('Role added successful!');
      initialPrompt();
    });
  });
};

async function addEmp() {
  var rolesArray = await getRoles;
  var managersArray = await getManagerNames;
  return inquirer.prompt([ 
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
      type: 'checkbox',
      name: 'empRole',
      message: `What the employee's role? (Required)`,
      validate: empRoleInput => {
        if (empRoleInput) {
          return true;
        } else {
          console.log(`Please enter the employee's role!`);
          return false;
        }
      },
      choices: rolesArray
    },
    {
      type: 'confirm',
      name: 'confirmManager',
      message: 'Is this employee a manger?',
      default: false
    },
    {
      type: 'checkbox',
      name: 'empManager',
      message: `Who is the employee's manager? (Required)`,
      validate: empManagerInput => {
        if (empManagerInput) {
          return true;
        } else {
          console.log(`Please choose the employee's manager!`);
          return false;
        }
      },
      when: ({confirmManager}) => !confirmManager,
      choices: managersArray
    }
  ])
  .then(emp => {
    var role = emp.empRole;
    var newRole = role.toString(role);
    var roleArray = newRole.split(' ');
    var manager = emp.empManager;
    var newManager = manager.toString(manager);
    var managerArray = newManager.split(' ');
    if (emp.confirmManager){
      db.promise().query(`
      INSERT INTO employee
        (first_name, last_name, role_id)
      VALUES
        ('${emp.empFirstName}', '${emp.empLastName}', ${roleArray[0]});`
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
        ('${emp.empFirstName}', '${emp.empLastName}', ${roleArray[0]}, ${managerArray[0]});`
      )
      .catch(console.log)
      .then( () => {
        console.log('Employee added successful!');
        initialPrompt();
      });
    }
  });
};

async function updateEmp() {
  var empArray = await getEmpNames;
  var rolesArray = await getRoles;
  return inquirer.prompt([
    {
        type: 'checkbox',
        name: 'type',
        choices: empArray
    },
    {
      type: 'checkbox',
      name: 'empNewRole',
      message: `What is the employee's new role? (Required)`,
      validate: empNewRoleInput => {
        if (empNewRoleInput) {
          return true;
        } else {
          console.log(`Please choose the employee's new role!`);
          return false;
        }
      },
      choices: rolesArray
    }
  ])
  .then(emp => {
    var name = emp.type;
    var newName = name.toString(name);
    var nameArray = newName.split(' ');
    var role = emp.empNewRole;
    var newRole = role.toString(role);
    var roleArray = newRole.split(' ');
    db.promise().query(`
    UPDATE employee
    SET role_id = ${roleArray[0]} WHERE id = ${nameArray[0]};`
    )
    .catch(console.log)
    .then( () => {
      console.log(`Changed employee's role successfully!`);
      initialPrompt();
    });
  });
};

const getDepts = new Promise(function(resolve){
  db.promise().query(`SELECT * FROM department;`)
  .then( ([rows]) => {
    var deptArray = [];
    rows.forEach((dept) => {
      deptArray.push(dept.id + ' ' + dept.name);
    });
    return deptArray;
  })
  .catch(console.log)
  .then( (deptArray) => {
    resolve(deptArray);
  });
});

const getRoles = new Promise(function(resolve){
  db.promise().query(`SELECT * FROM role;`)
  .then( ([rows]) => {
    var rolesArray = [];
    rows.forEach((roles) => {
      rolesArray.push(roles.id + ' ' + roles.title);
    });
    return rolesArray;
  })
  .catch(console.log)
  .then( (rolesArray) => {
    resolve(rolesArray);
  });
});

const getEmpNames = new Promise(function(resolve){
  db.promise().query(`SELECT * FROM employee;`)
  .then( ([rows]) => {
    var namesArray = [];
    rows.forEach((name) => {
      namesArray.push(name.id + ' ' + name.first_name + ' ' + name.last_name);
    });
    return namesArray;
  })
  .catch(console.log)
  .then( (list) => {
    resolve(list);
  });
});

const getManagerNames = new Promise(function(resolve){
  db.promise().query(`
  SELECT *
  FROM employee e 
  WHERE e.manager_id IS NULL;
  `)
  .then( ([rows]) => {
    var managersArray = [];
    rows.forEach((name) => {
      managersArray.push(name.id + ' ' + name.first_name + ' ' + name.last_name);
    });
    return managersArray;
  })
  .catch(console.log)
  .then( (managersArray) => {
    resolve(managersArray);
  });
});

initialPrompt();