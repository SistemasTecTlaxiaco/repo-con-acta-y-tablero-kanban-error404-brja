import React from "react";
interface ReceiptsProps {
  receipts: any[];
}

export default function Receipts({ receipts }: { receipts: any[] }) {
  return (
    <div className="section">
      <h2 className="section-title">Comprobantes de Pago</h2>
      {receipts.length === 0 ? (
        <p>No tienes comprobantes disponibles.</p>
      ) : (
        receipts.map(r => (
          <div className="card" key={r.id}>
            <p><b>Préstamo:</b> {r.loanId}</p>
            <p><b>Fecha de pago:</b> {r.date}</p>
            <a className="button-primary" href={r.pdfUrl} target="_blank" rel="noopener noreferrer">
              Descargar PDF
            </a>
          </div>
        ))
      )}
    </div>
  );
}