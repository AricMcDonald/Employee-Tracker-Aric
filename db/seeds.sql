USE employeeTracker_db;

INSERT INTO department
    (name)
VALUES
    ('Engineering'),
    ('Management'),
    ('Sales'),
    ('Marketing');

INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Engineering Boss', 120000, 1),
    ('Engineering Minion', 100000, 1),
    ('CEO Boss', 120000, 2),
    ('CEO Assistant', 90000, 2),
    ('Sales Boss', 120000, 3),
    ('Sales person', 80000, 3),
    ('Marketing Boss', 120000, 4),
    ('Marketing Person', 80000, 4);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Sam', 'Smith', 1, NULL),
    ('Paul', 'Jim', 2, 1),
    ('Grace', 'Chase', 3, NULL),
    ('Cade', 'Jade', 4, 3),
    ('Jason', 'Borne', 5, NULL),
    ('Will', 'Till', 6, 5),
    ('Carter', 'Dart', 7, NULL),
    ('Damon', 'Court', 8, 7);

