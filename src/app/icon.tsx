import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

async function loadGoogleFont(text: string) {
  const url = `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
  if (resource) {
    const res = await fetch(resource[1]);
    if (res.status === 200) return res.arrayBuffer();
  }
  throw new Error("failed to load font data for icon");
}

export default async function Icon() {
  const text = "格闘.com";
  const fontData = await loadGoogleFont(text);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#000",
          color: "#e2402a",
          fontFamily: "Noto Sans JP",
        }}
      >
        <div style={{ fontSize: 15, lineHeight: 1 }}>格闘</div>
        <div style={{ fontSize: 9, lineHeight: 1, marginTop: 1 }}>.com</div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Noto Sans JP", data: fontData, style: "normal", weight: 700 }],
    },
  );
}
