export const baseUrl = "http://localhost:4000";
// export const baseUrl = "https://wasting-pony-vagueness.ngrok-free.dev";

export const FireAPI = async (endPoint, method = "GET", body, token = null) => {
  const url = `${baseUrl}/${endPoint}`;

  let headers = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (!(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const options = {
    method: method.toUpperCase(),
    headers,
  };

  if (body && method !== "GET") {
    options.body = body instanceof FormData ? body : JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (response.ok) return data;
    else throw data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
