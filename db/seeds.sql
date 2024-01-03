-- Seeding the department table -- 
INSERT INTO department (name)
VALUES ("HR"),
       ("Product Management"),
       ("Software Engineering"),
       ("Sales");

-- Seeding the role table -- 
INSERT INTO role (department_id, title, salary)
VALUES (1, "Compensation Analyst", 120000),
       (1, "Benefits Administrator", 55000),
       (1, "Recruiter", 92000), 
       (2, "PM I", 110000),
       (2, "PM II", 150000),
       (2, "Senior PM", 210000),
       (3, "SWE I", 160000),
       (3, "SWE II", 191000),
       (3, "Senior SWE", 425000),
       (4, "Manager", 112000),
       (4, "Senior Seller", 89000),
       (4, "Junior Seller", 70000);


-- Seeding the employee table -- 
INSERT INTO employee (role_id, first_name, last_name)
VALUES (1, "Sydney", "Parks"),
       (2, "John", "Tortellini"),
       (3, "Sarah", "Frye"),
       (4, "Kimi", "Kardashian"),
       (5, "Matt", "Riphe"),
       (6, "Gladis", "McGee"),
       (7, "Mark", "Zuckerberg"),
       (8, "Bill", "Gates"),
       (9, "Steve", "Jobs"),
       (10, "Robert", "Crabb"),
       (11, "Karyn", "Planck"),
       (12, "Patrick", "Star");

