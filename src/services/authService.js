const AUTH_STORAGE_KEY = "school_form_is_authenticated";

export const DEMO_CREDENTIALS = {
  username: "admin",
  password: "123456",
};

export function validateLoginCredentials({ username, password }) {
  return (
    username.trim().toLowerCase() === DEMO_CREDENTIALS.username &&
    password === DEMO_CREDENTIALS.password
  );
}

export function startAuthSession() {
  sessionStorage.setItem(AUTH_STORAGE_KEY, "1");
}

export function clearAuthSession() {
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
}

export function isAuthSessionActive() {
  return sessionStorage.getItem(AUTH_STORAGE_KEY) === "1";
}
