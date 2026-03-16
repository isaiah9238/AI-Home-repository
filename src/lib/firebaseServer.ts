import { initializeServerApp } from "firebase/app";
import { firebaseConfig } from "@/lib/firebase"; 

export const getServerApp = (token: string) => {
  return initializeServerApp(firebaseConfig, {
    appCheckToken: token,
  });
};