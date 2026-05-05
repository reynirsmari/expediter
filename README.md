# Expediter Counter

Talningar-app fyrir expediter á veitingahúsum. Virkar fullkomlega offline.

## Möppu-innihald

- `index.html` — Aðalskráin (inniheldur appkóðann inline)
- `react.min.js`, `react-dom.min.js` — React 18
- `babel.min.js` — Þýðir JSX í vafranum

**Allar þrjár JS skrárnar þurfa að vera í sömu möppu og `index.html`.**

## Uppsetning á spjaldtölvu

### iPad (Safari)
1. Afritaðu alla möppuna `expediter-app` í Files appið (t.d. iCloud Drive eða On My iPad).
2. Opnaðu `index.html` í Files → opnast í Safari.
3. (Valfrjálst) Til að fá það á heimaskjáinn: Share → Add to Home Screen.

### Android (Chrome)
1. Afritaðu möppuna á tækið.
2. Opnaðu `index.html` í file manager → "Open with Chrome".
3. (Valfrjálst) Chrome menu → Add to Home screen.

### Tölva (test/preview)
Tvíklikkaðu á `index.html`. Opnast í default vafra.

## Hvernig appið vistar

Allar talningar vistast í `localStorage` vafrans. Það þýðir:

- Ef glugginn lokast óvart → opnaðu aftur og þú færð staðfestingar-glugga: "Halda áfram" eða "Byrja upp á nýtt"
- Ef spjaldtölvan endurræsist → talningar haldast
- Ef þú færir HTML skrána í aðra möppu → talningar tapast (vafrinn telur það nýja síðu)
- Ef þú þurkar út vafragögn → talningar tapast

**Mikilvægt:** Notaðu alltaf sömu möppuna. Ekki færa skrárnar.

## Auka eiginleikar

- **Wake lock**: appið hindrar að spjaldtölvan fari í svefn meðan það er opið (virkar í Chrome og Safari á iOS 16.4+).
- **No zoom**: pinch-zoom og double-tap zoom eru aftengd svo þú zoom-ar ekki óvart.
- **Sjálfvirk vistun**: hver einasta breyting (kall, sent, +N) vistast strax.

## Fyrsta keyrslan

Þegar þú opnar appið í fyrsta sinn er hægt að:

1. Stilla nafn efst (t.d. "RON SERVICE COUNTER")
2. Smella á tannhjóls-takkann → stilla heildarfjölda gesta (sjálfgefið 110) eða velja "Opin talning" án þaks
3. Byrja að taka inn miða

## Workflow

1. **Stage 1 — Miðar inn**: Þjónn kemur með pöntun. Þú smellir +1 til +8 (eða +N fyrir custom tölu). Hver smellur býr til nýtt batch.
2. **Stage 2 — Kalla**: Hver óköllaða batch hefur sinn eigin "Kalla N" takka. Þegar pöntun á að fara í eldhús, smellir þú á þann takka. Tími síðan síðasta kall birtist í toppnum á kortinu.
3. **Stage 3 — Sent**: Þegar diskar fara út úr eldhúsi, smellir þú á +N (eða "Allt").

Bæði stage 2 og 3 hafa "↶ Bakka" takka neðst ef þú smellir óvart.

## Vandamál?

- **Hvít síða**: Bíddu 1-2 sek. eftir að Babel þýði JSX. Ef ekki, opnaðu vafra-konsólann.
- **Talningar hverfa**: Tókstu eftir að það birtist resume-modal? Ef þú smelltir á "Byrja upp á nýtt", þá er það fyrir.
- **Babel hættir að virka**: Athugaðu að allar 3 JS skrárnar séu í sömu möppu og index.html.
