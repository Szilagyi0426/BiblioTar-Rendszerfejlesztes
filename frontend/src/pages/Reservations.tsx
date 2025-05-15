import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../api";
import { useState } from "react";
import "./Reservations.css";

function ConfirmationModal({ show, onConfirm, onCancel }: { show: boolean, onConfirm: () => void, onCancel: () => void }) {
  if (!show) return null;
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
    }}>
      <div style={{ background: "#fff", padding: "2em", borderRadius: "8px", minWidth: "300px" }}>
        <p>Biztosan ki akarja fizetni a büntetést?</p>
        <button className="buttonStyle" onClick={onConfirm}>Igen</button>
        <button className="buttonStyle" onClick={onCancel} style={{marginLeft: "1em"}}>Nem</button>
      </div>
    </div>
  );
}

export function ListRentedBooks() {
  const [html, setHTML] = useState<{ __html: string }>({ __html: "" });
  const [showModal, setShowModal] = useState(false);
  const [selectedBorrowId, setSelectedBorrowId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/home");
    }
  }, [navigate]);

  // Move fetchRentedBooks outside useEffect so you can call it anytime
  const fetchRentedBooks = async () => {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${API_BASE}/userAPIs/listRentedBooks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const backendHtmlString = await response.text();
    setHTML({ __html: backendHtmlString });
  };

  useEffect(() => {
    fetchRentedBooks();
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "BUTTON" && target.textContent === "Büntetés fizetése") {
        const borrowId = target.getAttribute("data-borrow-id");
        setSelectedBorrowId(borrowId);
        setShowModal(true);
      }
    };
    const container = document.getElementById("rented-books-list-container");
    if (container) container.addEventListener("click", handler);
    return () => {
      if (container) container.removeEventListener("click", handler);
    };
  }, [html]);

  const handleConfirm = async () => {
    setShowModal(false);
    const token = localStorage.getItem("access_token");
    if (!selectedBorrowId) return;
    const response = await fetch(`${API_BASE}/userAPIs/payFine`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fineID: selectedBorrowId,
      }),
    });
    if (response.ok) {
      alert("Büntetés sikeresen kifizetve!");
      await fetchRentedBooks(); // Refresh the list after payment
    } else {
      const error = await response.json();
      alert(error.detail || "Hiba történt a fizetés során.");
    }
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <>
      <div id="rented-books-list-container" dangerouslySetInnerHTML={html} />
      <ConfirmationModal show={showModal} onConfirm={handleConfirm} onCancel={handleCancel} />
    </>
  );
}

const Books: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            navigate("/");
        }
    }, [navigate]);
    return (
        <ListRentedBooks />
    );
};



export default Books;