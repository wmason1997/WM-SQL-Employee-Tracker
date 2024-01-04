SELECT *
FROM employee
JOIN role ON employee.role_id = role.id;

-- SELECT id, CONCAT(first_name, ' ', last_name) AS name
-- FROM employee;