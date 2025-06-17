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
        setFormData({
            name: "",
            email: "",
            message: ""
        });
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6"> 
                    <div className="card shadow-lg p-4 mb-5 bg-white rounded"> 
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4 fw-bold" style={{ color: '#0056b3' }}>Contáctanos</h2>
                            <p className="text-center text-muted mb-4">
                                ¿Tienes alguna pregunta o sugerencia? ¡Nos encantaría escucharte!
                                Rellena el formulario y nos pondremos en contacto contigo lo antes posible.
                            </p>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3"> 
                                    <label htmlFor="name" className="form-label">Nombre</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-lg"
                                        id="name"
                                        name="name"
                                        placeholder="Tu nombre"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Correo electrónico</label>
                                    <input
                                        type="email"
                                        className="form-control form-control-lg"
                                        id="email"
                                        name="email"
                                        placeholder="tu@email.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="message" className="form-label">Mensaje</label>
                                    <textarea
                                        className="form-control form-control-lg"
                                        id="message"
                                        name="message"
                                        rows="5"
                                        placeholder="Tu mensaje aquí..."
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        style={{ resize: 'vertical' }}
                                    ></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary btn-lg w-100 shadow-sm">Enviar</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;