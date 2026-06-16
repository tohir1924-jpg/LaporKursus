-- Migration: 0001_initial.sql
-- Description: Initial database schema for LaporKursus

-- 1. Users Table (Admin & Teachers)
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'teacher')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Programs Table (Course Programs)
CREATE TABLE programs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  default_fee INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Classes Table (Program Classes)
CREATE TABLE classes (
  id TEXT PRIMARY KEY,
  program_id TEXT NOT NULL,
  teacher_id TEXT,
  name TEXT NOT NULL,
  day_name TEXT,
  start_time TEXT,
  end_time TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (program_id) REFERENCES programs(id),
  FOREIGN KEY (teacher_id) REFERENCES users(id)
);

-- 4. Students Table
CREATE TABLE students (
  id TEXT PRIMARY KEY,
  class_id TEXT,
  program_id TEXT,
  name TEXT NOT NULL,
  phone TEXT,
  guardian_name TEXT,
  guardian_phone TEXT,
  join_date TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'leave', 'inactive')),
  note TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (class_id) REFERENCES classes(id),
  FOREIGN KEY (program_id) REFERENCES programs(id)
);

-- 5. Attendance Table
CREATE TABLE attendance (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  class_id TEXT NOT NULL,
  attendance_date TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('H', 'A', 'I', 'T')),
  late_minutes INTEGER DEFAULT 0,
  note TEXT,
  created_by TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (class_id) REFERENCES classes(id),
  FOREIGN KEY (created_by) REFERENCES users(id),
  UNIQUE(student_id, class_id, attendance_date)
);

-- 6. Monthly Fees Table
CREATE TABLE monthly_fees (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'partial', 'paid', 'waived')),
  due_date TEXT,
  note TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id),
  UNIQUE(student_id, month, year)
);

-- 7. Payments Table
CREATE TABLE payments (
  id TEXT PRIMARY KEY,
  monthly_fee_id TEXT NOT NULL,
  payment_date TEXT NOT NULL,
  amount INTEGER NOT NULL,
  method TEXT NOT NULL DEFAULT 'cash' CHECK (method IN ('cash', 'transfer', 'qris', 'other')),
  note TEXT,
  created_by TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (monthly_fee_id) REFERENCES monthly_fees(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 8. Student Projects Table
CREATE TABLE student_projects (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  class_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  start_date TEXT,
  target_date TEXT,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'revision', 'done')),
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  project_link TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (class_id) REFERENCES classes(id)
);

-- 9. Project Reports Table
CREATE TABLE project_reports (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  report_date TEXT NOT NULL,
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status TEXT NOT NULL CHECK (status IN ('not_started', 'in_progress', 'revision', 'done')),
  teacher_note TEXT,
  next_target TEXT,
  feedback TEXT,
  created_by TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES student_projects(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 10. Message Templates Table
CREATE TABLE message_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('schedule', 'absence', 'late', 'fee', 'project', 'general')),
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 11. Message Logs Table
CREATE TABLE message_logs (
  id TEXT PRIMARY KEY,
  student_id TEXT,
  template_id TEXT,
  recipient_phone TEXT,
  message_type TEXT,
  message_content TEXT,
  channel TEXT NOT NULL DEFAULT 'whatsapp_link',
  status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'opened', 'sent_manual')),
  created_by TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (template_id) REFERENCES message_templates(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 12. Indexes
CREATE INDEX idx_students_class_id ON students(class_id);
CREATE INDEX idx_students_program_id ON students(program_id);
CREATE INDEX idx_attendance_date ON attendance(attendance_date);
CREATE INDEX idx_attendance_student_id ON attendance(student_id);
CREATE INDEX idx_attendance_class_date ON attendance(class_id, attendance_date);
CREATE INDEX idx_monthly_fees_student_id ON monthly_fees(student_id);
CREATE INDEX idx_monthly_fees_month_year ON monthly_fees(month, year);
CREATE INDEX idx_payments_fee_id ON payments(monthly_fee_id);
CREATE INDEX idx_projects_student_id ON student_projects(student_id);
CREATE INDEX idx_project_reports_project_id ON project_reports(project_id);
