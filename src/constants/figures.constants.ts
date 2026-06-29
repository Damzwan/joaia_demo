import {FIGURE_IMAGES} from "@/constants/image.constants";
import {Figure} from "@/types/chat/entities.types";

export const FIGURES: Figure[] = [
    {
        id: "zwingli", name: "Huldrych Zwingli", years: "1484–1531", field: "Reformer", accentColor: "#92400E",
        blurb: "Lit the Swiss Reformation",
        bio: "From the pulpit of the Grossmünster, Zwingli launched the Swiss Reformation in 1519 — reshaping the city's churches, politics and even its food (he famously defended eating sausage during Lent).",
        relatedPlace: "Grossmünster",
        imageUrl: FIGURE_IMAGES.zwingly
    },
    {
        id: "einstein", name: "Albert Einstein", years: "1879–1955", field: "Physicist", accentColor: "#1D4ED8",
        blurb: "Studied & taught at ETH",
        bio: "Einstein studied at ETH Zürich and later returned as a professor. He developed key ideas here and earned his doctorate from the University of Zürich in 1905 — his 'miracle year'.",
        relatedPlace: "ETH Zürich",
        imageUrl: FIGURE_IMAGES.einstein
    },
    {
        id: "jung", name: "Carl Jung", years: "1875–1961", field: "Psychiatrist", accentColor: "#0F766E",
        blurb: "Founded analytical psychology",
        bio: "Jung worked at Zürich's Burghölzli clinic and lived on the lake in Küsnacht. His ideas — the collective unconscious, archetypes, introversion — were largely shaped here.",
        relatedPlace: "Lake Zurich Promenade",
        imageUrl: FIGURE_IMAGES.jung
    },
    {
        id: "taeuber-arp", name: "Sophie Taeuber-Arp", years: "1889–1943", field: "Artist", accentColor: "#BE123C",
        blurb: "Dada pioneer",
        bio: "A leading figure of the Zürich Dada movement and a pioneer of geometric abstraction. Her work later appeared on the Swiss 50-franc note — the first woman to be so honoured.",
        relatedPlace: "Kunsthaus Zürich",
        imageUrl: FIGURE_IMAGES.taeuber
    },
    {
        id: "escher", name: "Alfred Escher", years: "1819–1882", field: "Railway pioneer", accentColor: "#475569",
        blurb: "Built modern Zürich",
        bio: "Escher founded the railway, the bank that became Credit Suisse, and ETH itself — arguably the architect of modern Zürich. His statue stands outside the main station.",
        relatedPlace: "Zürich Hauptbahnhof",
        imageUrl: FIGURE_IMAGES.escher
    },
    {
        id: "turner", name: "Tina Turner", years: "1939–2023", field: "Musician", accentColor: "#7C3AED",
        blurb: "Made Zürich home",
        bio: "The Queen of Rock 'n' Roll spent her final decades by Lake Zürich in Küsnacht and became a Swiss citizen in 2013 — a reminder that the city's story is still being written.",
        relatedPlace: "Lake Zurich Promenade",
        imageUrl: FIGURE_IMAGES.turner
    },
];