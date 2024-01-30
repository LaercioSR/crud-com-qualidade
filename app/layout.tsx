export const metadate = {
  title: "Next.js",
  description: "Generated by Next.js",
};
import React from "react";
import StyledJsxRegistry from "./registry";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body>
        <StyledJsxRegistry>{children}</StyledJsxRegistry>
      </body>
    </html>
  );
}