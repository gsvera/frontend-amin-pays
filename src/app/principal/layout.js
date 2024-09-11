import { Inter } from "next/font/google";
import Index from "@/app/index";
// import MenuProvider from "@/components/menu/MenuProvider";
// import "@/styles/index.scss";
// import "bootstrap/dist/css/bootstrap.min.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Admin pay App",
  description: "Generated by AbaSayo Company",
};

export default function PrincipalLayout({ children }) {
  return (
    <Index>
      {/* <MenuProvider /> */}
      {children}
    </Index>
  );
}
