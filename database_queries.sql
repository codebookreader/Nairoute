CREATE DATABASE nairoutedatabase;

USE nairoutedatabase;

CREATE TABLE commuter (
    email VARCHAR(255) UNIQUE NOT NULL PRIMARY KEY,
    firstName VARCHAR(255) NOT NULL,
    secondname VARCHAR(255) NOT NULL,
    phoneNumber VARCHAR(15) NOT NULL UNIQUE,
    password VARCHAR(255)
);

CREATE TABLE driver (
    email VARCHAR(255) UNIQUE NOT NULL PRIMARY KEY,
    firstName VARCHAR(255) NOT NULL,
    secondname VARCHAR(255) NOT NULL,
    phoneNumber VARCHAR(15) NOT NULL UNIQUE,
    licenseNumber VARCHAR(20) NOT NULL,
    password VARCHAR(255)
);

CREATE TABLE routes (
    routeNumber INT NOT NULL UNIQUE PRIMARY KEY,
    startLocation VARCHAR(255) NOT NULL,
    endLocation VARCHAR(255) NOT NULL,
    distance INT NOT NULL
);

CREATE TABLE vehicles (
    vehicleNumber VARCHAR(255) NOT NULL UNIQUE PRIMARY KEY,
    vehicleType VARCHAR(255) NOT NULL,
    assignedDriver VARCHAR(255),
    BookingStatus VARCHAR(255),
    CONSTRAINT fk1_ve_dr FOREIGN KEY (assignedDriver) REFERENCES driver(email)
);

CREATE TABLE bookings (
    bookingid INT AUTO_INCREMENT PRIMARY KEY,
    commuter VARCHAR(255),
    vehicle VARCHAR(255),
    bookingDate DATE NOT NULL,
    BookingStatus VARCHAR(255),
    routenumber INT,
    CONSTRAINT fk1_book_com FOREIGN KEY (commuter) REFERENCES commuter(email),
    CONSTRAINT fk2_book_ve FOREIGN KEY (vehicle) REFERENCES vehicles(vehicleNumber),
    CONSTRAINT fk3_book_ro FOREIGN KEY (routenumber) REFERENCES routes(routeNumber)
);

CREATE TABLE payments (
    paymentid INT AUTO_INCREMENT PRIMARY KEY,
    bookingid INT,
    amountToPay DECIMAL(10, 2),
    paymentDate DATE NOT NULL,
    paymentStatus VARCHAR(255),
    routeid INT,
    CONSTRAINT fk1_pay_book FOREIGN KEY (bookingid) REFERENCES bookings(bookingid)
);

CREATE TABLE otps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
