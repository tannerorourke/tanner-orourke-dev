import type { Metadata } from "next";
import HomePage from "@/components/pages/Home";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function Index() {
  return <HomePage />;
}
