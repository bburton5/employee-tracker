INSERT INTO department (department_name)
VALUES ("Clinical"),
("NonClinical"),
("Charity"),
("Students");

INSERT INTO roles (title, salary, department_id)
VALUES ("Registered Nurse", 100000, 1),
("Physician", 300000, 1),
("Nurse Practitioner", 150000, 1),
("Physician Assistant", 200000, 1),
("Medical Assistant", 40000, 1),
("Nursing Assistant", 50000, 1),
("Nursing Student", 0, 4),
("Medical Student", 0, 4),
("Volunteer", 0, 3),
("Social Worker", 100000, 2),
("Receptionist", 35000, 2);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Halbert", "Shorts", 2),
("Colin", "Nguyen", 2),
("Fletcher", "Stanley", 4),
("Chandler", "Goodman", 8),
("Eva", "Hunter", 8),
("Osmond", "Kirk", 3),
("Percy", "Welch", 1),
("Oriel", "Santiago", 1),
("Erin", "Lane", 6),
("Keith", "Gordon", 7),
("George", "Lamb", 7),
("Matthew", "Johnston", 5),
("Julia", "Hawkins", 5),
("Sibley", "Vasquez", 9),
("Elizabeth", "Erickson", 9),
("John", "Hill", 9),
("Rowena", "Byrd", 10),
("Roberta", "Benson", 11),
("Haven", "Lucas", 2),
("John", "Doe", 4);