INSERT INTO department
  (name)
VALUES
  ('Sales');

INSERT INTO role
  (title, salary, department_id)
VALUES
  ('Sales Manager', 100000, 1),
  ('Outside Salesperson', 50000, 1);

INSERT INTO employee
  (first_name, last_name, role_id, manager_id)
VALUES
  ('John', 'Doe', 1, null),
  ('Max', 'Smith', 2, 1);