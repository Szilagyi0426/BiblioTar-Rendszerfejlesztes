// frontend/src/api.ts
export const API_BASE = "http://localhost:8000";

export async function loginUser(username: string, password: string) {
  const response = await fetch(`${API_BASE}/authAPIs/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Sikertelen bejelentkezés");
  }

  return response.json();
}

export async function registerUser(username: string, email:string, password: string, passwordAgain: string) {
  if (password !== passwordAgain) {
    throw new Error("A két jelszó nem egyezik");
  }
  const response = await fetch(`${API_BASE}/authAPIs/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  });

  if (!response.ok) {
    throw new Error("Sikertelen Regisztráció");
  }

  return await loginUser(username, password);

}

export async function setPersonalData(address: string, phoneNumber: string) {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("Nincs bejelentkezett felhasználó");
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const setAddressResponse = await fetch(`${API_BASE}/userAPIs/changeAddress`, {
    method: "POST",
    headers,
    body: JSON.stringify({ address }),
  });

  const setPhoneNumberResponse = await fetch(`${API_BASE}/userAPIs/changePhoneNumber`, {
    method: "POST",
    headers,
    body: JSON.stringify({ phoneNumber }),
  });

  if (!setAddressResponse.ok || !setPhoneNumberResponse.ok) {
    throw new Error("Sikertelen személyes adatok beállítása");
  }

  return Promise.all([
    setAddressResponse.json(),
    setPhoneNumberResponse.json(),
  ]);
}


