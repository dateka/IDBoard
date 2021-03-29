import React from "react";

type LogoProps = {
  src: string;
  alt: string;
  size: string;
};

export default function Logo({ src, alt, size }: LogoProps) {
  return (
    <>
      <img src={src} alt={`logo ${alt}`} style={{ width: size }} />
    </>
  );
}
