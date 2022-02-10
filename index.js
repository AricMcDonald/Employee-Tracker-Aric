const db = require('./db/connection');
require('console.table');
const inquirer = require('inquirer');


function init() {
    function mainQuestions() {
        inquirer.prompt([
            {
                type: 'list',
                name: 'choice',
                message: 'What would you like to do in the employee tracker database?',
                choices: [
                    'View All Employees',
                    'View All Departments',
                    'View All Roles',
                    'Add Employee',
                    'Add a Department',
                    'Add a role',
                    'Update Employee Role',
                ]
            }
        ]).then(res => {
            switch(res.choice) {
                case 'View All Employees':
                    ViewAllEmployees();
                    break;
                case 'View All Departments':
                    ViewAllDepartments();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'View All Roles':
                    viewRoles();
                    break;
                case 'Add a Department':
                    addDepartment();
                    break;
                case 'Add a role':
                    addRole();
                    break;
                case 'Update Employee Role':
                    updateRole();
                    break;
                
            }
        })
    }


    function ViewAllEmployees() {
        db.query('SELECT * FROM employee', function(err, res) {
            if(err) throw err;
            console.table(res)
            mainQuestions();
        })
    }

    function ViewAllDepartments() {
        db.query('SELECT * FROM department', function(err, res) {
            if(err) throw err;
            console.table(res)
            mainQuestions();
        })
    }

    function viewRoles() {
        db.query('SELECT * FROM role', function(err, res) {
            if(err) throw err;
            console.table(res)
            mainQuestions();
        })
    }

    function updateRole() {
        db.query('SELECT * FROM employee', function(err, res) {
            let employees = res.map(({first_name, last_name, id}) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }))

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee',
                    message: 'Which employee would you like to update?',
                    choices: employees
                }
            ])
            .then(res => {
                let employeeId = res.employee;
                db.query('SELECT * FROM role', function(err, res) {
                    let roles = res.map(({id, title}) => ({
                        name: title,
                        value: id
                    }));
                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'role',
                            message: 'What is the role of the employee?',
                            choices: roles
                        }
                    ]).then(res => {
                        let role = res.role;

                        db.query(`UPDATE employee SET role_id = ${role} WHERE id = ${employeeId}`)
                    })
                    .then(() => console.log(`Employee with ID ${employeeId} updated`))
                    .then(() => ViewAllEmployees())
                })
            })
        })
    }

    function addDepartment() {
        inquirer.prompt([
            {
                type: 'input',
                message: 'What is the name of the new department',
                name: 'deptName'
            }
        ])
        .then(res => {
            let department = {
               name: res.deptName
            }
            db.query('INSERT INTO department SET ?', department)
        })
        .then(() => {
            ViewAllDepartments();
        })
    }

    function addRole() {
        db.query('SELECT * FROM department', function(err, res){
            let departments = res.map(({id, name}) => ({
                name: name,
                value: id
            }))

            inquirer.prompt([
                {
                    type: 'input',
                    name: 'roleTitle',
                    message: 'What is the title of the role?'
                },
                {
                    type: 'input',
                    name: 'roleSalary',
                    message: 'What is the salary of the role?'
                },
                {
                    type: 'list',
                    name: 'dept',
                    message: 'What department does the role belong to?',
                    choices: departments
                }
            ])
            .then(res => {
                let newRole = {
                    department_id: res.dept,
                    title: res.roleTitle,
                    salary: res.roleSalary
                }
                db.query('INSERT INTO role SET ?', newRole, function(err, res){
                    console.log(`Added ${newRole.title} to Databse`)
                })
            })
            .then(() => viewRoles())
        })
        
    }

    function addEmployee() {
        inquirer.prompt([
            {
                type: 'input',
                name: 'firstName',
                message: 'What is the first name of the employee?'
            },
            {
                type: 'input',
                name: 'lastName',
                message: 'What is the last name of the employee?'
            }
        ])
        .then(res => {
            let firstName = res.firstName;
            let lastName = res.lastName;

            db.query('SELECT * FROM role', function(err, res) {
                let roles = res.map(({id, title}) => ({
                    name: title,
                    value: id
                }));
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'role',
                        message: 'What is the role of the employee?',
                        choices: roles
                    }
                ])
                .then(res => {
                    let roleId = res.role
                    db.query('SELECT * FROM employee WHERE manager_id IS NULL', function(err, res) {
                        let managers = res.map(({id, first_name, last_name}) => ({
                            name: `${first_name} ${last_name}`,
                            value: id
                        }))
                        inquirer.prompt([
                            {
                                type: 'list',
                                name: 'boss',
                                message: 'Who is the manager of the employee?',
                                choices: managers
                            }
                        ])
                        .then(res => {
                            let employee = {
                                manager_id: res.boss,
                                role_id: roleId,
                                first_name: firstName,
                                last_name: lastName
                            }

                            db.query('INSERT INTO employee SET ?', employee, function(err, res) {
                                console.log(`Added ${firstName} ${lastName} to the database`)
                            })
                        })
                        .then(() =>ViewAllEmployees())
                    })
                })

            })
        })
    }

    mainQuestions();
}

init();