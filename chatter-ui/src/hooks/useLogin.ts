import { useState } from "react"
import client from "../constants/apollo-client";
import { UNKNOWN_ERROR_MESSAGE } from "../constants/error";

interface LoginRequest {
  email: string;
  password: string;
}

const useLogin = () => {
  const [error, setError] = useState<string>("");

  const login = async (request: LoginRequest) => {
    const res = await fetch(
      `api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      if (res.status === 401) {
        setError('Credentials are not valid.')
      } else {
        setError(UNKNOWN_ERROR_MESSAGE);
      }

      return;
    }
    setError("");

    await client.refetchQueries({ include: "active" })
  }
  return { error, login };
}

export { useLogin };