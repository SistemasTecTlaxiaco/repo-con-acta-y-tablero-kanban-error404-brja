import React, { useState } from "react";

export default function Support() {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    setSent(true);
    setMessage("");
  };

  return (
    <div className="section">
      <h2 className="section-title">Soporte y Contacto</h2>
      <textarea
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="Escribe tu mensaje..."
        rows={5}
        style={{ width: "100%", borderRadius: "8px", padding: "12px" }}
      />
      <button className="button-primary" onClick={handleSend}>Enviar</button>
      {sent && <p style={{ color: "green" }}>¡Mensaje enviado!</p>}
    </div>
  );
}