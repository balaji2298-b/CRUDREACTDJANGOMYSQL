import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../App.css";

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    mobilenumber: "",
    age: "",
    city: "",
    gender: "",
    language: "",
    degree: "",
    vehicle: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/apiapp/member/${id}/`);
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setFormData(data);
      } catch (err) {
        console.error("Error loading employee:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async () => {
    const submitData = {
      ...formData,
      age: Number(formData.age),
    };

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/apiapp/member/update/${id}/`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submitData),
        }
      );

      if (response.ok) {
        alert("Successfully Updated");
        navigate("/", { replace: true });   
      } else {
        const errorData = await response.json();
        alert("Update failed: " + JSON.stringify(errorData));
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container">
      <h1>Update Employee</h1>
      {Object.entries(formData).map(([key, value]) => (
        <div key={key} style={{ marginBottom: "10px" }}>
          <label htmlFor={key} style={{ marginRight: "10px" }}>
            {key.charAt(0).toUpperCase() + key.slice(1)}:
          </label>
          <input type={key === "age" ? "number" : "text"} id={key} value={value} onChange={handleChange} />
        </div>
      ))}
      <div className="button-container">
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default Edit;
