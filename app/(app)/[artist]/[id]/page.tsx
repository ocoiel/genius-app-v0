import Lyrics from "@/components/lyrics";
import { fetcher } from "@/lib/fetcher";
import { Suspense } from "react";

export default async function LyricPage({
  params,
}: {
  params: { artist: string; id: string };
}) {
  console.log("🚀 ~ LyricPage ~ params:", params);

  const id = params.id.split("-").pop();
  console.log("🚀 ~ id:", id);

  const data = await fetcher(
    `https://api.vagalume.com.br/search.php?musid=${id}&apikey=${process.env.VAGALUME_API_KEY}`
  );
  console.log("🚀 ~ data:", data);
  return (
    <div>
      <h1>Lyric - {params.id}</h1>
      <Suspense fallback={<div>Carregando letra...</div>}>
        {/* @ts-ignore */}
        <Lyrics lyrics={data.mus[0].text} />
      </Suspense>
    </div>
  );
}
