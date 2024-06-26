-- Create the contact_manager database
CREATE DATABASE IF NOT EXISTS contact_manager;

-- Select the contact_manager database
USE contact_manager;

-- Create the users table
CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

-- Create the contacts table with the SORTING_KEY column
CREATE TABLE Contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    organization VARCHAR(255),
    last_name VARCHAR(255),
    first_name VARCHAR(255),
    phone_number VARCHAR(20),
    email_address VARCHAR(255),
    user_id INT,
    SORTING_KEY VARCHAR(1024),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert test data into the users table
INSERT INTO users (username, password) VALUES ('user1', 'password1');
INSERT INTO users (username, password) VALUES ('user2', 'password2');
INSERT INTO users (username, password) VALUES ('user3', 'password3');
INSERT INTO users (username, password) VALUES ('user4', 'password4');
INSERT INTO users (username, password) VALUES ('user5', 'password5');

-- Insert test data into the contacts table
INSERT INTO Contacts (organization, last_name, first_name, phone_number, email_address, user_id, SORTING_KEY) 
VALUES 
('TechCorp', 'Doe', 'John', '1234567890', 'unique_john.doe@example.com', 2, CONCAT('2', 'John', 'Doe', 'TechCorp', 'unique_john.doe@example.com', '1234567890')),
(NULL, 'Smith', 'Jane', '0987654321', 'unique_null_jane@example.com', 2, CONCAT('2', 'Jane', 'Smith', '', '', '0987654321')),
('AlphaInc', 'Brown', 'Charlie', 'unique_1234567890', 'charlie.brown@example.com', 2, CONCAT('2', 'Charlie', 'Brown', 'AlphaInc', 'charlie.brown@example.com', 'unique_1234567890')),
(NULL, 'White', 'Alice', '9876543210', 'unique_null_alice@example.com', 2, CONCAT('2', 'Alice', 'White', '', '', '9876543210')),
('aaaaaaa', 'aaaaaaa', 'aaaaaaa', 'unique_1234567890', 'unique_null_aaaaaaa@example.com', 2, CONCAT('2', 'aaaaaaa', 'aaaaaaa', 'aaaaaaa', '', 'unique_1234567890'));

-- Show all tables in the current database
SHOW TABLES;

-- Show columns for the users table
SHOW COLUMNS FROM users;

-- Show columns for the contacts table
SHOW COLUMNS FROM Contacts;

-- Show rows in the users table
SELECT * FROM users;

-- Show rows in the contacts table
SELECT * FROM Contacts ORDER BY SORTING_KEY COLLATE utf8_general_ci ASC;

-- Empty the contacts table
DELETE FROM Contacts;

-- Empty the users table
DELETE FROM users;

-- Show rows in the users table after emptying
SELECT * FROM users;

-- Show rows in the contacts table after emptying
SELECT * FROM Contacts;