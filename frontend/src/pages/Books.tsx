import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../api";
import { useState } from "react";
import "./Books.css";

function Modal({ show, onClose, children }: { show: boolean, onClose: () => void, children: React.ReactNode }) {
  if (!show) return null;
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
    }}>
      <div style={{ background: "#fff", padding: "2em", borderRadius: "8px", minWidth: "300px" }}>
        {children}
      </div>
    </div>
  );
}

export function ListBooks() {
  const [html, setHTML] = useState<{__html: string}>({__html: ""});
  const [showModal, setShowModal] = useState(false);
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  // Calculate max end date (3 weeks from today)
  const maxEndDate = (() => {
    const max = new Date();
    max.setDate(max.getDate() + 21);
    return max.toISOString().split("T")[0];
  })();

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/home");
    }
  }, [navigate]);

  useEffect(() => {
    async function createList() {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${API_BASE}/userAPIs/listBooks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const backendHtmlString = await response.text();
      setHTML({ __html: backendHtmlString });
    }
    createList();
  }, []);

useEffect(() => {
  const handler = (e: Event) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "BUTTON" && target.textContent === "Kikölcsönzés") {
      const bookId = target.getAttribute("data-book-id");
      setSelectedBookId(bookId);
      setShowModal(true);
    }
  };
  const container = document.getElementById("book-list-container");
  if (container) container.addEventListener("click", handler);
  return () => {
    if (container) container.removeEventListener("click", handler);
  };
}, [html]);

// Filter function for the list
useEffect(() => {
  const searchInput = document.getElementById("search-bar") as HTMLInputElement | null;
  const container = document.getElementById("book-list-container");
  if (!searchInput || !container) return;

  const handler = () => {
    const search = searchInput.value.toLowerCase();
    const items = Array.from(container.querySelectorAll("li"));
    items.forEach(li => {
      if (li.classList.contains("header-row")) {
        li.style.display = "";
        return;
      }
      const text = li.textContent?.toLowerCase() || "";
      li.style.display = text.includes(search) ? "" : "none";
    });
  };

  searchInput.addEventListener("input", handler);
  return () => searchInput.removeEventListener("input", handler);
}, [html]);

const handleReserve = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!selectedBookId) {
    alert("Nincs kiválasztott könyv!");
    return;
  }
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${API_BASE}/userAPIs/rentBook`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      userName: localStorage.getItem("username"),
      bookID: selectedBookId,
      startDate,
      endDate,
    }),
  });
    if (response.ok) {
      alert("Sikeres foglalás!");
      setShowModal(false);
    } else {
      const error = await response.json();
      alert(error.detail || "Hiba történt a foglalás során.");
    }
  };

  return (
    <>
      <div id="book-list-container" dangerouslySetInnerHTML={html} />
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <h2>Könyv kölcsönzése</h2>
        <form onSubmit={handleReserve}>
        <label>
          Kölcsönzés kezdete:   
          <input
            type="date"
            value={startDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={e => {
              setStartDate(e.target.value);
              // Optionally reset endDate if it's before new startDate
              if (endDate < e.target.value) setEndDate(e.target.value);
            }}
          />
        </label>
        <br />
        <label>
          Kölcsönzés lejárata:   
          <input
            type="date"
            value={endDate}
            min={startDate}
            max={maxEndDate}
            onChange={e => setEndDate(e.target.value)}
          />
        </label>
        <br />
        <button type="submit" className="buttonStyle">Foglalás</button>
        <button type="button" onClick={() => setShowModal(false)} className="buttonStyle" style={{marginLeft: "1em"}}>Bezárás</button>
      </form>
      </Modal>
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
        <ListBooks />
    );
};



export default Books;