import {Place} from "@/types/map/map.types";

export const ZURICH = {latitude: 47.3769, longitude: 8.5417, latitudeDelta: 0.06, longitudeDelta: 0.06};

export const EXPLORE_POIS: Place[] = [
    {
        id: "seed-grossmunster",
        name: "Grossmünster",
        latitude: 47.3702,
        longitude: 8.544,
        category: "landmark",
        note: "Twin-towered church, cradle of the Reformation."
    },
    {
        id: "seed-lindenhof",
        name: "Lindenhof",
        latitude: 47.3731,
        longitude: 8.541,
        category: "viewpoint",
        note: "Best free old-town view."
    },
    {
        id: "seed-bahnhofstrasse",
        name: "Bahnhofstrasse",
        latitude: 47.3717,
        longitude: 8.5392,
        category: "landmark",
        note: "The old moat, now grand."
    },
    {
        id: "seed-zeughauskeller",
        name: "Zeughauskeller",
        latitude: 47.3697,
        longitude: 8.5404,
        category: "food",
        note: "Swiss classics in an old armoury."
    },
    {
        id: "seed-sprungli",
        name: "Confiserie Sprüngli",
        latitude: 47.3697,
        longitude: 8.5388,
        category: "food",
        note: "Luxemburgerli since 1836."
    },
    {
        id: "seed-kunsthaus",
        name: "Kunsthaus Zürich",
        latitude: 47.37,
        longitude: 8.5483,
        category: "museum",
        note: "Switzerland's top art collection."
    },
    {
        id: "seed-lake",
        name: "Lake Zurich Promenade",
        latitude: 47.364,
        longitude: 8.541,
        category: "nature",
        note: "Lakeside walk with Alpine views."
    },
    {
        id: "seed-uetliberg",
        name: "Uetliberg",
        latitude: 47.3497,
        longitude: 8.4915,
        category: "nature",
        note: "The local mountain — big panorama."
    },
];