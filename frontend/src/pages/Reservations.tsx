import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../api";
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

function EditRentalModal({
  show,
  onClose,
  onCancelRental,
  onExtendRental,
  selectedDate,
  setSelectedDate,
  minDate,
  maxDate,
}: {
  show: boolean;
  onClose: () => void;
  onCancelRental: () => void;
  onExtendRental: () => void;
  selectedDate: string;
  setSelectedDate: (d: string) => void;
  minDate: string;
  maxDate: string;
}) {
  if (!show) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // @ts-ignore submitter is supported in modern browsers
    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement;
    if (submitter?.name === "cancel") {
      onCancelRental();
    } else if (submitter?.name === "extend") {
      onExtendRental();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          padding: "2em",
          borderRadius: "8px",
          minWidth: "320px",
          minHeight: "220px",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <button
          className="buttonStyle"
          style={{ marginBottom: "2em", width: "100%" }}
          type="submit"
          name="cancel"
        >
          Kölcsönzés törlése
        </button>
        <label style={{ width: "100%", textAlign: "center", marginBottom: "1em" }}>
          Új lejárati dátum:
          <input
            type="date"
            value={selectedDate}
            min={minDate}
            max={maxDate}
            onChange={e => setSelectedDate(e.target.value)}
            style={{ display: "block", margin: "1em auto", width: "100%" }}
          />
        </label>
        <button
          className="buttonStyle"
          type="submit"
          name="extend"
          style={{ width: "100%" }}
        >
          Kölcsönzés hosszabítása
        </button>
      </form>
      <button
        className="buttonStyle"
        onClick={onClose}
        style={{
          position: "absolute",
          top: "1em",
          right: "1em",
          background: "transparent",
          border: "none",
          cursor: "pointer",
        }}
        >
          Bezárás
        </button>
        
    </div>
  );
}

export function ListRentedBooks() {
  const [html, setHTML] = useState<{ __html: string }>({ __html: "" });
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBorrowId, setSelectedBorrowId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const navigate = useNavigate();

  // For calendar limits
  const minDate = new Date().toISOString().split("T")[0];
  const maxDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 21);
    return d.toISOString().split("T")[0];
  })();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/home");
    }
  }, [navigate]);

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

useEffect(() => {
    const handler = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "BUTTON" && target.textContent === "Kölcsönzés szerkesztése") {
        const borrowId = target.getAttribute("data-borrow-id");
        if (borrowId) {
          setSelectedBorrowId(borrowId);
          setShowEditModal(true);
        }
      }
    };
    const container = document.getElementById("rented-books-list-container");
    if (container) container.addEventListener("click", handler);
    return () => {
      if (container) container.removeEventListener("click", handler);
    };
  }, [html]);

  // Cancel rental
  const handleCancelRental = async () => {
    console.log("handleCancelRental called", selectedBorrowId);
    const token = localStorage.getItem("access_token");
    if (!selectedBorrowId) return;
    const response = await fetch(`${API_BASE}/userAPIs/rentCancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        rentID: selectedBorrowId,
      }),
    });
    if (response.ok) {
      alert("Kölcsönzés törölve!");
      await fetchRentedBooks();
    } else {
      const error = await response.json();
      alert(error.detail || "Hiba történt a törlés során.");
    }
    setShowEditModal(false);
};

  // Extend rental
  const handleExtendRental = async () => {
    // Validate date
    if (selectedDate < minDate || selectedDate > maxDate) {
      alert("A kiválasztott dátum érvénytelen! Csak a mai naptól számított 3 héten belüli dátum választható.");
      return;
    }
    const token = localStorage.getItem("access_token");
    if (!selectedBorrowId) return;
    const response = await fetch(`${API_BASE}/userAPIs/rentExtend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        rentID: selectedBorrowId,
        newEndDate: selectedDate,
      }),
    });
    if (response.ok) {
      alert("Kölcsönzés meghosszabbítva!");
      await fetchRentedBooks();
    } else {
      const error = await response.json();
      alert(error.detail || "Hiba történt a hosszabbítás során.");
    }
    setShowEditModal(false);
  };

  const handleCloseEditModal = () => setShowEditModal(false);

  return (
    <>
      <div id="rented-books-list-container" dangerouslySetInnerHTML={html} />
      <ConfirmationModal show={showModal} onConfirm={handleConfirm} onCancel={handleCancel} />
      <EditRentalModal
        show={showEditModal}
        onClose={handleCloseEditModal}
        onCancelRental={handleCancelRental}
        onExtendRental={handleExtendRental}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        minDate={minDate}
        maxDate={maxDate}
      />
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