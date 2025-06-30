import Cookies from "js-cookie";
import { encryptData, decryptData } from "./crypto";

// Set encrypted cookie
export const setEncryptedCookie = (
  name: string,
  data: object | string,
) => {
  const encrypted = encryptData(data);
  Cookies.set(name, encrypted, {
    secure: true,
    sameSite: "Strict",
  });
};

// Get decrypted cookie
export const getDecryptedCookie = <T = any>(name: string): T | string | null => {
  const encrypted = Cookies.get(name);
  if (!encrypted) return null;

  const decrypted = decryptData(encrypted);
  return isJsonString(decrypted) ? JSON.parse(decrypted) as T : decrypted;
};

// Clear cookie
export const clearCookie = (name: string) => {
  Cookies.remove(name, { secure: true, sameSite: "Strict" });
};

// Utility to check if a string is JSON
const isJsonString = (str: string): boolean => {
  return str.startsWith("{") || str.startsWith("[");
};

