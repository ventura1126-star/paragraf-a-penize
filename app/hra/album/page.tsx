import type { Metadata } from "next";
import { Album } from "@/components/game/Album";

export const metadata: Metadata = { title: "Album karet" };

export default function AlbumPage() {
  return (
    <>
      <h1>Album paragrafů</h1>
      <Album />
    </>
  );
}
