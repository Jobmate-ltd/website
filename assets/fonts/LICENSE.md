# Font licences

Every file in this folder is licensed under the SIL Open Font License, Version 1.1
(https://openfontlicense.org). The site serves them itself through `next/font/local`;
no request for a font leaves the visitor's browser, and no build depends on
Google Fonts being reachable.

| File | Family | Use | Copyright |
| --- | --- | --- | --- |
| `manrope-variable-latin.woff2` | Manrope, variable weight 200–800, latin subset | Every word on the site (`--font-manrope`) | © 2018 The Manrope Project Authors (https://github.com/sharanda/manrope) |
| `jetbrains-mono-variable-latin.woff2` | JetBrains Mono, variable weight 100–800, subset to printable ASCII plus `£ § ° · × – — ‘ ’ “ ” … € ± ÷ ¼ ½ ¾ © ® ™ → ← •` and no-break space (33 KB instead of 40 KB) | Report numbers, dates, prices in tables, regulation references (`--font-jetbrains-mono`) | © 2020 The JetBrains Mono Project Authors (https://github.com/JetBrains/JetBrainsMono) |
| `manrope-800.ttf`, `manrope-500.ttf` | Manrope static instances | Open Graph images rendered with `next/og` (Satori needs static TTF instances) | as above |
| `jetbrains-mono-500.ttf` | JetBrains Mono static instance | Open Graph images | as above |

The Manrope woff2 is the `latin` subset Google Fonts serves for the family
(U+0000–00FF, U+0131, U+0152–0153, U+02BB–02BC, U+02C6, U+02DA, U+02DC,
U+0304, U+0308, U+0329, U+2000–206F, U+20AC, U+2074, U+2122, U+2191, U+2193,
U+2212, U+2215, U+FEFF, U+FFFD). The JetBrains Mono woff2 was cut from that
same latin subset with `subset-font` (HarfBuzz) to the characters listed in
the table, because the site only ever sets numbers, dates, prices and
regulation references in it. Characters outside those ranges fall back to
the system stack declared in `app/globals.css`.

The OFL permits use, bundling, modification and redistribution provided the
fonts are not sold by themselves and any derivative is not released under the
Reserved Font Names. Nothing here modifies the fonts.
