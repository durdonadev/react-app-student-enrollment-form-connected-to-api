import { studentAPI } from "./api/student.js";
import React, { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import "./App.css";

const AppFunction = () => {
    const [students, setStudents] = useState([]);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [className, setClassName] = useState("");

    const [firstNameEditValue, setFirstNameEditValue] = useState("");
    const [lastNameEditValue, setLastNameEditValue] = useState("");
    const [emailEditValue, setEmailEditValue] = useState("");
    const [classNameEditValue, setClassNameEditValue] = useState("");

    const [inputError, setInputError] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingStudentId, setEditingStudentId] = useState("");

    useEffect(() => {
        studentAPI
            .getAll()
            .then((response) => {
                setStudents(response.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const handleOnChangeFirstName = (e) => {
        const { value } = e.target;
        setFirstName(value);

        if (value.length <= 1) {
            setInputError(true);
        } else {
            setInputError(false);
        }
    };

    const handleOnChangeLastName = (e) => {
        const { value } = e.target;
        setLastName(value);

        if (value.length <= 1) {
            setInputError(true);
        } else {
            setInputError(false);
        }
    };

    const handleOnChangeEmail = (e) => {
        const { value } = e.target;
        setEmail(value);

        if (value.length <= 1) {
            setInputError(true);
        } else {
            setInputError(false);
        }
    };

    const handleOnChangeClassName = (e) => {
        const { value } = e.target;
        setClassName(value);

        if (value.length <= 1) {
            setInputError(true);
        } else {
            setInputError(false);
        }
    };

    const addStudent = (e) => {
        e.preventDefault();

        if (
            firstName.length <= 1 ||
            lastName.length <= 1 ||
            email.length <= 1 ||
            className.length <= 1
        ) {
            setInputError(true);
            return;
        }

        studentAPI
            .add({ firstName, lastName, email, className })
            .then((response) => {
                setFirstName("");
                setLastName("");
                setEmail("");
                setClassName("");
                setStudents((prevStudents) => {
                    return [...prevStudents, response.data];
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const deleteStudent = (id) => {
        studentAPI
            .deleteOne(id)
            .then(() => {
                setStudents((prevStudents) => {
                    return prevStudents.filter((student) => student.id !== id);
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleFirstNameEdit = (e) => {
        setFirstNameEditValue(e.target.value);
    };

    const handleLastNameEdit = (e) => {
        setLastNameEditValue(e.target.value);
    };

    const handleEmailEdit = (e) => {
        setEmailEditValue(e.target.value);
    };

    const handleClassNameEdit = (e) => {
        setClassNameEditValue(e.target.value);
    };

    const editStudent = (studentId) => {
        setShowEditModal(true);

        let firstName = "";
        let lastName = "";
        let email = "";
        let className = "";

        for (const student of students) {
            if (student.id === studentId) {
                firstName = student.firstName;
                lastName = student.lastName;
                email = student.email;
                className = student.className;
                break;
            }
        }

        setFirstNameEditValue(firstName);
        setLastNameEditValue(lastName);
        setEmailEditValue(email);
        setClassNameEditValue(className);
        setEditingStudentId(studentId);
    };

    const submitEdit = () => {
        studentAPI
            .update(editingStudentId, { firstName, lastName, email, className })
            .then((_) => {
                setStudents((prevStudents) => {
                    // const updatedStudents = prevStudents.map((student) => {
                    //     if (student.id === editingStudentId) {
                    //         const copy = { ...student };
                    //         copy.firstName = firstName;
                    //         copy.lastName = lastName;
                    //         copy.email = email;
                    //         copy.className = className;
                    //         return copy;
                    //     }
                    //     return student;
                    // });
                    // return updatedStudents;
                    const copyStudents = [];
                    for (let i = 0; i < prevStudents.length; i++) {
                        const student = prevStudents[i];
                        if (student.id === editingStudentId) {
                            const copy = { ...student };
                            copy.firstName = firstNameEditValue;
                            copy.lastName = lastNameEditValue;
                            copy.email = emailEditValue;
                            copy.className = classNameEditValue;
                            copyStudents.push(copy);
                        } else {
                            copyStudents.push(student);
                        }
                    }
                    return copyStudents;
                });
            })
            .catch((err) => {
                console.log(err);
            });

        setShowEditModal(false);
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        setEditingStudentId(null);
    };

    return (
        <main>
            <h1>Students Enrollment Form</h1>
            <form onSubmit={addStudent}>
                <div className="form-control">
                    <label htmlFor="firstName">Student First Name: </label>
                    <input
                        type="text"
                        placeholder="First Name"
                        id="firstName"
                        onChange={handleOnChangeFirstName}
                        value={firstName}
                    />

                    <label htmlFor="lastName">Student Last Name: </label>
                    <input
                        type="text"
                        placeholder="Last Name"
                        id="lastName"
                        onChange={handleOnChangeLastName}
                        value={lastName}
                    />

                    <label htmlFor="email">Student Email: </label>
                    <input
                        type="email"
                        placeholder="Email"
                        id="email"
                        onChange={handleOnChangeEmail}
                        value={email}
                    />

                    <label htmlFor="className">Class: </label>
                    <select
                        id="className"
                        value={className}
                        onChange={handleOnChangeClassName}
                    >
                        <option value="">Select Class</option>
                        <option value="ALGEBRA">ALGEBRA</option>
                        <option value="GEOMETRY">GEOMETRY</option>
                        <option value="JOURNALISM">JOURNALISM</option>
                        <option value="LITERATURE">LITERATURE</option>
                    </select>

                    <input type="submit" value="Submit"></input>

                    {inputError && (
                        <span className="error-message">Invalid Input!</span>
                    )}
                </div>
            </form>

            <table id="studentsTable">
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Class</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody className="students">
                    {students &&
                        students.length >= 1 &&
                        students.map((student) => {
                            return (
                                <tr key={student.id} className="student">
                                    <td>{student.firstName}</td>
                                    <td>{student.lastName}</td>
                                    <td>{student.email}</td>
                                    <td>{student.className}</td>
                                    <td>
                                        <button
                                            className="delete-btn"
                                            onClick={() =>
                                                deleteStudent(student.id)
                                            }
                                        >
                                            Delete
                                        </button>
                                        <button
                                            className="edit-btn"
                                            onClick={() =>
                                                editStudent(student.id)
                                            }
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
            </table>

            {showEditModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-icon" onClick={closeEditModal}>
                            &times;
                        </span>
                        <h2>Edit Student Data</h2>
                        <label htmlFor="editingFirstName">
                            Student First Name:
                        </label>
                        <input
                            id="editingFirstName"
                            type="text"
                            value={firstNameEditValue}
                            onChange={handleFirstNameEdit}
                        />
                        <br />
                        <label htmlFor="editingLastName">
                            Student Last Name:
                        </label>
                        <input
                            id="editingLastName"
                            type="text"
                            value={lastNameEditValue}
                            onChange={handleLastNameEdit}
                        />
                        <br />
                        <label htmlFor="editingemail">Student Email: </label>
                        <input
                            id="editingEmail"
                            type="email"
                            value={emailEditValue}
                            onChange={handleEmailEdit}
                        />
                        <br />
                        <label htmlFor="editingClassName">Class: </label>
                        <select
                            id="editingClassName"
                            value={classNameEditValue}
                            onChange={handleClassNameEdit}
                        >
                            <option value="">Select Class</option>
                            <option value="ALGEBRA">ALGEBRA</option>
                            <option value="GEOMETRY">GEOMETRY</option>
                            <option value="JOURNALISM">JOURNALISM</option>
                            <option value="LITERATURE">LITERATURE</option>
                        </select>
                        <br />
                        <button className="save-btn" onClick={submitEdit}>
                            Save
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
};

export default AppFunction;
