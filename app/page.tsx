"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

type Student = {
  id: number;
  name: string;
  email: string;
  course: string;
  year: number;
  attendance: number;
  marks: number;
};

const emptyForm = {
  name: "",
  email: "",
  course: "BCA",
  year: 1,
  attendance: 0,
  marks: 0,
};

export default function HomePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadStudents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/students", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load students.");
      setStudents(data);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load students.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStudents();
  }, [loadStudents]);

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return students;
    return students.filter((student) =>
      [student.name, student.email, student.course].some((value) =>
        value.toLowerCase().includes(query)
      )
    );
  }, [students, search]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        editingId === null ? "/api/students" : `/api/students/${editingId}`,
        {
          method: editingId === null ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            year: Number(form.year),
            attendance: Number(form.attendance),
            marks: Number(form.marks),
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to save student.");

      setMessage(editingId === null ? "Student added successfully." : "Student updated successfully.");
      resetForm();
      await loadStudents();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save student.");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(student: Student) {
    setEditingId(student.id);
    setForm({
      name: student.name,
      email: student.email,
      course: student.course,
      year: student.year,
      attendance: student.attendance,
      marks: student.marks,
    });
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteStudent(student: Student) {
    if (!window.confirm(`Delete ${student.name}'s record? This cannot be undone.`)) return;
    setMessage("");
    setError("");
    try {
      const response = await fetch(`/api/students/${student.id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to delete student.");
      setMessage("Student deleted successfully.");
      if (editingId === student.id) resetForm();
      await loadStudents();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete student.");
    }
  }

  const averageMarks = students.length
    ? (students.reduce((sum, student) => sum + student.marks, 0) / students.length).toFixed(1)
    : "0.0";
  const averageAttendance = students.length
    ? Math.round(students.reduce((sum, student) => sum + student.attendance, 0) / students.length)
    : 0;

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="EduManage home">
          <span className="brand-mark">E</span>
          <span>Edu<span className="brand-light">Manage</span></span>
        </a>
        <span className="topbar-label">STUDENT ADMINISTRATION</span>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow">EDUCATION MANAGEMENT PORTAL</p>
          <h1>Student Management System</h1>
          <p className="hero-copy">One simple place to organize student profiles, attendance, and academic performance.</p>
        </div>
        <div className="hero-icon" aria-hidden="true">🎓</div>
      </section>

      <section className="stats-grid" aria-label="Student statistics">
        <article className="stat-card">
          <span className="stat-icon blue">♙</span>
          <div><p>Total students</p><strong>{students.length}</strong></div>
        </article>
        <article className="stat-card">
          <span className="stat-icon green">✓</span>
          <div><p>Average attendance</p><strong>{averageAttendance}%</strong></div>
        </article>
        <article className="stat-card">
          <span className="stat-icon purple">★</span>
          <div><p>Average marks</p><strong>{averageMarks}</strong></div>
        </article>
      </section>

      <section className="content-grid">
        <aside className="panel form-panel">
          <div className="panel-heading">
            <div><p className="eyebrow">STUDENT DETAILS</p><h2>{editingId === null ? "Add a student" : "Edit student"}</h2></div>
            <span className="heading-symbol">＋</span>
          </div>
          <form onSubmit={handleSubmit} className="student-form">
            <label>Full name
              <input required minLength={2} maxLength={80} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Ananya Sharma" />
            </label>
            <label>Email address
              <input required type="email" maxLength={120} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="student@example.com" />
            </label>
            <div className="form-row">
              <label>Course
                <select value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })}>
                  <option value="BCA">BCA</option><option value="BSc">B.Sc.</option><option value="BCom">B.Com.</option><option value="BA">B.A.</option><option value="BTech">B.Tech.</option><option value="MCA">MCA</option><option value="Other">Other</option>
                </select>
              </label>
              <label>Year
                <select value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}>
                  <option value={1}>Year 1</option><option value={2}>Year 2</option><option value={3}>Year 3</option><option value={4}>Year 4</option>
                </select>
              </label>
            </div>
            <div className="form-row">
              <label>Attendance (%)
                <input required type="number" min={0} max={100} value={form.attendance} onChange={(e) => setForm({ ...form, attendance: Number(e.target.value) })} />
              </label>
              <label>Marks (%)
                <input required type="number" min={0} max={100} step="0.1" value={form.marks} onChange={(e) => setForm({ ...form, marks: Number(e.target.value) })} />
              </label>
            </div>
            <button className="primary-button" type="submit" disabled={saving}>{saving ? "Saving..." : editingId === null ? "＋ Add student" : "Save changes"}</button>
            {editingId !== null && <button className="secondary-button" type="button" onClick={resetForm}>Cancel editing</button>}
          </form>
        </aside>

        <section className="panel records-panel">
          <div className="records-heading">
            <div><p className="eyebrow">DIRECTORY</p><h2>Student records</h2></div>
            <span className="record-count">{students.length} records</span>
          </div>

          {message && <p className="notice success" role="status">{message}</p>}
          {error && <p className="notice error" role="alert">{error}</p>}

          <div className="search-box">
            <span aria-hidden="true">⌕</span>
            <input aria-label="Search students" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, or course..." />
          </div>

          {loading ? <div className="empty-state">Loading student records...</div> :
            filteredStudents.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">📋</span>
                <strong>{search ? "No matching students" : "No students yet"}</strong>
                <p>{search ? "Try a different search term." : "Add your first student using the form."}</p>
              </div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead><tr><th>STUDENT</th><th>COURSE</th><th>ATTENDANCE</th><th>MARKS</th><th>ACTIONS</th></tr></thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr key={student.id}>
                        <td><div className="student-cell"><span className="avatar">{student.name.trim().charAt(0).toUpperCase()}</span><div><strong>{student.name}</strong><small>{student.email}</small></div></div></td>
                        <td><span className="course-pill">{student.course} · Y{student.year}</span></td>
                        <td><span className={student.attendance < 75 ? "metric low" : "metric"}>{student.attendance}%</span></td>
                        <td><strong>{student.marks}%</strong></td>
                        <td><div className="actions"><button className="edit-button" onClick={() => startEdit(student)} aria-label={`Edit ${student.name}`}>Edit</button><button className="delete-button" onClick={() => void deleteStudent(student)} aria-label={`Delete ${student.name}`}>Delete</button></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          <p className="table-footnote">Attendance below 75% is highlighted for review.</p>
        </section>
      </section>
      <footer>EduManage Student Management System <span>•</span> CodSoft Internship Project</footer>
    </main>
  );
}
