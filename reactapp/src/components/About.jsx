import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const About = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobilenumber: "",
    age: "",
    city: "",
    gender: "",
    language: [], // store language as array internally
    degree: "",
    vehicle: [],
  });

  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (name === "vehicle") {
        // Handle vehicle checkboxes
        let newVehicle = [...formData.vehicle];
        if (checked) {
          newVehicle.push(value);
        } else {
          newVehicle = newVehicle.filter((v) => v !== value);
        }
        setFormData((prev) => ({ ...prev, vehicle: newVehicle }));
      } else if (name === "language") {
        // Handle language checkboxes
        let newLang = [...formData.language];
        if (checked) {
          newLang.push(value);
        } else {
          newLang = newLang.filter((l) => l !== value);
        }
        setFormData((prev) => ({ ...prev, language: newLang }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const mobilenumber = formData.mobilenumber.trim();
    const age = formData.age.trim();
    const city = formData.city.trim();

    // Basic validation
    if (
      !name ||
      !mobilenumber ||
      !age ||
      !city ||
      !formData.gender ||
      formData.language.length === 0 ||
      !formData.degree ||
      formData.vehicle.length === 0
    ) {
      alert("Please fill all the fields.");
      return;
    }

    // Mobile number validation
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobilenumber)) {
      alert("Mobile number must be exactly 10 digits.");
      return;
    }

    // Age validation
    if (isNaN(age) || parseInt(age) <= 0) {
      alert("Please enter a valid age.");
      return;
    }

    const data = {
      ...formData,
      name: formData.name.trim(),
      mobilenumber: formData.mobilenumber.trim(),
      age: formData.age.trim(),
      city: formData.city.trim(),
      language: formData.language, // array
      vehicle: formData.vehicle,   // array
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/apiapp/insert/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (res.ok) {
        alert("Successfully Added");
        setFormData({
          name: "",
          mobilenumber: "",
          age: "",
          city: "",
          gender: "",
          language: [],
          degree: "",
          vehicle: [],
        });
        setEmployees((prev) => [...prev, responseData]);
      } else {
        alert(
          "Failed to add data:\n" +
            (typeof responseData === "object"
              ? JSON.stringify(responseData, null, 2)
              : responseData)
        );
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("Network error — check if Django server is running.");
    }
  };

  // Fetch employees
  useEffect(() => {
    fetch("http://127.0.0.1:8000/apiapp/display/")
      .then((res) => res.json())
      .then((data) => setEmployees(data))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  // Delete employee
  const handleDelete = (id) => {
    if (window.confirm(`Are you sure to delete data ${id}?`)) {
      fetch(`http://127.0.0.1:8000/apiapp/member/delete/${id}`, {
        method: "DELETE",
      })
        .then(() => {
          setEmployees((prev) => prev.filter((emp) => emp.id !== id));
          alert("Successfully Deleted");
        })
        .catch((err) => console.error(err));
    }
  };

  // Edit employee
  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  return (
    <>
      <div className="container" autoComplete="off">
        <h1>Register Form</h1>
        <form onSubmit={handleSubmit}>
          <div className="header">
            <label>Name:</label>
            <input type="text"name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <br />
          <div className="header">
            <label>Mobile Number:</label>
            <input type="text" name="mobilenumber" maxLength="10" value={formData.mobilenumber} onChange={handleChange} required />
          </div>
          <br />
          <div className="header">
            <label>Age:</label>
            <input type="text" name="age" value={formData.age} onChange={handleChange} required />
          </div>
          <br />
          <div className="header">
            <label>City:</label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} required/>
          </div>
          <br />
          <div className="header">
            <label>Gender:</label>
            <select name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <br />
          <div className="header">
            <label>Language:</label>
            <br />
            <label>
              <input type="checkbox" name="language"  value="tamil" checked={formData.language.includes("tamil")} onChange={handleChange}/>
              Tamil
            </label>
            <label>
              <input type="checkbox" name="language" value="english" checked={formData.language.includes("english")} onChange={handleChange}/>
              English
            </label>
          </div>
          <br />
          <div className="header">
            <label>Degree:</label>
            <br />
            <label>UG:</label>
            <input type="radio" name="degree" value="ug" checked={formData.degree === "ug"} onChange={handleChange} required />
            <label>PG:</label>
            <input type="radio" name="degree" value="pg" checked={formData.degree === "pg"} onChange={handleChange} required/>
          </div>
          <br />
          <div className="header">
            <label>Vehicle:</label>
            <br />
            <label>Bike:</label>
            <input type="checkbox" name="vehicle" value="bike" checked={formData.vehicle.includes("bike")} onChange={handleChange}/>
            <label>Car:</label>
            <input type="checkbox" name="vehicle" value="car" checked={formData.vehicle.includes("car")} onChange={handleChange}/>
          </div>
          <br />
          <div className="button-container">
            <button type="submit" id="insert">
              Submit
            </button>
          </div>
        </form>
      </div>
      <h1>Employee Details</h1>
      <table className="table table-bordered">
        <thead className="alert-success">
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Mobilenumber</th>
            <th>Age</th>
            <th>City</th>
            <th>Gender</th>
            <th>Language</th>
            <th>Degree</th>
            <th>Vehicle</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.id}</td>
              <td>{emp.name}</td>
              <td>{emp.mobilenumber}</td>
              <td>{emp.age}</td>
              <td>{emp.city}</td>
              <td>{emp.gender}</td>
              <td>{Array.isArray(emp.language) ? emp.language.join(", ") : emp.language}</td>
              <td>{emp.degree}</td>
              <td>{Array.isArray(emp.vehicle) ? emp.vehicle.join(", ") : emp.vehicle}</td>
              <td><button className="btn btn-warning" onClick={() => handleEdit(emp.id)}>Edit</button></td>
              <td><button className="btn btn-danger" onClick={() => handleDelete(emp.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
export default About;
