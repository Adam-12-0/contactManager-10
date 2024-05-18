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

-- Create the contacts table
CREATE TABLE Contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    organization VARCHAR(255),
    last_name VARCHAR(255),
    first_name VARCHAR(255),
    phone_number VARCHAR(20),
    email_address VARCHAR(255),
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create the index for sorting the contacts table
CREATE INDEX idx_contacts_sort ON Contacts (
    organization(100) ASC,
    last_name(100) ASC,
    first_name(100) ASC,
    email_address(100) ASC,
    phone_number ASC
);

-- Insert test data into the users table
INSERT INTO users (username, password) VALUES ('user1', 'password1');
INSERT INTO users (username, password) VALUES ('user2', 'password2');
INSERT INTO users (username, password) VALUES ('user3', 'password3');
INSERT INTO users (username, password) VALUES ('user4', 'password4');
INSERT INTO users (username, password) VALUES ('user5', 'password5');

-- Insert test data into the contacts table
INSERT INTO Contacts (organization, last_name, first_name, phone_number, email_address, user_id) VALUES ('TechCorp', 'Doe', 'John', '1234567890', 'john.doe@example.com', 1);
INSERT INTO Contacts (organization, last_name, first_name, phone_number, email_address, user_id) VALUES (NULL, 'Smith', 'Jane', '0987654321', NULL, 2);
INSERT INTO Contacts (organization, last_name, first_name, phone_number, email_address, user_id) VALUES ('AlphaInc', 'Brown', 'Charlie', '1234567890', 'charlie.brown@example.com', 3);
INSERT INTO Contacts (organization, last_name, first_name, phone_number, email_address, user_id) VALUES (NULL, 'White', 'Alice', '9876543210', NULL, 4);
INSERT INTO Contacts (organization, last_name, first_name, phone_number, email_address, user_id) VALUES ('BetaCorp', NULL, 'Bob', '1112223333', 'bob@betacorp.com', 5);

-- Show all tables in the current database
SHOW TABLES;

-- Show columns for the users table
SHOW COLUMNS FROM users;

-- Show columns for the contacts table
SHOW COLUMNS FROM Contacts;

-- Show rows in the users table
SELECT * FROM users;

-- Show rows in the contacts table
SELECT * FROM Contacts ORDER BY organization ASC, last_name ASC, first_name ASC, email_address ASC, phone_number ASC;

-- Empty the contacts table
DELETE FROM Contacts;

-- Empty the users table
DELETE FROM users;

-- Show rows in the users table after emptying
SELECT * FROM users;

-- Show rows in the contacts table after emptying
SELECT * FROM Contacts;