// Gera as páginas legais do site a partir de legal-content.ts (cópia do app NOXA).
// Uso: node tools/build-legal.mjs   (Node 22.6+ com --experimental-strip-types, ou Node 23.6+)
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  buildLegalDocument,
  parseLegalInline,
  legalFooterLine,
  LEGAL_ENTITY,
} from "./legal-content.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const APP = { name: "NOXA", url: "https://miraeai.com.br" };

const ROUTES = {
  privacy: "/privacy",
  terms: "/terms",
  "child-safety": "/child-safety",
  "delete-account": "/delete-account",
  credits: "/credits",
};

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const inline = (text) =>
  parseLegalInline(text)
    .map((part) => {
      if (part.kind === "strong") return `<strong>${esc(part.text)}</strong>`;
      if (part.kind === "link") return `<a href="${ROUTES[part.doc]}">${esc(part.text)}</a>`;
      return esc(part.text);
    })
    .join("");

const block = (b) => {
  if (b.kind === "p") return `    <p>${inline(b.text)}</p>`;
  const items = b.items
    .map((item) => {
      const kids = item.children?.length
        ? `<ul>${item.children.map((c) => `<li>${inline(c)}</li>`).join("")}</ul>`
        : "";
      return `      <li>${inline(item.text)}${kids}</li>`;
    })
    .join("\n");
  return `    <ul>\n${items}\n    </ul>`;
};

const page = (doc) => `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(doc.title)} — Mirae</title>
  <meta name="description" content="${esc(doc.title)} do NOXA, oferecido pela ${esc(LEGAL_ENTITY.entity)}.">
  <link rel="icon" type="image/png" href="/logo.png">
  <link rel="canonical" href="${APP.url}${ROUTES[doc.id]}">
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <header class="top">
    <div class="wrap">
      <a class="brand" href="/"><img src="/logo.png" alt="Mirae"><span>Mirae</span></a>
      <nav><a href="/">Início</a></nav>
    </div>
  </header>
  <main class="wrap doc">
    <h1>${esc(doc.title)}</h1>
    <p class="date">Última atualização: ${esc(doc.updatedAt)}</p>
${doc.sections
  .map((s) => `    <h2>${esc(s.title)}</h2>\n${s.blocks.map(block).join("\n")}`)
  .join("\n\n")}
  </main>
  <footer>
    <div class="wrap">
      <span>${esc(legalFooterLine())}</span>
      <span><a href="/privacy">Privacidade</a><a href="/terms">Termos</a><a href="/child-safety">Segurança infantil</a><a href="/delete-account">Exclusão de conta</a><a href="/credits">Créditos do mapa</a></span>
    </div>
  </footer>
</body>
</html>
`;

for (const id of Object.keys(ROUTES)) {
  const doc = buildLegalDocument(id, APP);
  writeFileSync(join(root, `${id}.html`), page(doc), "utf8");
  console.log(`ok ${id}.html (${doc.sections.length} seções)`);
}
