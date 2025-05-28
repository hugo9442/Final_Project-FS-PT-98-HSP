import React, { useState } from "react";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = e => {
        e.preventDefault();
        alert("Mensaje enviado. ¡Gracias por contactarnos!");
    };

    return (
        <div className="container mt-5">
            <style>{`
                form {
                    background-color: #f8f9fa;
                    padding: 2rem;
                    border-radius: 0.5rem;
                }
                h2 {
                    color: #343a40;
                    font-weight: 600;
                }
                textarea.form-control {
                    resize: none;
                }
            `}</style>

            <h2 className="text-center mb-4">Contáctanos</h2>
            <form onSubmit={handleSubmit} className="mx-auto col-md-8">
                <div className="form-group mb-3">
                    <label htmlFor="name">Nombre</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        placeholder="Tu nombre"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="email">Correo electrónico</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        placeholder="tu@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group mb-4">
                    <label htmlFor="message">Mensaje</label>
                    <textarea
                        className="form-control"
                        id="message"
                        name="message"
                        rows="5"
                        placeholder="Tu mensaje aquí..."
                        value={formData.message}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>
                <button type="submit" className="btn btn-primary w-100">Enviar</button>
            </form>
        </div>
    );
};

export default Contact;
