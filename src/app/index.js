"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { App } from "./App";

export default function Index({ children }) {
  // const router = useRouter();
  // const [langLocal, setLangLocal] = useState('es');
  // useEffect(() => {
  //     setLangLocal(localStorage.getItem('lang'));
  //     redirectPanels(parseInt(window.localStorage.getItem('idProfile')));
  // },[])

  // function redirectPanels (idProfile){
  //     switch (idProfile) {
  //         case 1:
  //             router.push("/panel-client");
  //             break;
  //         case 2:
  //             router.push("/panel-provider")
  //             break;
  //     }
  // }

  return <App lang={"es"}>{children}</App>;
}
