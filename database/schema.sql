CREATE TABLE IF NOT EXISTS employees (
  employee_id VARCHAR(8) PRIMARY KEY
    CHECK (employee_id ~ '^FA[0-9]{6}$'),
  employee_name VARCHAR(80) NOT NULL
    CHECK (length(trim(employee_name)) BETWEEN 2 AND 80),
  password_hash TEXT NOT NULL,
  role VARCHAR(10) NOT NULL DEFAULT 'employee'
    CHECK (role IN ('employee', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS employees_role_idx ON employees (role);
