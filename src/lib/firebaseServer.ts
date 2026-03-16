import { initializeServerApp } from "firebase/app";
import { firebaseConfig } from "./firebaseConfig"; // Import your existing config

export const getServerApp = (token: string) => {
  return initializeServerApp(firebaseConfig, {
    appCheckToken: token,
  });
};