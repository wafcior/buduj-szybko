import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Remivo – Porównywarka ofert remontowych i budowlanych" },
      {
        name: "description",
        content:
          "Bezpłatne porównywanie ofert wykonawców remontowych i budowlanych w całej Polsce. Działamy od 2009 roku.",
      },
      { property: "og:title", content: "Remivo – Porównywarka ofert remontowych" },
      {
        property: "og:description",
        content: "Porównaj oferty sprawdzonych firm remontowych w Twoim regionie.",
      },
    ],
  }),
  component: Index,
});

type Service = {
  id: string;
  name: string;
  unit: "m²" | "mb" | "szt.";
  basePrice: [number, number]; // PLN per unit
  description: string;
};

type Category = {
  id: string;
  name: string;
  short: string;
  intro: string;
  services: Service[];
};

const CATEGORIES: Category[] = [
  {
    id: "sciany",
    name: "Ściany i Tynki",
    short: "Tynkowanie, gładzie, zabudowy GK, murowanie ścianek działowych.",
    intro:
      "Prace związane z przygotowaniem powierzchni ścian, wykonaniem tynków wewnętrznych, gładzi gipsowych oraz konstrukcji z płyt gipsowo-kartonowych.",
    services: [
      { id: "tynk-cw", name: "Tynki cementowo-wapienne", unit: "m²", basePrice: [42, 65], description: "Wykonanie tynków cementowo-wapiennych ręcznie lub maszynowo, kategoria III." },
      { id: "tynk-gips", name: "Tynki gipsowe maszynowe", unit: "m²", basePrice: [38, 58], description: "Aplikacja maszynowa tynku gipsowego wraz z zacieraniem na gładko." },
      { id: "gladz", name: "Gładź gipsowa szpachlowana", unit: "m²", basePrice: [28, 45], description: "Dwukrotne szpachlowanie powierzchni gładzią gipsową, szlifowanie." },
      { id: "gk-scianka", name: "Ścianki działowe z płyt GK", unit: "m²", basePrice: [85, 140], description: "Konstrukcja stalowa CW/UW z poszyciem dwustronnym, wypełnienie wełną." },
      { id: "murowanie", name: "Murowanie ścianek z bloczków", unit: "m²", basePrice: [70, 110], description: "Murowanie ścianek działowych z bloczków silikatowych lub gazobetonowych." },
    ],
  },
  {
    id: "malowanie",
    name: "Malowanie",
    short: "Malowanie ścian i sufitów, lakierowanie, impregnacja drewna.",
    intro:
      "Kompleksowe usługi malarskie obejmujące przygotowanie podłoża, gruntowanie oraz aplikację farb akrylowych, lateksowych i ceramicznych.",
    services: [
      { id: "mal-sciany", name: "Malowanie ścian – lokal", unit: "m²", basePrice: [14, 24], description: "Dwukrotne malowanie farbą akrylową lub lateksową wraz z gruntowaniem." },
      { id: "mal-sufit", name: "Malowanie sufitów", unit: "m²", basePrice: [16, 28], description: "Dwukrotne malowanie sufitów farbą sufitową wraz z zabezpieczeniem podłóg." },
      { id: "lakier-drewna", name: "Lakierowanie elementów drewnianych", unit: "m²", basePrice: [55, 90], description: "Szlifowanie i trzykrotne lakierowanie powierzchni drewnianych." },
      { id: "impregnacja", name: "Impregnacja drewna", unit: "m²", basePrice: [22, 38], description: "Aplikacja preparatów grzybobójczych i ognioodpornych." },
    ],
  },
  {
    id: "dachy",
    name: "Dachy",
    short: "Naprawa, krycie papą, dachówką, blachodachówką, ocieplenie i wentylacja.",
    intro:
      "Usługi dekarskie obejmujące naprawy doraźne, kompleksowe pokrycia dachowe, ocieplenia oraz wymianę poszycia.",
    services: [
      { id: "papa", name: "Nakładanie papy termozgrzewalnej", unit: "m²", basePrice: [55, 95], description: "Dwuwarstwowe pokrycie papą termozgrzewalną SBS, podkładową i wierzchnią." },
      { id: "dachowka", name: "Krycie dachówką ceramiczną", unit: "m²", basePrice: [110, 180], description: "Montaż dachówki ceramicznej lub cementowej na łatach, wraz z gąsiorami." },
      { id: "blachodachowka", name: "Krycie blachodachówką", unit: "m²", basePrice: [85, 140], description: "Montaż blachodachówki modułowej wraz z obróbkami blacharskimi." },
      { id: "naprawa-dziur", name: "Naprawa nieszczelności i przebić", unit: "szt.", basePrice: [180, 450], description: "Lokalizacja przecieku, uszczelnienie i naprawa pokrycia dachowego." },
      { id: "ocieplenie-dachu", name: "Ocieplenie połaci dachowej", unit: "m²", basePrice: [75, 130], description: "Montaż wełny mineralnej między i pod krokwiami, paroizolacja." },
      { id: "dach-od-nowa", name: "Wykonanie pokrycia od podstaw", unit: "m²", basePrice: [220, 380], description: "Demontaż starego pokrycia, więźba uzupełniająca, folia, łacenie i pokrycie." },
      { id: "rynny", name: "Wymiana rynien i rur spustowych", unit: "mb", basePrice: [65, 110], description: "Demontaż starych i montaż nowych rynien stalowych lub PCV." },
    ],
  },
  {
    id: "podlogi",
    name: "Podłogi",
    short: "Panele, parkiet, wylewki, płytki, posadzki przemysłowe.",
    intro:
      "Wykonanie podkładów posadzkowych oraz montaż wszelkiego rodzaju wykończeń podłogowych zgodnie ze sztuką budowlaną.",
    services: [
      { id: "panele", name: "Układanie paneli podłogowych", unit: "m²", basePrice: [28, 45], description: "Montaż paneli laminowanych na podkładzie wraz z listwami przypodłogowymi." },
      { id: "parkiet", name: "Układanie parkietu", unit: "m²", basePrice: [85, 160], description: "Klejenie parkietu drewnianego, cyklinowanie i lakierowanie." },
      { id: "wylewka", name: "Wylewki samopoziomujące", unit: "m²", basePrice: [35, 60], description: "Wykonanie wylewki anhydrytowej lub cementowej grubości 4–6 cm." },
      { id: "plytki", name: "Glazura i terakota", unit: "m²", basePrice: [85, 150], description: "Układanie płytek ceramicznych, gres lub glazury wraz z fugowaniem." },
    ],
  },
  {
    id: "instalacje",
    name: "Instalacje",
    short: "Elektryka, hydraulika, ogrzewanie, klimatyzacja i wentylacja.",
    intro:
      "Wykonawstwo i modernizacja instalacji wewnętrznych wraz z dokumentacją i protokołami pomiarowymi.",
    services: [
      { id: "elektryka", name: "Instalacja elektryczna – punkt", unit: "szt.", basePrice: [120, 220], description: "Wykonanie punktu elektrycznego (gniazdo lub oświetlenie) wraz z bruzdowaniem." },
      { id: "hydraulika", name: "Instalacja wodno-kanalizacyjna – punkt", unit: "szt.", basePrice: [220, 380], description: "Wykonanie punktu wod-kan z rur PEX lub PP, wraz z próbą szczelności." },
      { id: "co", name: "Instalacja centralnego ogrzewania", unit: "szt.", basePrice: [380, 650], description: "Montaż grzejnika wraz z podejściem i armaturą regulacyjną." },
      { id: "klima", name: "Montaż klimatyzacji typu split", unit: "szt.", basePrice: [1800, 3200], description: "Kompletny montaż jednostki wewnętrznej i zewnętrznej, instalacja chłodnicza." },
    ],
  },
  {
    id: "lazienki",
    name: "Łazienki i Kuchnie",
    short: "Kompleksowe remonty, glazura, armatura, meble na wymiar.",
    intro:
      "Kompleksowe usługi remontowe pomieszczeń mokrych obejmujące prace hydrauliczne, elektryczne, glazurnicze i wykończeniowe.",
    services: [
      { id: "lazienka-komp", name: "Kompleksowy remont łazienki", unit: "m²", basePrice: [950, 1600], description: "Pełen zakres prac: skucie, instalacje, izolacje, glazura, montaż armatury." },
      { id: "kuchnia-komp", name: "Kompleksowy remont kuchni", unit: "m²", basePrice: [780, 1400], description: "Demontaż, instalacje, tynki, podłogi, malowanie, montaż mebli." },
      { id: "glazura-laz", name: "Glazura w łazience", unit: "m²", basePrice: [110, 180], description: "Układanie glazury i terakoty wraz z fugowaniem epoksydowym." },
      { id: "armatura", name: "Montaż armatury sanitarnej", unit: "szt.", basePrice: [180, 350], description: "Montaż umywalki, WC, baterii lub kabiny prysznicowej." },
    ],
  },
  {
    id: "elewacje",
    name: "Elewacje",
    short: "Ocieplenie budynku, tynki zewnętrzne, okładziny, renowacja.",
    intro:
      "Prace elewacyjne realizowane w systemie ETICS oraz tradycyjnym, zgodnie z aktualnymi normami budowlanymi.",
    services: [
      { id: "etics", name: "Ocieplenie elewacji w systemie ETICS", unit: "m²", basePrice: [180, 280], description: "Styropian/wełna 15 cm, siatka, klej, tynk silikonowy lub silikatowy." },
      { id: "tynk-zew", name: "Tynk elewacyjny", unit: "m²", basePrice: [85, 140], description: "Aplikacja tynku akrylowego, silikonowego lub mineralnego." },
      { id: "okladziny", name: "Okładziny elewacyjne", unit: "m²", basePrice: [220, 420], description: "Montaż okładzin z klinkieru, kamienia naturalnego lub paneli kompozytowych." },
      { id: "renowacja-elew", name: "Renowacja istniejącej elewacji", unit: "m²", basePrice: [95, 170], description: "Mycie, gruntowanie i odświeżenie powłoki malarskiej." },
    ],
  },
];

type Contractor = {
  name: string;
  city: string;
  years: number;
  rating: number;
  reviews: number;
  termin: string;
  rateMod: number; // multiplier on base price
  note: string;
};

const CONTRACTORS_BY_CATEGORY: Record<string, Contractor[]> = {
  sciany: [
    { name: "Tynki Maszynowe Częstochowa – Tynki Gipsowe", city: "Częstochowa, Grabówka (mobilnie)", years: 12, rating: 4.7, reviews: 88, termin: "rozpoczęcie w ciągu 7–14 dni", rateMod: 0.95, note: "Specjalizacja: maszynowe tynki gipsowe i cementowo-wapienne. Własny agregat tynkarski, dojazd na terenie powiatu częstochowskiego." },
    { name: "Budmix – Usługi Ogólnobudowlane", city: "Częstochowa, Północ / Raków", years: 16, rating: 4.6, reviews: 104, termin: "rozpoczęcie w ciągu 10–14 dni", rateMod: 1.0, note: "Kompleksowe roboty murarsko-tynkarskie, zabudowy GK. Faktura VAT, gwarancja 24 m-ce." },
    { name: "Remonty-Dekor", city: "Częstochowa, Północ / Tysiąclecie", years: 9, rating: 4.5, reviews: 67, termin: "rozpoczęcie w ciągu 14 dni", rateMod: 0.92, note: "Gładzie gipsowe, ścianki działowe GK, drobne prace murarskie. Płatność etapowa." },
  ],
  malowanie: [
    { name: "Stacolor – Malowanie i Wykończenia", city: "Częstochowa, Lisiniec / Stradom", years: 13, rating: 4.7, reviews: 91, termin: "rozpoczęcie w ciągu 5–10 dni", rateMod: 1.0, note: "Malowanie mieszkań i lokali użytkowych, farby premium (Tikkurila, Dulux). Zabezpieczenie podłóg w cenie." },
    { name: "Remonty-Dekor", city: "Częstochowa, Północ", years: 9, rating: 4.5, reviews: 67, termin: "rozpoczęcie w ciągu 14 dni", rateMod: 0.9, note: "Malowanie ścian i sufitów, drobne naprawy gładzi. Konkurencyjna wycena, krótkie terminy." },
    { name: "AZremont Zbigniew Śledź", city: "Częstochowa, Śródmieście (mobilnie)", years: 18, rating: 4.8, reviews: 142, termin: "rozpoczęcie w ciągu 10–14 dni", rateMod: 1.08, note: "Doświadczona ekipa, malowanie dekoracyjne, lakierowanie drewna. Ubezpieczenie OC, faktura VAT." },
  ],
  dachy: [
    { name: "AZremont Zbigniew Śledź", city: "Częstochowa, Śródmieście / okolice", years: 18, rating: 4.8, reviews: 142, termin: "rozpoczęcie w ciągu 14–21 dni", rateMod: 1.05, note: "Pokrycia dachowe, naprawy doraźne, papa termozgrzewalna. Praca na wysokości – pełne ubezpieczenie." },
    { name: "FRE-BUD – Usługi Dekarsko-Budowlane", city: "Częstochowa, Stradom / Raków", years: 15, rating: 4.7, reviews: 118, termin: "rozpoczęcie w ciągu 14 dni", rateMod: 1.0, note: "Krycie dachówką, blachodachówką, obróbki blacharskie. Gwarancja 5 lat na wykonanie." },
    { name: "Polska Grupa Linowa", city: "Częstochowa (mobilnie / region śląski)", years: 11, rating: 4.6, reviews: 74, termin: "rozpoczęcie w ciągu 7–10 dni", rateMod: 1.12, note: "Prace alpinistyczne, naprawy dachów spadzistych bez rusztowań. Szybki dojazd, krótkie terminy." },
  ],
  podlogi: [
    { name: "Remonty-Dekor", city: "Częstochowa, Północ / Tysiąclecie", years: 9, rating: 4.5, reviews: 67, termin: "rozpoczęcie w ciągu 10–14 dni", rateMod: 0.92, note: "Układanie paneli, listew przypodłogowych, drobne wylewki naprawcze." },
    { name: "KABUD Remonty", city: "Częstochowa, Wrzosowiak", years: 14, rating: 4.7, reviews: 102, termin: "rozpoczęcie w ciągu 14 dni", rateMod: 1.0, note: "Wylewki samopoziomujące, parkiet, glazura. Własny sprzęt, faktura VAT." },
    { name: "Syntech – Posadzki i Podłogi", city: "Częstochowa, Grabówka (mobilnie)", years: 10, rating: 4.6, reviews: 81, termin: "rozpoczęcie w ciągu 7–10 dni", rateMod: 1.05, note: "Posadzki przemysłowe i mieszkaniowe, wylewki anhydrytowe. Pomiar wilgotności w cenie." },
  ],
  instalacje: [
    { name: "KABUD Remonty", city: "Częstochowa, Wrzosowiak", years: 14, rating: 4.7, reviews: 102, termin: "rozpoczęcie w ciągu 10–14 dni", rateMod: 1.0, note: "Instalacje wod-kan, c.o., elektryka. Uprawnienia SEP do 1 kV, protokoły pomiarowe." },
    { name: "Remonty-Dekor", city: "Częstochowa, Północ", years: 9, rating: 4.5, reviews: 67, termin: "rozpoczęcie w ciągu 14 dni", rateMod: 0.9, note: "Punkty elektryczne, drobne instalacje hydrauliczne. Konkurencyjna wycena." },
    { name: "FRE-BUD – Usługi Dekarsko-Budowlane", city: "Częstochowa, Stradom / Raków", years: 15, rating: 4.7, reviews: 118, termin: "rozpoczęcie w ciągu 14 dni", rateMod: 1.05, note: "Instalacje wewnętrzne kompleksowo, montaż grzejników, klimatyzacja split." },
  ],
  lazienki: [
    { name: "KABUD Remonty", city: "Częstochowa, Wrzosowiak", years: 14, rating: 4.7, reviews: 102, termin: "rozpoczęcie w ciągu 14–21 dni", rateMod: 1.0, note: "Kompleksowe remonty łazienek i kuchni „pod klucz”. Koordynacja wszystkich branż." },
    { name: "Syntech – Wykończenia Wnętrz", city: "Częstochowa, Grabówka / Północ", years: 10, rating: 4.6, reviews: 81, termin: "rozpoczęcie w ciągu 14 dni", rateMod: 1.05, note: "Glazura, terakota, fugowanie epoksydowe. Doświadczenie w łazienkach o nietypowych kształtach." },
    { name: "Remonty-Dekor", city: "Częstochowa, Północ", years: 9, rating: 4.5, reviews: 67, termin: "rozpoczęcie w ciągu 14 dni", rateMod: 0.92, note: "Remonty łazienek w mieszkaniach blokowych, montaż armatury, drobne zabudowy GK." },
  ],
  elewacje: [
    { name: "Stacolor – Elewacje i Ocieplenia", city: "Częstochowa, Lisiniec / Stradom", years: 13, rating: 4.7, reviews: 91, termin: "rozpoczęcie w ciągu 14–21 dni", rateMod: 1.0, note: "Ocieplenia ETICS, tynki silikonowe i silikatowe. Doradztwo w doborze systemu, faktura VAT." },
    { name: "FRE-BUD – Usługi Dekarsko-Budowlane", city: "Częstochowa, Raków / Stradom", years: 15, rating: 4.7, reviews: 118, termin: "rozpoczęcie w ciągu 14 dni", rateMod: 1.05, note: "Elewacje budynków jedno- i wielorodzinnych. Własne rusztowania, gwarancja 5 lat." },
    { name: "AZremont Zbigniew Śledź", city: "Częstochowa, Śródmieście (mobilnie)", years: 18, rating: 4.8, reviews: 142, termin: "rozpoczęcie w ciągu 21 dni", rateMod: 1.1, note: "Renowacje elewacji, malowanie, drobne naprawy tynków zewnętrznych. Ubezpieczenie OC." },
  ],
};

const CITIES: string[] = [
  "Warszawa", "Kraków", "Łódź", "Wrocław", "Poznań", "Gdańsk", "Szczecin", "Bydgoszcz",
  "Lublin", "Białystok", "Katowice", "Gdynia", "Częstochowa", "Radom", "Sosnowiec",
  "Toruń", "Kielce", "Rzeszów", "Gliwice", "Zabrze", "Olsztyn", "Bielsko-Biała",
  "Bytom", "Zielona Góra", "Rybnik", "Ruda Śląska", "Tychy", "Opole", "Gorzów Wielkopolski",
  "Dąbrowa Górnicza", "Płock", "Elbląg", "Wałbrzych", "Włocławek", "Tarnów", "Chorzów",
  "Koszalin", "Kalisz", "Legnica", "Grudziądz", "Jaworzno", "Słupsk", "Jastrzębie-Zdrój",
  "Nowy Sącz", "Jelenia Góra", "Siedlce", "Mysłowice", "Konin", "Piotrków Trybunalski",
  "Lubin", "Inowrocław", "Ostrowiec Świętokrzyski", "Suwałki", "Stargard", "Gniezno",
  "Ostrów Wielkopolski", "Siemianowice Śląskie", "Głogów", "Pabianice", "Leszno",
  "Żory", "Zamość", "Pruszków", "Łomża", "Ełk", "Tarnowskie Góry", "Chełm", "Tomaszów Mazowiecki",
  "Przemyśl", "Stalowa Wola", "Kędzierzyn-Koźle", "Mielec", "Piła", "Biała Podlaska",
  "Legionowo", "Świdnica", "Bełchatów", "Skierniewice", "Świnoujście", "Zgierz", "Wejherowo",
  "Rumia", "Tczew", "Otwock", "Sopot", "Krosno", "Starachowice", "Nysa", "Racibórz",
  "Radomsko", "Skarżysko-Kamienna", "Pruszcz Gdański", "Puławy", "Ostrołęka", "Lubliniec",
  "Kołobrzeg", "Kutno", "Mińsk Mazowiecki", "Sieradz", "Tarnobrzeg", "Bolesławiec", "Sanok",
];

type View =
  | { kind: "home" }
  | { kind: "category"; categoryId: string }
  | { kind: "service"; categoryId: string; serviceId: string }
  | { kind: "loading"; categoryId: string; serviceId: string; quantity: number }
  | { kind: "results"; categoryId: string; serviceId: string; quantity: number };

function Index() {
  const [view, setView] = useState<View>({ kind: "home" });
  const [quantityInput, setQuantityInput] = useState("");
  const [city, setCity] = useState<string>("Warszawa");

  const currentCategory = useMemo(
    () => ("categoryId" in view ? CATEGORIES.find((c) => c.id === view.categoryId) : undefined),
    [view],
  );
  const currentService = useMemo(
    () =>
      currentCategory && "serviceId" in view
        ? currentCategory.services.find((s) => s.id === view.serviceId)
        : undefined,
    [view, currentCategory],
  );

  const goHome = () => setView({ kind: "home" });
  const openCategory = (id: string) => setView({ kind: "category", categoryId: id });
  const openService = (categoryId: string, serviceId: string) => {
    setQuantityInput("");
    setView({ kind: "service", categoryId, serviceId });
  };

  const submitQuantity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentService) return;
    const qty = parseFloat(quantityInput.replace(",", "."));
    if (isNaN(qty) || qty <= 0) return;
    setView({ kind: "loading", categoryId: currentCategory!.id, serviceId: currentService.id, quantity: qty });
    window.setTimeout(() => {
      setView({ kind: "results", categoryId: currentCategory!.id, serviceId: currentService.id, quantity: qty });
    }, 1600);
  };

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Inter', system-ui, -apple-system, Segoe UI, sans-serif" }}>
      {/* Top utility bar */}
      <div className="bg-[#475569] text-white text-[11px]">
        <div className="max-w-[1100px] mx-auto px-4 py-1.5 flex flex-wrap justify-between gap-2">
          <span>Działamy od 2009 roku &nbsp;•&nbsp; Ponad 12 000 zrealizowanych wycen &nbsp;•&nbsp; Bezpłatna usługa dla zleceniodawców</span>
          <span>
            <a href="#" className="hover:underline">Dla wykonawców</a> &nbsp;|&nbsp;
            <a href="#" className="hover:underline">Zaloguj się</a> &nbsp;|&nbsp;
            <a href="#" className="hover:underline">Pomoc</a>
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b-2 border-[#475569]">
        <div className="max-w-[1100px] mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={goHome} className="flex items-center gap-3 text-left">
            <div className="w-12 h-12 bg-[#475569] text-white flex items-center justify-center font-bold text-xl border border-[#334155] rounded-md">
              R<span className="text-[#fb923c]">v</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#475569] leading-none" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                Remi<span className="text-[#ea580c]">vo</span>
              </div>
              <div className="text-[11px] text-gray-600 mt-1 uppercase tracking-wide">
                Porównywarka ofert remontowych i budowlanych
              </div>
            </div>
          </button>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-[11px] text-gray-700">
              <label htmlFor="city-select" className="font-semibold text-[#475569] uppercase tracking-wide">Twoje miasto</label>
              <select
                id="city-select"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-1 border border-slate-300 rounded-md px-2 py-1.5 text-[13px] bg-white focus:outline-none focus:border-[#475569] min-w-[160px]"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="hidden md:block text-right text-xs text-gray-700">
              <div>Infolinia (pn–pt 8:00–17:00):</div>
              <div className="text-lg font-bold text-[#475569]">22 350 41 28</div>
            </div>
          </div>
        </div>

        {/* Mobile city selector */}
        <div className="sm:hidden border-t border-gray-200 px-4 py-2 flex items-center gap-2 bg-[#f8fafc]">
          <label htmlFor="city-select-mobile" className="text-[11px] font-semibold text-[#475569] uppercase">Miasto:</label>
          <select
            id="city-select-mobile"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex-1 border border-slate-300 rounded-md px-2 py-1.5 text-[13px] bg-white focus:outline-none focus:border-[#475569]"
          >
            {CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Nav */}
        <nav className="bg-[#f1f5f9] border-t border-b border-gray-300">
          <div className="max-w-[1100px] mx-auto px-2 flex flex-wrap text-[13px]">
            <button
              onClick={goHome}
              className={`px-4 py-2 border-r border-gray-300 hover:bg-white ${view.kind === "home" ? "bg-white font-semibold text-[#475569]" : ""}`}
            >
              Strona Główna
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => openCategory(cat.id)}
                className={`px-4 py-2 border-r border-gray-300 hover:bg-white ${
                  "categoryId" in view && view.categoryId === cat.id ? "bg-white font-semibold text-[#475569]" : ""
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* Full-width hero on Home */}
      {view.kind === "home" && (
        <div className="bg-white border-b border-slate-200 text-slate-900">
          <div className="max-w-[1100px] mx-auto px-4 py-8">
            <div className="text-[11px] uppercase tracking-wider text-slate-500 mb-2">
              Witamy w serwisie Remivo{city ? " – " + city : ""}
            </div>
            <div className="text-[12px] uppercase tracking-wider text-slate-500 mb-3">
              Porównywarka ofert remontowych
            </div>
            <h1 className="text-[26px] sm:text-[32px] font-bold leading-tight mb-3 text-slate-900" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
              Znajdź sprawdzoną firmę remontową w mieście {city}
            </h1>
            <p className="text-[14px] text-slate-700 mb-4 max-w-[780px]">
              Remivo to bezpłatny serwis, który łączy zleceniodawców z zaufanymi wykonawcami. W kilka chwil otrzymasz
              szczegółowe wyceny od kilku firm działających w Twojej okolicy – bez podpisywania umów i bez zobowiązań.
            </p>
            <div className="flex flex-wrap gap-2 text-[12px] mb-6 text-slate-700">
              <span className="bg-orange-50 border border-orange-200 px-2 py-1 rounded-md"><span className="text-[#ea580c]">✓</span> Bezpłatnie</span>
              <span className="bg-orange-50 border border-orange-200 px-2 py-1 rounded-md"><span className="text-[#ea580c]">✓</span> Bez zobowiązań</span>
              <span className="bg-orange-50 border border-orange-200 px-2 py-1 rounded-md"><span className="text-[#ea580c]">✓</span> Tylko zweryfikowane firmy</span>
              <span className="bg-orange-50 border border-orange-200 px-2 py-1 rounded-md"><span className="text-[#ea580c]">✓</span> Działamy od 2009 roku</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                <div className="text-[20px] sm:text-[22px] font-bold text-slate-800">12 000+</div>
                <div className="text-[11px] text-slate-500 uppercase tracking-wide">wycen</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                <div className="text-[20px] sm:text-[22px] font-bold text-slate-800">3 400+</div>
                <div className="text-[11px] text-slate-500 uppercase tracking-wide">wykonawców</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                <div className="text-[20px] sm:text-[22px] font-bold text-slate-800">4,7 / 5</div>
                <div className="text-[11px] text-slate-500 uppercase tracking-wide">średnia ocen</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumbs */}
      <div className="max-w-[1100px] mx-auto px-4 py-2 text-xs text-gray-600">
        <button onClick={goHome} className="text-[#475569] hover:underline">Remivo</button>
        {currentCategory && (
          <>
            <span className="mx-1">›</span>
            <button onClick={() => openCategory(currentCategory.id)} className="text-[#475569] hover:underline">
              {currentCategory.name}
            </button>
          </>
        )}
        {currentService && (
          <>
            <span className="mx-1">›</span>
            <span>{currentService.name}</span>
          </>
        )}
        {!currentCategory && <><span className="mx-1">›</span><span>Strona Główna</span></>}
      </div>

      {/* Main layout */}
      <main className="max-w-[1100px] mx-auto px-4 pb-10 grid md:grid-cols-[220px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="text-[13px]">
          <div className="border border-slate-200 bg-white rounded-lg">
            <div className="bg-[#475569] text-white px-3 py-2 font-semibold text-[12px] uppercase tracking-wide">
              Kategorie usług
            </div>
            <ul>
              {CATEGORIES.map((cat) => (
                <li key={cat.id} className="border-t border-gray-200 first:border-t-0">
                  <button
                    onClick={() => openCategory(cat.id)}
                    className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${
                      "categoryId" in view && view.categoryId === cat.id ? "bg-gray-100 font-semibold text-[#475569]" : ""
                    }`}
                  >
                    » {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-slate-200 bg-white rounded-lg mt-4 p-3 text-[12px] leading-relaxed">
            <div className="font-semibold text-[#475569] mb-1">ℹ Jak to działa?</div>
            Wybierz kategorię i rodzaj pracy, podaj metraż lub opis, a nasz system w ciągu chwili wyświetli oferty sprawdzonych firm remontowych z Twojego regionu.
          </div>

          <div className="border border-slate-200 bg-white rounded-lg mt-4">
            <div className="bg-gray-200 px-3 py-2 font-semibold text-[12px] uppercase">Popularne dziś</div>
            <ul className="text-[12px]">
              <li className="border-t border-gray-200 px-3 py-1.5">› Nakładanie papy termozgrzewalnej</li>
              <li className="border-t border-gray-200 px-3 py-1.5">› Malowanie ścian – lokal</li>
              <li className="border-t border-gray-200 px-3 py-1.5">› Układanie paneli podłogowych</li>
              <li className="border-t border-gray-200 px-3 py-1.5">› Glazura i terakota</li>
            </ul>
          </div>
        </aside>

        {/* Content */}
        <section className="text-[14px] leading-relaxed">
          {view.kind === "home" && <HomeContent onPick={openCategory} city={city} />}
          {view.kind === "category" && currentCategory && (
            <CategoryContent category={currentCategory} onPick={(sid) => openService(currentCategory.id, sid)} />
          )}
          {view.kind === "service" && currentCategory && currentService && (
            <ServiceForm
              category={currentCategory}
              service={currentService}
              quantity={quantityInput}
              setQuantity={setQuantityInput}
              onSubmit={submitQuantity}
            />
          )}
          {view.kind === "loading" && <LoadingPanel />}
          {view.kind === "results" && currentCategory && currentService && (
            <Results
              category={currentCategory}
              service={currentService}
              quantity={view.quantity}
              onBack={() => openService(currentCategory.id, currentService.id)}
            />
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-[#475569] bg-[#f1f5f9] text-[12px] text-gray-700">
        <div className="max-w-[1100px] mx-auto px-4 py-6 grid md:grid-cols-3 gap-6">
          <div>
            <div className="font-bold text-[#475569] mb-2">Remivo sp. z o.o.</div>
            <p>Bezpłatny serwis porównywania ofert remontowych i budowlanych. Działamy na terenie całej Polski od 2009 roku. KRS: 0000345678 • NIP: 521-345-67-89</p>
            <p className="mt-2">ul. Prosta 44, 00-838 Warszawa</p>
          </div>
          <div>
            <div className="font-bold text-[#475569] mb-2">Informacje</div>
            <ul className="space-y-1">
              <li><a href="#" className="text-[#475569] hover:underline">O serwisie</a></li>
              <li><a href="#" className="text-[#475569] hover:underline">Dla wykonawców</a></li>
              <li><a href="#" className="text-[#475569] hover:underline">Regulamin</a></li>
              <li><a href="#" className="text-[#475569] hover:underline">Polityka prywatności</a></li>
              <li><a href="#" className="text-[#475569] hover:underline">Kontakt</a></li>
            </ul>
          </div>
          <div>
            <div className="font-bold text-[#475569] mb-2">Kategorie</div>
            <ul className="space-y-1">
              {CATEGORIES.slice(0, 5).map((c) => (
                <li key={c.id}>
                  <button onClick={() => openCategory(c.id)} className="text-[#475569] hover:underline">
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-300 py-3 text-center text-[11px] text-gray-600">
          © 2009–2026 Remivo sp. z o.o. Wszelkie prawa zastrzeżone. Serwis ma charakter informacyjny. Prezentowane oferty nie stanowią oferty w rozumieniu Kodeksu cywilnego.
        </div>
      </footer>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <h1 className="text-[20px] font-bold text-[#475569] border-b-2 border-[#475569] pb-1 mb-4" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {title}
    </h1>
  );
}

function HomeContent({ onPick, city }: { onPick: (id: string) => void; city: string }) {
  return (
    <div>
      {/* CTA to pick a category */}
      <div className="border border-slate-200 bg-white rounded-lg p-4 text-[13px] text-gray-800">
        <div className="font-semibold text-[#475569] mb-2">Aby rozpocząć – wybierz kategorię prac</div>
        <p className="mb-3">
          Skorzystaj z menu powyżej lub z listy kategorii po lewej stronie (np. <em>Ściany i Tynki</em>, <em>Malowanie</em>, <em>Dachy</em>),
          a następnie wskaż konkretny rodzaj robót i podaj zakres. W kilka sekund otrzymasz oferty wykonawców z miasta {city}.
        </p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onPick(cat.id)}
              className="bg-white border border-slate-300 hover:border-[#475569] hover:text-[#475569] rounded-md px-3 py-1.5 text-[12px] font-semibold"
            >
              » {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function CategoryContent({ category, onPick }: { category: Category; onPick: (sid: string) => void }) {
  return (
    <div>
      <SectionHeader title={category.name} />
      <p className="mb-4 text-gray-700">{category.intro}</p>
      <div className="bg-[#f1f5f9] border border-slate-200 rounded-md px-3 py-2 mb-4 text-[13px]">
        Proszę wybrać rodzaj prac z poniższej listy. Po wyborze usługi należy podać szacunkowy zakres robót (np. powierzchnię w m²).
      </div>
      <table className="w-full text-[13px] border-collapse border border-slate-200 bg-white rounded-lg">
        <thead>
          <tr className="bg-[#475569] text-white">
            <th className="text-left px-3 py-2 border border-[#475569]">Rodzaj prac</th>
            <th className="text-left px-3 py-2 border border-[#475569] hidden sm:table-cell">Opis</th>
            <th className="text-left px-3 py-2 border border-[#475569]">Jedn.</th>
            <th className="px-3 py-2 border border-[#475569]"></th>
          </tr>
        </thead>
        <tbody>
          {category.services.map((s, i) => (
            <tr key={s.id} className={i % 2 === 0 ? "bg-white" : "bg-[#f8fafc]"}>
              <td className="px-3 py-2 border border-gray-300 font-semibold text-[#475569] align-top">{s.name}</td>
              <td className="px-3 py-2 border border-gray-300 text-gray-700 align-top hidden sm:table-cell">{s.description}</td>
              <td className="px-3 py-2 border border-gray-300 align-top">{s.unit}</td>
              <td className="px-3 py-2 border border-gray-300 align-top">
                <button
                  onClick={() => onPick(s.id)}
                  className="bg-[#64748b] hover:bg-[#475569] text-white text-[12px] font-semibold px-3 py-1.5 border border-[#334155] whitespace-nowrap"
                >
                  Wyceń ▸
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ServiceForm({
  category,
  service,
  quantity,
  setQuantity,
  onSubmit,
}: {
  category: Category;
  service: Service;
  quantity: string;
  setQuantity: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <div>
      <SectionHeader title={service.name} />
      <div className="text-[12px] text-gray-600 mb-3">Kategoria: {category.name}</div>
      <p className="mb-4 text-gray-800">{service.description}</p>

      <form onSubmit={onSubmit} className="border border-slate-200 bg-slate-50 rounded-lg p-4">
        <div className="font-semibold text-[#475569] mb-3 text-[15px]">Formularz wyceny</div>
        <div className="text-[13px] text-gray-700 mb-3">
          Proszę wprowadzić szacowany zakres robót w jednostkach: <strong>{service.unit}</strong>. Na tej podstawie system wyświetli oferty wykonawców działających w Państwa regionie.
        </div>
        <label className="block text-[13px] font-semibold text-[#475569] mb-1">
          Zakres robót ({service.unit}):
        </label>
        <div className="flex gap-2 items-center mb-4">
          <input
            type="text"
            inputMode="decimal"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder={`np. ${service.unit === "szt." ? "3" : "85"}`}
            className="border border-slate-300 rounded-md px-3 py-2 text-[14px] w-48 bg-white focus:outline-none focus:border-[#475569]"
            autoFocus
            required
          />
          <span className="text-[13px] text-gray-700">{service.unit}</span>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-[#475569] hover:bg-[#334155] text-white font-semibold px-5 py-2 text-[13px] border border-[#334155]"
          >
            Zatwierdź i pobierz oferty »
          </button>
        </div>
        <div className="text-[11px] text-gray-600 mt-3">
          * Usługa porównania ofert jest całkowicie bezpłatna i niezobowiązująca.
        </div>
      </form>
    </div>
  );
}

function LoadingPanel() {
  return (
    <div>
      <SectionHeader title="Wyszukiwanie wykonawców..." />
      <div className="border border-slate-200 bg-white rounded-lg p-8 text-center">
        <div className="inline-block w-10 h-10 border-4 border-[#475569] border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-[14px] text-gray-700">Trwa analiza dostępnych ofert w bazie wykonawców...</div>
        <div className="text-[12px] text-gray-500 mt-2">Sprawdzanie cen materiałów i terminów realizacji</div>
      </div>
    </div>
  );
}

function Results({
  category,
  service,
  quantity,
  onBack,
}: {
  category: Category;
  service: Service;
  quantity: number;
  onBack: () => void;
}) {
  // Pick contractors based on category, deterministic count from quantity
  const pool = CONTRACTORS_BY_CATEGORY[category.id] ?? [];
  const count = Math.min(pool.length, Math.max(1, ((Math.floor(quantity * 7) % pool.length) + 1)));
  const offers = pool.slice(0, count).map((c) => {
    const [lo, hi] = service.basePrice;
    const mid = (lo + hi) / 2;
    // ceny podniesione o 30% w stosunku do bazy – tylko robocizna
    const unitPrice = Math.round(mid * c.rateMod * 1.3);
    const total = Math.round(unitPrice * quantity);
    return { c, unitPrice, total };
  });

  return (
    <div>
      <SectionHeader title="Wyniki wyceny" />
      <div className="border border-slate-200 bg-slate-50 rounded-lg p-3 mb-4 text-[13px]">
        <div><strong>Usługa:</strong> {service.name}</div>
        <div><strong>Kategoria:</strong> {category.name}</div>
        <div><strong>Zakres:</strong> {quantity.toLocaleString("pl-PL")} {service.unit}</div>
        <div className="mt-2">
          <button onClick={onBack} className="text-[#475569] hover:underline text-[12px]">« zmień zakres robót</button>
        </div>
      </div>

      <div className="border-l-4 border-[#ea580c] bg-orange-50 px-3 py-2 mb-4 text-[12px] text-slate-800 rounded-r-md">
        <strong className="text-[#c2410c]">Uwaga:</strong> wszystkie poniższe ceny obejmują wyłącznie <strong>robociznę</strong>.
        Koszt materiałów budowlanych (np. tynk, farba, panele, glazura, papa itp.) nie jest wliczony i pokrywa go inwestor osobno –
        zgodnie z faktycznym zużyciem oraz wybranym standardem materiału.
      </div>

      <p className="mb-4 text-[13px] text-gray-700">
        Znaleziono <strong>{offers.length}</strong> {offers.length === 1 ? "ofertę" : offers.length < 5 ? "oferty" : "ofert"} od sprawdzonych wykonawców z miasta Częstochowa. Oferty posortowane według rekomendacji systemu.
      </p>

      <div className="space-y-3">
        {offers.map(({ c, unitPrice, total }, i) => (
          <div key={c.name} className="border border-slate-200 bg-white rounded-lg overflow-hidden">
            <div className="bg-[#f1f5f9] border-b border-gray-300 px-3 py-2 flex justify-between items-center">
              <div className="font-semibold text-[#475569] text-[14px]">
                <span className="text-[#ea580c]">#{i + 1}</span> &nbsp; {c.name}
              </div>
              <div className="text-[12px] text-gray-700">
                ★ {c.rating.toFixed(1)} ({c.reviews} opinii)
              </div>
            </div>
            <div className="grid md:grid-cols-[1fr_240px]">
              <div className="p-3 text-[13px]">
                <div className="text-gray-700 mb-2">{c.note}</div>
                <table className="text-[12px] w-full">
                  <tbody>
                    <tr><td className="text-gray-600 py-0.5 pr-3">Lokalizacja:</td><td>{c.city}</td></tr>
                    <tr><td className="text-gray-600 py-0.5 pr-3">Doświadczenie:</td><td>{c.years} lat na rynku</td></tr>
                    <tr><td className="text-gray-600 py-0.5 pr-3">Termin:</td><td>{c.termin}</td></tr>
                    <tr><td className="text-gray-600 py-0.5 pr-3">Cena robocizny:</td><td>{unitPrice.toLocaleString("pl-PL")} zł / {service.unit}</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="bg-[#f8fafc] border-l border-gray-300 p-3 text-center flex flex-col justify-center">
                <div className="text-[11px] text-gray-700 uppercase tracking-wide">Wycena robocizny</div>
                <div className="text-[22px] font-bold text-[#475569] my-1" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                  {total.toLocaleString("pl-PL")} zł <span className="text-[14px] text-[#ea580c] font-semibold">+ materiały</span>
                </div>
                <div className="text-[10px] text-gray-600 leading-tight mb-2">
                  Cena dotyczy <strong>tylko robocizny</strong>.<br/>
                  Koszt materiałów po stronie inwestora.
                </div>
                <button className="bg-[#475569] hover:bg-[#ea580c] transition-colors text-white text-[12px] font-semibold px-3 py-2 border border-[#334155] rounded-md">
                  Skontaktuj się ▸
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-[11px] text-gray-600 mt-4 border-t border-gray-300 pt-3">
        Powyższe wyceny mają charakter szacunkowy i obejmują wyłącznie koszt robocizny – materiały budowlane nie są wliczone i są zamawiane osobno przez inwestora. Ostateczna cena zostanie ustalona po wizji lokalnej i przedstawieniu kosztorysu przez wykonawcę.
      </div>
    </div>
  );
}
