import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Side Hustle Bar - Sports Bar, Restaurant, and Nightclub",
  description: "High-Energy Sports Bar, Restaurant, and Nightclub featuring Executive Chef Rebecca Sanchez. #1 Rated Mexican Food & Best Tacos in Town.",
  openGraph: {
    title: "Side Hustle Bar - Sports Bar, Restaurant, and Nightclub",
    description: "High-Energy Sports Bar, Restaurant, and Nightclub featuring Executive Chef Rebecca Sanchez. #1 Rated Mexican Food & Best Tacos in Town.",
    url: "https://sidehustlebar.com/",
    siteName: "Side Hustle Bar",
    images: [
      {
        url: "/wolf-icon-black.png",
        width: 512,
        height: 512,
        alt: "Side Hustle Bar Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Side Hustle Bar - Sports Bar, Restaurant, and Nightclub",
    description: "High-Energy Sports Bar, Restaurant, and Nightclub featuring Executive Chef Rebecca Sanchez. #1 Rated Mexican Food & Best Tacos in Town.",
    images: ["/wolf-icon-black.png"],
  },
};