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
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState<"success" | "error" | "">("");
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

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
    setToastMessage("Nincs kiválasztott könyv!");
    setToastType("error");
    setTimeout(() => setToastMessage(""), 3000);
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
      setToastMessage("Sikeres foglalás!");
      setToastType("success");
      setShowToast(true);
      setTimeout(() => setToastMessage(""), 3000);
      setShowModal(false);
    } else {
      const error = await response.json();
      setToastMessage(error.detail || "Hiba történt a foglalás során.");
      setToastType("error");
      setShowToast(true);
      setTimeout(() => setToastMessage(""), 3000);
    }
  };

  return (
    <>
      <div id="book-list-container" dangerouslySetInnerHTML={html} />
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <div         
        style={{
          background: "#fff",
          padding: "1em",
          borderRadius: "8px",
          minWidth: "220px",
          minHeight: "120px",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflow: "visible", // ensure absolutely positioned children are visible
        }}>
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="buttonStyle"
            style={{
              position: "absolute",
              top: "1em",
              right: "1em",
              background: "#fff",
              border: "1px solid #ccc",
              fontSize: "1em",
              cursor: "pointer",
              zIndex: 10,
              padding: "0.3em 1em",
            }}
          >
            Bezárás
          </button>
          <form 
            onSubmit={handleReserve}
            style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "static", // <-- ensure this is NOT relative
            marginTop: "3em",
          }}>
            <label>
              Kölcsönzés kezdete:
              <input
                type="date"
                value={startDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={e => {
                  setStartDate(e.target.value);
                  if (endDate < e.target.value) setEndDate(e.target.value);
                }}
                style={{
                  marginLeft: "0.5em",
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
                style={{
                  marginLeft: "0.5em",
                }}
              />
            </label>
            <br />
            {/* Centered Foglalás button */}
            <button
              type="submit"
              className="buttonStyle"
              style={{
                alignSelf: "center",
                minWidth: "120px",
                padding: "1em 3em",
              }}
            >
              Foglalás
            </button>
          </form>
        </div>
      </Modal>
      <div className={`toast ${toastType}`} style={{ display: showToast ? "block" : "none" }}>
        {toastMessage}
      </div>
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