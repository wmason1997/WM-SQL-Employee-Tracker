-- Use or create the 'company_db' database
CREATE DATABASE IF NOT EXISTS company_db;
USE company_db;

-- Create tables according to the instructions of project
CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL (7,0), -- TRYING BASED ON https://www.sqlshack.com/understanding-sql-decimal-data-type/
    department_id INT NOT NULL,
    FOREIGN KEY (department_id)
    REFERENCES department(id)
    ON DELETE SET NULL
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT, -- could be NULL theoretically
    FOREIGN KEY (role_id)
    REFERENCES role(id)
    ON DELETE SET NULL,
    FOREIGN KEY (manager_id) 
    REFERENCES employee(id)
    ON DELETE SET NULL
);

GRANT ALL PRIVILEGES ON company_db.* TO 'root'@'localhost';
FLUSH PRIVILEGES;