-- Update example --
-- Promote Mark Zuckerberg from SWE I to SWE II --

UPDATE employee
SET role_id = 8
WHERE id = 7;

SELECT * FROM employee;