"use client";

import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export default function Principal() {
  const { token, dataUser } = useSelector((state) => state.userSlice);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token]);

  return (
    <div>
      Bienvenido {dataUser.firstName} {dataUser.lastName}
    </div>
  );
}
