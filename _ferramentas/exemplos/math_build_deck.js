// Isabel · Math · 3rd term · AF 18/11/2026 · "Legend Masters" (Unit 8 Exploring Fractions, Unit 6 Measurement: calendar, temperature, money)
// Criaturas lendárias e mestres originais (tema inspirado em duelos de criaturas, sem nada de franquia).
const pptxgen = require("pptxgenjs");
const path = require("path");
const fs = require("fs");
const { createKit } = require("/root/.claude/skills/synced/4313f5f2-cc84-4f81-a587-e6ecaf4a4f77_cdb4d5e3-a99c-4930-a7ac-a85dead45fa1/escola-isabel/scripts/kit.js");

const ASSETS = path.resolve(process.argv[2] || "assets");
const OUT = path.resolve(process.argv[3] || "Isabel_Math_3Tri_v1.pptx");
const OUT_CARDS = path.resolve(process.argv[4] || "Cartas_Math_3Tri_v1.pptx");
const FIELDS_OUT = path.resolve(process.argv[5] || "campos.json");
const TOTAL = 7;
const CUR = { icon: "gem", en: "crystals", pt: "cristais" };
const FOOT = "Legend Masters · Math · Year 3";

const pres = new pptxgen();
const K = createKit(pres, { assetsDir: ASSETS, footerText: FOOT, totalMissions: TOTAL, title: "Legend Masters", lang: "en", currency: CUR });
const { W, H, C, MC, FT, FB } = K;
const NIGHT = "2B2350", GOLDLT = "FFF3C4";

const LEG = [["partiko", "Master Aria", "Partiko", "equal parts"], ["numerra", "Master Theo", "Numerra", "naming fractions"], ["ribbonix", "Master Lia", "Ribbonix", "fractions of a length"],
  ["gemmora", "Master Rubi", "Gemmora", "fractions of a set"], ["calendrix", "Master Dias", "Calendrix", "the calendar"], ["thermion", "Master Neve", "Thermion", "temperature"], ["moedon", "Master Cofre", "Moedon", "money"]];

const FIELDS = [];
function box(s, x, y, d = 0.36, color = C.amber, meta = {}) { K.checkbox(s, x, y, d, color); FIELDS.push({ p: s._num, t: "cb", x, y, w: d, h: d, ...meta }); }
function tfield(s, x, y, w, h, color = C.amber) { K.writeBox(s, x, y, w, h, color); FIELDS.push({ p: s._num, t: "tx", x, y, w, h }); }
function txt(s, text, x, y, w, h, o = {}) {
  s.addText(text, { x, y, w, h, fontFace: o.face || FB, fontSize: o.fs || 15, bold: !!o.bold, italic: !!o.italic, color: o.color || C.ink,
    align: o.align || "left", valign: o.valign || "middle", margin: 0, fit: o.fit, paraSpaceAfter: o.psa });
}
function heading(s, text, x, y, w, color, fs = 16) { txt(s, text, x, y, w, 0.42, { face: FT, fs, bold: true, color }); }
function rich(s, runs, x, y, w, h, fs = 15, o = {}) {
  s.addText(runs.map((r) => (typeof r === "string" ? { text: r, options: {} } : r)), { x, y, w, h, fontFace: FB, fontSize: fs, color: C.ink, valign: o.valign || "top", margin: 0, align: o.align || "left", paraSpaceAfter: o.psa });
}
const B = (t, color) => ({ text: t, options: { bold: true, color } });
const BR = (t, o = {}) => ({ text: t, options: { breakLine: true, ...o } });
function talk(s, kind, text, guide, fs = 16, h = 0.75) {
  K.bubble(s, [...K.act(kind), { text, options: {} }], 0.6, 1.5, 8.9, h, C.white, fs, [9.6, 1.85]);
  K.img(s, guide, 9.85, guide === "tico" ? 1.5 : 1.3, guide === "tico" ? 0.85 : 1.05);
}
function opt(s, label, x, y, w, color, fs = 14.5, g, ok) {
  box(s, x, y + 0.02, 0.36, color, g ? { g, ok: !!ok, label } : {});
  txt(s, label, x + 0.46, y, w - 0.46, 0.4, { fs });
}
// barra dividida em n partes com k pintadas
function bar(s, x, y, w, h, n, k, color = C.sky, sizes) {
  let cx = x;
  for (let i = 0; i < n; i++) {
    const pw = sizes ? (sizes[i] * w) : w / n;
    s.addShape(pres.shapes.RECTANGLE, { x: cx, y, w: pw, h, fill: { color: i < k ? color : "FFFFFF" }, line: { color: C.ink, width: 1.5 } });
    cx += pw;
  }
}
function frac(s, num, den, x, y, w, color = C.ink, fs = 26) {
  txt(s, String(num), x, y, w, fs / 55, { face: FT, fs, bold: true, color, align: "center" });
  s.addShape(pres.shapes.LINE, { x: x + w * 0.2, y: y + fs / 52, w: w * 0.6, h: 0, line: { color, width: 2.25 } });
  txt(s, String(den), x, y + fs / 50, w, fs / 55, { face: FT, fs, bold: true, color, align: "center" });
}
function won(s, m, x = 5.45, y = 6.6) {
  const [im, master, name] = LEG[m - 1];
  K.card(s, x, y, 5.6, 0.98, GOLDLT, 0.16, C.gold);
  K.imgFit(s, im, x + 0.1, y + 0.05, 0.9, 0.88);
  txt(s, "DUEL WON!", x + 1.15, y + 0.08, 4.2, 0.38, { face: FT, fs: 14.5, bold: true, color: C.purple });
  txt(s, `${name} joins your team. Tick ${master} on the League map (page 2).`, x + 1.15, y + 0.46, 4.35, 0.44, { fs: 13 });
}
function thermo(s, x, y, h, level) {
  // escala de 0 a 40 °C
  const tw = 0.34, top = y, bot = y + h, r = 0.3;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x - tw / 2, y: top, w: tw, h: h + 0.1, fill: { color: "FFFFFF" }, line: { color: "4A4E55", width: 2 }, rectRadius: 0.17 });
  const ly = bot - (level / 40) * (h - 0.2);
  s.addShape(pres.shapes.RECTANGLE, { x: x - 0.07, y: ly, w: 0.14, h: bot - ly + 0.1, fill: { color: "E0452F" }, line: { color: "E0452F", width: 0 } });
  s.addShape(pres.shapes.OVAL, { x: x - r / 2 - 0.05, y: bot, w: r + 0.1, h: r + 0.1, fill: { color: "E0452F" }, line: { color: "4A4E55", width: 2 } });
  for (let t = 0; t <= 40; t += 5) {
    const ty = bot - (t / 40) * (h - 0.2);
    s.addShape(pres.shapes.LINE, { x: x + tw / 2, y: ty, w: t % 10 === 0 ? 0.2 : 0.1, h: 0, line: { color: "4A4E55", width: 1.25 } });
    if (t % 10 === 0) txt(s, String(t), x + tw / 2 + 0.22, ty - 0.13, 0.4, 0.26, { fs: 11.5, bold: true });
  }
  txt(s, "°C", x - 0.25, top - 0.32, 0.5, 0.28, { fs: 12, bold: true, align: "center" });
}

/* ===================== 1. COVER ===================== */
(() => {
  const s = K.newSlide("sky");
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: NIGHT }, line: { color: NIGHT } });
  for (let i = 0; i < 40; i++) s.addShape(pres.shapes.OVAL, { x: (i * 2.37) % W, y: (i * 1.13) % 3.2, w: 0.06, h: 0.06, fill: { color: "FFF3C4" }, line: { color: "FFF3C4", width: 0 } });
  K.card(s, 1.1, 0.45, 9.49, 2.55, "FFFCF4", 0.2);
  txt(s, "Master Isabel and the", 1.1, 0.55, 9.49, 0.6, { face: FT, fs: 26, bold: true, color: C.purple, align: "center" });
  txt(s, "LEGEND MASTERS", 1.0, 1.1, 9.69, 1.0, { face: FT, fs: 48, bold: true, color: C.orange, align: "center", fit: "shrink" });
  txt(s, "Math · Year 3 · Unit 8: Exploring Fractions · Unit 6: Measurement", 1.1, 2.2, 9.49, 0.5, { fs: 17, italic: true, color: C.muted, align: "center" });
  LEG.forEach(([im], i) => K.imgFit(s, im, 0.45 + i * 1.55, 3.25, 1.45, 1.6));
  K.img(s, "pena", 0.7, 5.05, 1.45); K.img(s, "bilu", 2.35, 5.2, 1.3); K.img(s, "tico", 3.75, 5.75, 0.85);
  K.bubble(s, [{ text: "7 Legend Masters are waiting for you. Win the duels with Math!", options: { bold: true } }], 4.9, 5.4, 5.2, 0.8, C.white, 15.5, [4.75, 5.95]);
  K.card(s, 0.5, 7.45, 5.4, 0.6, "FFFCF4", 0.12, C.purple);
  txt(s, "Master's name:", 0.68, 7.45, 1.7, 0.6, { face: FT, fs: 14, bold: true, color: C.purple });
  tfield(s, 2.4, 7.53, 3.35, 0.44, C.purple);
  K.pill(s, "TEST: NOVEMBER 18  •  READY? DUEL!", 6.15, 7.48, 5.05, 0.55, C.orange, "FFFFFF", 14.5);
})();

/* ===================== 2. TEAM, RULES AND LEAGUE MAP ===================== */
(() => {
  const s = K.newSlide("cream");
  K.topbar(s, 0, "", C.grass);
  K.title(s, "Your team and how the Legend League works", C.purple, 28, "center");
  const guide = (x, img, name, color, text) => {
    K.card(s, x, 1.5, 3.39, 1.85);
    K.imgFit(s, img, x + 0.1, 1.6, 1.1, 1.65);
    K.pill(s, name, x + 1.3, 1.62, 1.9, 0.44, color, "FFFFFF", 14);
    txt(s, text, x + 1.3, 2.12, 1.98, 1.15, { fs: 14, valign: "top" });
  };
  guide(0.6, "pena", "MASTER PENA", C.soil, "The wise leader. She explains every duel.");
  guide(4.13, "bilu", "BILU", C.sky, "Your partner. Funny and hungry: he loves pizza!");
  guide(7.66, "tico", "TICO", C.terra, "Small and curious. He asks LOTS of questions.");
  K.card(s, 0.6, 3.48, 10.45, 0.86, C.butter);
  rich(s, [B("How it works: ", C.orange), "7 Legend Masters, 7 duels. Do the actions MOVE!, FIND!, TALK!, TRY IT! · ", B("Tick the boxes to answer.", C.purple), " Each duel won = 1 badge, 10 crystals and a legendary creature on your team!"],
    0.85, 3.48, 10.0, 0.86, 15, { valign: "middle" });
  K.card(s, 0.6, 4.48, 10.45, 3.22, "F0EAF6", 0.14, C.purple);
  heading(s, "The Legend League: tick the box of each Master you beat!", 0.85, 4.56, 10.0, C.purple);
  LEG.forEach(([im, master, name], i) => {
    const x = 0.78 + i * 1.47;
    K.card(s, x, 5.05, 1.37, 2.5, "FFFDF7", 0.12, C.purple);
    K.imgFit(s, im, x + 0.12, 5.12, 1.13, 0.98);
    txt(s, name, x + 0.04, 6.1, 1.29, 0.32, { face: FT, fs: 12.5, bold: true, color: MC[i], align: "center" });
    txt(s, master, x + 0.04, 6.42, 1.29, 0.5, { fs: 11.5, align: "center" });
    box(s, x + 0.48, 6.98, 0.42, MC[i], { stop: i + 1 });
  });
  K.footer(s);
})();

/* ===================== 3. MISSION 1: EQUAL PARTS ===================== */
(() => {
  const c = MC[0]; const s = K.newSlide("cream");
  K.topbar(s, 1, "Equal parts", c);
  K.title(s, "Mission 1: Exploring equal parts", c);
  talk(s, "find", "Find something round at home (a plate, a pizza box). How could you cut it into 4 equal parts? Show Dad!", "pena");
  const tag = (x, w, t, d, imgs) => {
    K.card(s, x, 2.4, w, 1.95);
    K.pill(s, t, x + 0.15, 2.5, w - 0.3, 0.42, c, "FFFFFF", 14);
    txt(s, d, x + 0.15, 2.98, w - 0.3, 0.55, { fs: 13.5, align: "center" });
    imgs.forEach(([im, lab], i) => { const iw = (w - 0.3) / imgs.length; K.imgFit(s, im, x + 0.15 + i * iw + 0.08, 3.36, iw - 0.16, 0.7); if (lab) txt(s, lab, x + 0.15 + i * iw, 4.06, iw, 0.26, { fs: 11.5, bold: true, align: "center", color: lab === "equal" ? C.grassDk : C.coral }); });
  };
  tag(0.6, 3.4, "A WHOLE", "is one complete object.", [["maca"], ["pizza"], ["circ_2_0"]]);
  tag(4.12, 3.4, "A FRACTION", "is an equal part of a whole.", [["circ_2_1"]]);
  tag(7.64, 3.41, "EQUAL PARTS", "have the same size.", [["circ_4_0", "equal"], ["circ_unequal", "NOT equal"]]);
  K.card(s, 0.6, 4.47, 10.45, 1.6);
  heading(s, "One whole can be divided into...", 0.82, 4.5, 6.0, c);
  [["halves", 2], ["thirds", 3], ["fourths (quarters)", 4], ["fifths", 5], ["sixths", 6], ["sevenths", 7], ["eighths", 8], ["ninths", 9], ["tenths", 10]].forEach(([t, n], i) => {
    const x = 0.75 + i * 1.15;
    K.imgFit(s, `circ_${n}_0`, x + 0.2, 4.95, 0.72, 0.62);
    txt(s, `${n} parts`, x, 5.56, 1.12, 0.22, { fs: 11, align: "center", color: C.muted });
    txt(s, t, x - 0.04, 5.76, 1.2, 0.28, { fs: 12, bold: true, align: "center", fit: "shrink" });
  });
  K.card(s, 0.6, 6.15, 10.45, 0.6, C.butter);
  rich(s, [B("Same fraction, different shapes: ", C.orange), "a circle, a square or a rectangle cut into 4 equal parts all show fourths. The shape can change, but the fraction stays the same!"], 0.85, 6.15, 10.0, 0.6, 13.5, { valign: "middle" });
  K.action(s, "move", "Fold a sheet of paper in half, then in half again. Open it: how many equal parts? Make a WHOLE circle with your arms, then cut it in HALF with one arm!", 0.6, 6.86, 10.45, 0.84, C.white, 15);
  K.footer(s);
})();

/* ===================== 4. DUEL 1 ===================== */
(() => {
  const s = K.newSlide("cream"); const c = MC[0];
  K.topbar(s, 1, "", c, { challenge: true });
  K.title(s, "Duel 1: Master Aria and Partiko", C.grassDk);
  talk(s, "move", "Partiko attacks! For each shape, clap if the parts are EQUAL or stomp if they are NOT. Then tick the answer.", "bilu", 15.5, 0.8);
  K.card(s, 0.6, 2.45, 4.6, 4.05);
  heading(s, "Equal parts or not?", 0.82, 2.5, 4.2, c);
  [["circ_4_0", 0], ["circ_unequal", 1], ["rect_unequal", 1], ["circ_3_0", 0]].forEach(([im, ok], i) => {
    const y = 2.98 + i * 0.86;
    txt(s, `${i + 1}.`, 0.82, y + 0.15, 0.3, 0.4, { fs: 14, bold: true });
    K.imgFit(s, im, 1.12, y, 1.1, 0.75);
    opt(s, "equal", 2.4, y + 0.17, 1.15, c, 14, `d1_${i}`, ok === 0); opt(s, "not equal", 3.55, y + 0.17, 1.6, c, 14, `d1_${i}`, ok === 1);
  });
  K.card(s, 5.35, 2.45, 5.7, 4.05);
  heading(s, "What are the parts called?", 5.55, 2.5, 5.3, c);
  [["circ_2_0", ["halves", "thirds"], 0], ["circ_5_0", ["fourths", "fifths"], 1], ["circ_8_0", ["eighths", "sixths"], 0], ["circ_10_0", ["ninths", "tenths"], 1]].forEach(([im, os, ok], i) => {
    const y = 2.98 + i * 0.6;
    txt(s, `${i + 5}.`, 5.55, y + 0.05, 0.35, 0.4, { fs: 14, bold: true });
    K.imgFit(s, im, 5.9, y - 0.03, 0.55, 0.55);
    opt(s, os[0], 6.65, y + 0.05, 1.5, c, 14, `d1_${i + 4}`, ok === 0); opt(s, os[1], 8.2, y + 0.05, 1.5, c, 14, `d1_${i + 4}`, ok === 1);
  });
  txt(s, "9. A fraction is:", 5.55, 5.42, 2.0, 0.36, { fs: 14, bold: true });
  opt(s, "any part", 7.45, 5.42, 1.4, c, 13.5, "d1_8", 0); opt(s, "an equal part of a whole", 8.85, 5.42, 2.2, c, 12.5, "d1_8", 1);
  txt(s, "10. Fourths are also called:", 5.55, 5.95, 2.6, 0.36, { fs: 14, bold: true });
  opt(s, "quarters", 8.15, 5.95, 1.4, c, 13.5, "d1_9", 1); opt(s, "halves", 9.6, 5.95, 1.4, c, 13.5, "d1_9", 0);
  K.reward(s, 0.6, 6.62, "Equal Parts Badge", 10);
  won(s, 1);
  K.footer(s);
})();

/* ===================== 5. MISSION 2: NAMING AND WRITING FRACTIONS ===================== */
(() => {
  const c = MC[1]; const s = K.newSlide("cream");
  K.topbar(s, 2, "Naming fractions", c);
  K.title(s, "Mission 2: Naming and writing fractions", c);
  talk(s, "talk", "A pizza is cut into 4 equal slices and Bilu eats 3. How much did he eat? Guess with Dad!", "bilu");
  K.card(s, 0.6, 2.4, 4.3, 2.55);
  frac(s, 3, 4, 0.75, 2.6, 1.2, c, 40);
  K.card(s, 1.95, 2.55, 2.8, 1.0, "FBE3DE", 0.12);
  rich(s, [B("NUMERATOR ", C.coral), BR("(top number)"), "how many equal parts are counted (shaded)"], 2.05, 2.6, 2.65, 0.92, 12.5, { valign: "middle" });
  K.card(s, 1.95, 3.7, 2.8, 1.12, "E3F4FC", 0.12);
  rich(s, [B("DENOMINATOR ", C.sky), BR("(bottom number)"), "how many equal parts are in the whole. It helps us NAME the fraction!"], 2.05, 3.74, 2.65, 1.05, 12.5, { valign: "middle" });
  K.card(s, 5.05, 2.4, 2.4, 2.55);
  heading(s, "We say...", 5.2, 2.43, 2.1, c, 14);
  rich(s, [BR("2 → halves"), BR("3 → thirds"), BR("4 → fourths or quarters"), BR("5 → fifths"), BR("6 → sixths"), BR("7 → sevenths"), BR("8 → eighths"), BR("9 → ninths"), "10 → tenths"], 5.2, 2.83, 2.2, 2.08, 12, { valign: "top" });
  K.card(s, 7.6, 2.4, 3.45, 2.55);
  heading(s, "How to name a fraction", 7.75, 2.43, 3.2, c, 14);
  rich(s, [BR("1. Look at the whole: are the parts equal?"), BR("2. Count ALL the equal parts: the denominator."), BR("3. Count the parts you are talking about: the numerator."), "4. Write it and say it: 3/4 = three fourths."], 7.75, 2.85, 3.2, 2.05, 12.5, { valign: "top" });
  K.card(s, 0.6, 5.07, 10.45, 1.66);
  heading(s, "More examples", 0.82, 5.1, 3.0, c, 14.5);
  [["circ_2_1", 1, 2, "one half"], ["circ_3_2", 2, 3, "two thirds"], ["circ_4_3", 3, 4, "three fourths"], ["circ_5_2", 2, 5, "two fifths"], ["circ_8_5", 5, 8, "five eighths"], ["circ_10_7", 7, 10, "seven tenths"]].forEach(([im, n, d, w], i) => {
    const x = 0.75 + i * 1.72;
    K.imgFit(s, im, x, 5.5, 0.75, 0.75);
    frac(s, n, d, x + 0.78, 5.47, 0.6, c, 18);
    txt(s, w, x - 0.05, 6.3, 1.6, 0.36, { fs: 13, bold: true, align: "center" });
  });
  K.action(s, "move", "NUMERATOR = stand up tall (it is on top). DENOMINATOR = crouch down (it is at the bottom). Dad says one of the two words, faster and faster!", 0.6, 6.86, 10.45, 0.84, C.white, 15);
  K.footer(s);
})();

/* ===================== 6. DUEL 2 ===================== */
(() => {
  const s = K.newSlide("cream"); const c = MC[1];
  K.topbar(s, 2, "", c, { challenge: true });
  K.title(s, "Duel 2: Master Theo and Numerra", C.teal);
  talk(s, "move", "Numerra shows a fraction! Stand up for the numerator and crouch for the denominator before you tick each answer.", "pena", 15.5, 0.8);
  K.card(s, 0.6, 2.45, 5.2, 4.05);
  heading(s, "Which fraction is shaded?", 0.82, 2.5, 4.8, c);
  [["circ_4_3", ["3/4", "4/3"], 0], ["circ_8_3", ["5/8", "3/8"], 1], ["circ_6_1", ["1/6", "1/5"], 0], ["circ_10_7", ["3/10", "7/10"], 1]].forEach(([im, os, ok], i) => {
    const y = 2.98 + i * 0.86;
    txt(s, `${i + 1}.`, 0.82, y + 0.15, 0.3, 0.4, { fs: 14, bold: true });
    K.imgFit(s, im, 1.15, y, 0.75, 0.75);
    opt(s, os[0], 2.3, y + 0.17, 1.4, c, 16, `d2_${i}`, ok === 0); opt(s, os[1], 3.8, y + 0.17, 1.4, c, 16, `d2_${i}`, ok === 1);
  });
  K.card(s, 5.95, 2.45, 5.1, 4.05);
  heading(s, "Say it in words", 6.15, 2.5, 4.7, c);
  [["2/3", ["two thirds", "three halves"], 0], ["1/2", ["one second", "one half"], 1], ["5/8", ["five eighths", "eight fifths"], 0], ["3/10", ["three tens", "three tenths"], 1]].forEach(([f, os, ok], i) => {
    const y = 2.95 + i * 0.5;
    txt(s, `${i + 5}. ${f}`, 6.15, y, 1.05, 0.4, { face: FT, fs: 15, bold: true });
    opt(s, os[0], 7.2, y, 1.9, c, 13.5, `d2_${i + 4}`, ok === 0); opt(s, os[1], 9.1, y, 1.9, c, 13.5, `d2_${i + 4}`, ok === 1);
  });
  txt(s, "9. In 4/5, the numerator is:", 6.15, 5.0, 2.8, 0.36, { fs: 13.5, bold: true });
  opt(s, "4", 9.0, 5.0, 0.9, c, 14, "d2_8", 1); opt(s, "5", 9.95, 5.0, 0.9, c, 14, "d2_8", 0);
  txt(s, "10. The denominator tells us:", 6.15, 5.5, 4.8, 0.34, { fs: 13.5, bold: true });
  opt(s, "the parts shaded", 6.2, 5.86, 2.3, c, 13.5, "d2_9", 0); opt(s, "all the equal parts", 8.6, 5.86, 2.4, c, 13.5, "d2_9", 1);
  K.reward(s, 0.6, 6.62, "Fraction Namer Badge", 10);
  won(s, 2);
  K.footer(s);
})();

/* ===================== 7. MISSION 3: FRACTIONS OF A LENGTH ===================== */
(() => {
  const c = MC[2]; const s = K.newSlide("cream");
  K.topbar(s, 3, "Fractions of a length", c);
  K.title(s, "Mission 3: Fractions of a length", c);
  talk(s, "try", "Take a strip of paper: it is your WHOLE. Fold it into 4 equal parts and color 1 part. That is one fourth!", "tico");
  K.card(s, 0.6, 2.4, 3.3, 1.6);
  heading(s, "1. One whole", 0.78, 2.43, 3.0, c, 14.5);
  bar(s, 0.85, 2.92, 2.8, 0.4, 1, 1, "9ED3F2");
  txt(s, "A whole is the entire length.", 0.78, 3.4, 3.0, 0.5, { fs: 13 });
  K.card(s, 4.05, 2.4, 3.3, 1.6);
  heading(s, "2. Equal parts", 4.23, 2.43, 3.0, c, 14.5);
  bar(s, 4.3, 2.92, 2.8, 0.4, 4, 0);
  txt(s, "Divide the whole into parts that are equal in length.", 4.23, 3.4, 3.0, 0.55, { fs: 13 });
  K.card(s, 7.5, 2.4, 3.55, 1.6);
  heading(s, "3. Fraction names", 7.68, 2.43, 3.2, c, 14.5);
  [[2, "one half"], [3, "one third"], [4, "one fourth"], [5, "one fifth"]].forEach(([n, t], i) => {
    const y = 2.88 + i * 0.27;
    bar(s, 7.7, y + 0.03, 1.2, 0.2, n, 1, "C9B3EC");
    txt(s, `${t} (1/${n})`, 9.0, y, 2.0, 0.26, { fs: 12.5 });
  });
  K.card(s, 0.6, 4.12, 5.15, 2.61);
  heading(s, "4. All the parts make the whole", 0.78, 4.15, 4.8, c, 14.5);
  [[4, "1/4 + 1/4 + 1/4 + 1/4 = 1 whole", "4 fourths = 1 whole"], [3, "1/3 + 1/3 + 1/3 = 1 whole", "3 thirds = 1 whole"], [5, "1/5 + 1/5 + 1/5 + 1/5 + 1/5 = 1 whole", "5 fifths = 1 whole"]].forEach(([n, t, w], i) => {
    const y = 4.62 + i * 0.68;
    bar(s, 0.8, y, 1.7, 0.32, n, n, ["5BB8F0", "8FD18A", "F7A8C0"][i]);
    txt(s, t, 2.6, y - 0.06, 3.1, 0.3, { fs: 12, fit: "shrink" });
    txt(s, w, 2.6, y + 0.22, 3.1, 0.3, { fs: 12.5, bold: true, color: c });
  });
  K.card(s, 5.9, 4.12, 5.15, 2.61, C.butter);
  heading(s, "5. Shade a fraction of a length", 6.08, 4.15, 4.8, c, 14.5);
  bar(s, 6.15, 4.65, 3.0, 0.42, 5, 2, "F28C6A");
  frac(s, 2, 5, 9.35, 4.52, 0.6, c, 22);
  rich(s, [B("2 fifths are shaded. ", c), BR(""), B("2 ", C.coral), BR("= the parts we are talking about (shaded)"), B("5 ", C.sky), "= all the equal parts in the whole"], 6.08, 5.2, 4.85, 1.45, 13, { valign: "top" });
  K.action(s, "move", "Make a path of 4 equal steps in the hallway: it is your whole. Walk 1/4 (1 step), 2/4, 3/4... and 4/4 = 1 whole! Say each fraction out loud.", 0.6, 6.86, 10.45, 0.84, C.white, 15);
  K.footer(s);
})();

/* ===================== 8. DUEL 3 ===================== */
(() => {
  const s = K.newSlide("cream"); const c = MC[2];
  K.topbar(s, 3, "", c, { challenge: true });
  K.title(s, "Duel 3: Master Lia and Ribbonix", C.amber);
  talk(s, "move", "Ribbonix stretches! Before each answer, walk the fraction on your 4-step path (or spread your arms for 1 whole).", "tico", 15.5, 0.8);
  K.card(s, 0.6, 2.45, 5.3, 4.05);
  heading(s, "What fraction is shaded?", 0.82, 2.5, 4.9, c);
  [[5, 2, ["2/5", "3/5"], 0], [3, 1, ["1/2", "1/3"], 1], [4, 3, ["3/4", "1/4"], 0], [6, 5, ["6/5", "5/6"], 1]].forEach(([n, k, os, ok], i) => {
    const y = 3.0 + i * 0.86;
    txt(s, `${i + 1}.`, 0.82, y + 0.05, 0.3, 0.4, { fs: 14, bold: true });
    bar(s, 1.15, y + 0.04, 2.0, 0.36, n, k, "F2A93B");
    opt(s, os[0], 3.35, y + 0.03, 1.2, c, 15, `d3_${i}`, ok === 0); opt(s, os[1], 4.55, y + 0.03, 1.3, c, 15, `d3_${i}`, ok === 1);
  });
  K.card(s, 6.05, 2.45, 5.0, 4.05);
  heading(s, "Think like a master", 6.25, 2.5, 4.6, c);
  [["5. 4 fourths =", ["1 whole", "4 wholes"], 0], ["6. 1/3 + 1/3 + 1/3 =", ["3 wholes", "1 whole"], 1], ["7. Fifths in 1 whole:", ["4", "5"], 1]].forEach(([q, os, ok], i) => {
    const y = 2.96 + i * 0.5;
    txt(s, q, 6.25, y, 2.3, 0.4, { fs: 13.5, bold: true });
    opt(s, os[0], 8.5, y, 1.25, c, 13, `d3_${i + 4}`, ok === 0); opt(s, os[1], 9.8, y, 1.25, c, 13, `d3_${i + 4}`, ok === 1);
  });
  txt(s, "8. A chocolate bar has 6 equal pieces. You eat 1 piece. You ate:", 6.25, 4.48, 4.7, 0.5, { fs: 13.5, bold: true, valign: "top" });
  opt(s, "1/6", 6.3, 4.98, 1.4, c, 14, "d3_7", 1); opt(s, "1/5", 7.8, 4.98, 1.4, c, 14, "d3_7", 0);
  txt(s, "9. To show a fraction of a length, the parts must be:", 6.25, 5.45, 4.7, 0.5, { fs: 13.5, bold: true, valign: "top" });
  opt(s, "different sizes", 6.3, 5.95, 2.1, c, 13, "d3_8", 0); opt(s, "equal in length", 8.5, 5.95, 2.4, c, 13, "d3_8", 1);
  K.reward(s, 0.6, 6.62, "Length Master Badge", 10);
  won(s, 3);
  K.footer(s);
})();

/* ===================== 9. MISSION 4: FRACTIONS OF A SET ===================== */
(() => {
  const c = MC[3]; const s = K.newSlide("cream");
  K.topbar(s, 4, "Fractions of a set", c);
  K.title(s, "Mission 4: Fractions of a set", c);
  talk(s, "find", "Make a set of 8 things (spoons, socks, toys). How many objects are in the whole set? Show Dad!", "pena");
  K.card(s, 0.6, 2.4, 3.6, 2.0);
  heading(s, "What is a set?", 0.78, 2.43, 3.3, c, 14.5);
  txt(s, "A set is a group of objects. The whole is the entire set.", 0.78, 2.85, 3.3, 0.55, { fs: 13 });
  for (let i = 0; i < 8; i++) K.imgFit(s, "botao_vermelho", 0.85 + (i % 4) * 0.8, 3.45 + Math.floor(i / 4) * 0.45, 0.4, 0.4);
  K.card(s, 4.35, 2.4, 6.7, 2.0);
  heading(s, "How to find a fraction of a set: 1/4 of 8", 4.53, 2.43, 6.4, c, 14.5);
  [["1. Count the objects.", "8 in all"], ["2. Look at the fraction.", "the 4 = make 4 equal groups"], ["3. Make equal groups.", "4 groups of 2"], ["4. Count ONE group.", "1/4 of 8 = 2"]].forEach(([t, d], i) => {
    const x = 4.5 + i * 1.63;
    txt(s, t, x, 2.88, 1.58, 0.45, { fs: 12, bold: true, color: c, valign: "top" });
    txt(s, d, x, 3.33, 1.58, 0.42, { fs: 12, valign: "top" });
  });
  for (let g = 0; g < 4; g++) {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 4.55 + g * 1.0, y: 3.82, w: 0.9, h: 0.5, fill: { color: g === 0 ? "FFE8A3" : "FFFFFF" }, line: { color: c, width: 1.5 }, rectRadius: 0.08 });
    K.imgFit(s, "botao_vermelho", 4.62 + g * 1.0, 3.88, 0.36, 0.36); K.imgFit(s, "botao_vermelho", 5.03 + g * 1.0, 3.88, 0.36, 0.36);
  }
  txt(s, "1/4 of 8 = 2", 8.65, 3.82, 2.3, 0.5, { face: FT, fs: 20, bold: true, color: c });
  K.card(s, 0.6, 4.52, 5.15, 2.21);
  heading(s, "Describing a set with fractions", 0.78, 4.55, 4.8, c, 14.5);
  for (let i = 0; i < 8; i++) K.imgFit(s, i < 6 ? "botao_vermelho" : "botao_azul", 0.85 + i * 0.58, 5.02, 0.48, 0.48);
  rich(s, [B("6 out of 8 ", "C8443A"), BR("buttons are red: 6/8 of the buttons are red."), B("2 out of 8 ", C.sky), "buttons are blue: 2/8 are blue."], 0.78, 5.6, 4.85, 1.05, 13.5, { valign: "top" });
  K.card(s, 5.9, 4.52, 5.15, 2.21, C.butter);
  heading(s, "Another example: 9 fish bowls", 6.08, 4.55, 4.8, c, 14.5);
  for (let i = 0; i < 9; i++) K.imgFit(s, i < 7 ? "aquario" : "aquario_vazio", 6.1 + i * 0.52, 5.02, 0.46, 0.46);
  rich(s, [B("7/9 ", c), BR("of the fish bowls have a fish."), B("2/9 ", c), BR("are empty."), B("Also: ", c), "1/6 of 12 counters = 2 (6 groups of 2)."], 6.08, 5.55, 4.85, 1.12, 13.5, { valign: "top" });
  K.action(s, "move", "Share 12 grapes (or LEGO pieces) on 3 plates, the same number on each plate. 1/3 of 12 = ? Run and give one plate to Dad!", 0.6, 6.86, 10.45, 0.84, C.white, 15);
  K.footer(s);
})();

/* ===================== 10. DUEL 4 ===================== */
(() => {
  const s = K.newSlide("cream"); const c = MC[3];
  K.topbar(s, 4, "", c, { challenge: true });
  K.title(s, "Duel 4: Master Rubi and Gemmora", C.soil);
  talk(s, "move", "Gemmora throws gems! Use real objects (spoons, LEGO) to make the equal groups before you tick.", "bilu", 15.5, 0.8);
  K.card(s, 0.6, 2.45, 5.5, 4.05);
  heading(s, "What fraction of the set?", 0.82, 2.5, 5.1, c);
  const row = (i, imgs, q, os, ok) => {
    const y = 2.98 + i * 0.86;
    imgs.forEach((im, k) => K.imgFit(s, im, 0.82 + k * 0.36, y, 0.32, 0.32));
    txt(s, `${i + 1}. ${q}`, 0.82, y + 0.36, 3.2, 0.36, { fs: 13, bold: true });
    opt(s, os[0], 3.95, y + 0.2, 1.05, c, 15, `d4_${i}`, ok === 0); opt(s, os[1], 5.0, y + 0.2, 1.05, c, 15, `d4_${i}`, ok === 1);
  };
  row(0, [..."RRRRRBBB"].map((x) => (x === "R" ? "botao_vermelho" : "botao_azul")), "What fraction is red?", ["5/8", "3/8"], 0);
  row(1, [..."RRRRRBBB"].map((x) => (x === "R" ? "botao_vermelho" : "botao_azul")), "What fraction is blue?", ["5/8", "3/8"], 1);
  row(2, ["aquario", "aquario", "aquario", "aquario", "aquario_vazio", "aquario_vazio"], "Bowls with a fish?", ["2/6", "4/6"], 1);
  row(3, ["estrela", "estrela", "estrela", "estrela_azul"], "What fraction is yellow?", ["3/4", "1/4"], 0);
  K.card(s, 6.25, 2.45, 4.8, 4.05);
  heading(s, "Find the fraction of the set", 6.45, 2.5, 4.4, c);
  [["5. 1/4 of 8 =", ["2", "4"], 0], ["6. 1/2 of 10 =", ["2", "5"], 1], ["7. 1/3 of 9 =", ["3", "6"], 0], ["8. 1/6 of 12 =", ["6", "2"], 1]].forEach(([q, os, ok], i) => {
    const y = 2.98 + i * 0.5;
    txt(s, q, 6.45, y, 1.9, 0.4, { face: FT, fs: 15, bold: true });
    opt(s, os[0], 8.45, y, 1.1, c, 15, `d4_${i + 4}`, ok === 0); opt(s, os[1], 9.6, y, 1.1, c, 15, `d4_${i + 4}`, ok === 1);
  });
  txt(s, "9. To find 1/5 of a set, make:", 6.45, 5.0, 4.5, 0.34, { fs: 13.5, bold: true });
  opt(s, "5 equal groups", 6.5, 5.36, 2.1, c, 13.5, "d4_8", 1); opt(s, "1 big group", 8.7, 5.36, 2.0, c, 13.5, "d4_8", 0);
  txt(s, "10. In a set, the whole is:", 6.45, 5.82, 4.5, 0.34, { fs: 13.5, bold: true });
  opt(s, "one object", 6.5, 6.14, 2.0, c, 13.5, "d4_9", 0); opt(s, "the entire set", 8.7, 6.14, 2.2, c, 13.5, "d4_9", 1);
  K.reward(s, 0.6, 6.62, "Set Collector Badge", 10);
  won(s, 4);
  K.footer(s);
})();

/* ===================== 11. MISSION 5: THE CALENDAR ===================== */
(() => {
  const c = MC[4]; const s = K.newSlide("cream");
  K.topbar(s, 5, "Calendar", c);
  K.title(s, "Mission 5: Understanding a calendar", c);
  talk(s, "talk", "What is today's date? What day of the week is it? Say it the way Canadians write it!", "bilu");
  K.card(s, 0.6, 2.4, 5.0, 2.05);
  heading(s, "How time is organized", 0.78, 2.43, 4.7, c, 14.5);
  rich(s, [B("YEAR → MONTHS → WEEKS → DAYS", c), BR(""), BR("1 year = 12 months · 1 year = 365 days"), BR("1 month has 28, 30 or 31 days"), BR("1 week = 7 days"), B("Leap year = 366 days ", c), "(February has 29 days)."],
    0.78, 2.85, 4.7, 1.55, 13.5, { valign: "top" });
  K.card(s, 0.6, 4.55, 5.0, 2.18);
  heading(s, "Months of the year", 0.78, 4.58, 4.7, c, 14.5);
  rich(s, [B("31 days: ", c), BR("January, March, May, July, August, October, December"), B("30 days: ", c), BR("April, June, September, November"), B("February: ", c), "28 days (29 in a leap year)"], 0.78, 5.0, 4.7, 1.7, 13.5, { valign: "top" });
  // calendário de novembro de 2026 (começa num domingo)
  K.card(s, 5.75, 2.4, 5.3, 4.33);
  txt(s, "NOVEMBER 2026", 5.9, 2.45, 3.0, 0.4, { face: FT, fs: 16, bold: true, color: c });
  txt(s, "month + year", 8.9, 2.48, 2.0, 0.34, { fs: 11.5, italic: true, color: C.muted, align: "right" });
  const D = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], cw = 0.72, x0 = 5.92;
  D.forEach((d, i) => { s.addShape(pres.shapes.RECTANGLE, { x: x0 + i * cw, y: 2.9, w: cw, h: 0.32, fill: { color: c }, line: { color: "FFFFFF", width: 1 } }); txt(s, d, x0 + i * cw, 2.9, cw, 0.32, { fs: 12, bold: true, color: "FFFFFF", align: "center" }); });
  for (let d = 1; d <= 30; d++) {
    const k = d - 1, col = k % 7, rowi = Math.floor(k / 7);
    const x = x0 + col * cw, y = 3.22 + rowi * 0.5;
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: cw, h: 0.5, fill: { color: d === 18 ? "FFE08A" : "FFFFFF" }, line: { color: "D8C5A8", width: 1 } });
    txt(s, String(d), x, y, cw, 0.5, { fs: 14, bold: d === 18, align: "center" });
  }
  rich(s, [B("Days of the week: ", c), "Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday. November 2026 starts on a Sunday. The yellow day is your test!"], 5.92, 5.75, 5.05, 0.95, 12.5, { valign: "top" });
  K.action(s, "move", [{ text: "Say the 7 days of the week taking 7 steps. Then hop once for each month with 31 days! " }, { text: "Writing a date: November 18th, 2026 (month + date + year, comma before the year) · in Portuguese: 18 de novembro de 2026.", options: { bold: true } }], 0.6, 6.86, 10.45, 0.84, C.white, 13.5);
  K.footer(s);
})();

/* ===================== 12. DUEL 5 ===================== */
(() => {
  const s = K.newSlide("cream"); const c = MC[4];
  K.topbar(s, 5, "", c, { challenge: true });
  K.title(s, "Duel 5: Master Dias and Calendrix", C.terra);
  talk(s, "move", "Calendrix spins the days! Hop once for each answer you are sure about. Use the November calendar on page 11.", "pena", 15.5, 0.8);
  K.card(s, 0.6, 2.45, 5.2, 4.05);
  heading(s, "Count the time", 0.82, 2.5, 4.8, c);
  [["1. Days in a week:", ["5", "7"], 1], ["2. Months in a year:", ["12", "10"], 0], ["3. Days in a year:", ["300", "365"], 1], ["4. A month with 30 days:", ["April", "March"], 0],
    ["5. A month with 31 days:", ["June", "July"], 1], ["6. In a leap year, February has:", ["29 days", "31 days"], 0]].forEach(([q, os, ok], i) => {
    const y = 2.96 + i * 0.58;
    txt(s, q, 0.82, y, 2.75, 0.42, { fs: 13.5, bold: true, fit: "shrink" });
    opt(s, os[0], 3.55, y, 1.15, c, 14, `d5_${i}`, ok === 0); opt(s, os[1], 4.65, y, 1.15, c, 14, `d5_${i}`, ok === 1);
  });
  K.card(s, 5.95, 2.45, 5.1, 4.05);
  heading(s, "Read and write dates", 6.15, 2.5, 4.7, c);
  [["7. Nov. 18th, 2026 is a:", ["Wednesday", "Friday"], 0], ["8. The day after Friday:", ["Thursday", "Saturday"], 1], ["9. November 2026 starts on a:", ["Sunday", "Monday"], 0], ["10. Ordinal number for 22:", ["22th", "22nd"], 1]].forEach(([q, os, ok], i) => {
    const y = 2.95 + i * 0.58;
    txt(s, q, 6.15, y, 2.3, 0.42, { fs: 12.5, bold: true });
    opt(s, os[0], 8.45, y, 1.4, c, 13, `d5_${i + 6}`, ok === 0); opt(s, os[1], 9.85, y, 1.2, c, 13, `d5_${i + 6}`, ok === 1);
  });
  txt(s, "11. Write the date in English (Canada):", 6.15, 5.32, 4.8, 0.34, { fs: 13, bold: true });
  opt(s, "November 18th, 2026", 6.2, 5.7, 2.45, c, 13.5, "d5_10", 1); opt(s, "18th November 2026", 8.7, 5.7, 2.35, c, 13.5, "d5_10", 0);
  K.reward(s, 0.6, 6.62, "Calendar Keeper Badge", 10);
  won(s, 5);
  K.footer(s);
})();

/* ===================== 13. MISSION 6: TEMPERATURE ===================== */
(() => {
  const c = MC[5]; const s = K.newSlide("cream");
  K.topbar(s, 6, "Temperature", c);
  K.title(s, "Mission 6: Measuring temperature", c);
  talk(s, "try", "Touch a glass of cold water and a cup of warm water (with Dad!). Which one has a higher temperature?", "tico");
  K.card(s, 0.6, 2.4, 4.3, 4.33);
  heading(s, "Temperature", 0.78, 2.43, 4.0, c, 15);
  rich(s, [BR("How hot or cold something is."), B("Tool: ", c), BR("thermometer"), B("Units: ", c), BR("°C = degrees Celsius"), BR("°F = degrees Fahrenheit"), BR(" ", { fontSize: 6 }), B("Higher number = hotter. ", "E0452F"), B("Lower number = colder.", C.sky)],
    0.78, 2.85, 2.6, 3.0, 13.5, { valign: "top" });
  thermo(s, 4.0, 2.95, 3.1, 30);
  txt(s, "The red line stops at 30: it is 30 °C.", 0.78, 6.05, 3.0, 0.6, { fs: 12.5, italic: true, color: C.muted });
  K.card(s, 5.05, 2.4, 6.0, 1.55, C.butter);
  heading(s, "Hot or cold?", 5.23, 2.43, 3.0, c, 14.5);
  [["sopa", "hot soup"], ["sol", "a hot sunny day"], ["sorvete", "cold ice cream"], ["floco", "snow: very cold"]].forEach(([im, t], i) => {
    const x = 5.2 + i * 1.45;
    K.imgFit(s, im, x + 0.3, 2.85, 0.75, 0.62);
    txt(s, t, x - 0.05, 3.5, 1.5, 0.4, { fs: 12, align: "center" });
  });
  K.card(s, 5.05, 4.07, 6.0, 2.66);
  heading(s, "Choose the right tool and unit", 5.23, 4.1, 5.6, c, 14.5);
  [["regua", "LENGTH (how long)", "ruler · mm, cm, m, km"], ["balanca", "MASS (how heavy)", "scale · g, kg"], ["copo_medidor", "CAPACITY (how much it holds)", "measuring cup · mL, L"], ["termometro", "TEMPERATURE (how hot or cold)", "thermometer · °C, °F"], ["calendario", "TIME (how long it takes)", "clock, calendar · minutes, days"]].forEach(([im, t, d], i) => {
    const y = 4.55 + i * 0.43;
    K.imgFit(s, im, 5.25, y, 0.5, 0.38);
    txt(s, t, 5.85, y, 2.75, 0.38, { fs: 12, bold: true, color: c, fit: "shrink" });
    txt(s, d, 8.55, y, 2.45, 0.38, { fs: 12 });
  });
  K.action(s, "move", "Thermometer body! Dad says a temperature: 0 °C = crouch and shiver; 20 °C = stand normally; 40 °C = jump and fan yourself!", 0.6, 6.86, 10.45, 0.84, C.white, 15);
  K.footer(s);
})();

/* ===================== 14. DUEL 6 ===================== */
(() => {
  const s = K.newSlide("cream"); const c = MC[5];
  K.topbar(s, 6, "", c, { challenge: true });
  K.title(s, "Duel 6: Master Neve and Thermion", C.sky);
  talk(s, "move", "Thermion freezes and burns! Do the thermometer body (crouch, stand or jump) for each temperature before you tick.", "tico", 15.5, 0.8);
  K.card(s, 0.6, 2.45, 5.0, 4.05);
  heading(s, "Read the thermometers", 0.82, 2.5, 4.6, c);
  [[10, ["10 °C", "20 °C"], 0], [35, ["30 °C", "35 °C"], 1], [20, ["20 °C", "40 °C"], 0]].forEach(([lv, os, ok], i) => {
    const x = 1.15 + i * 1.55;
    txt(s, `${i + 1}.`, x - 0.45, 3.05, 0.3, 0.3, { fs: 14, bold: true });
    thermo(s, x, 3.2, 1.9, lv);
    opt(s, os[0], x - 0.45, 5.55, 1.4, c, 13, `d6_${i}`, ok === 0); opt(s, os[1], x - 0.45, 5.98, 1.4, c, 13, `d6_${i}`, ok === 1);
  });
  K.card(s, 5.75, 2.45, 5.3, 4.05);
  heading(s, "Tools, units and temperatures", 5.95, 2.5, 4.9, c, 15);
  [["4. Temperature tells us:", ["how heavy", "hot or cold"], 1], ["5. Tool for temperature:", ["thermometer", "ruler"], 0], ["6. °C means:", ["centimeters", "degrees Celsius"], 1],
    ["7. Which is hotter?", ["35 °C", "15 °C"], 0], ["8. A cold day:", ["35 °C", "5 °C"], 1], ["9. Mass of an apple:", ["scale (g)", "thermometer"], 0], ["10. Water in a jug:", ["ruler (cm)", "cup (mL)"], 1]].forEach(([q, os, ok], i) => {
    const y = 2.95 + i * 0.5;
    txt(s, q, 5.95, y, 1.95, 0.42, { fs: 12.5, bold: true });
    opt(s, os[0], 7.8, y, 1.55, c, 13, `d6_${i + 3}`, ok === 0); opt(s, os[1], 9.35, y, 1.7, c, 13, `d6_${i + 3}`, ok === 1);
  });
  K.reward(s, 0.6, 6.62, "Temperature Tamer Badge", 10);
  won(s, 6);
  K.footer(s);
})();

/* ===================== 15. MISSION 7 (part 1): BRAZILIAN MONEY ===================== */
(() => {
  const c = MC[6]; const s = K.newSlide("cream");
  K.topbar(s, 7, "Money", c);
  K.title(s, "Mission 7: Counting Brazilian money", c);
  talk(s, "find", "Ask Dad for some real coins. Sort them from the smallest value to the biggest value!", "pena");
  K.card(s, 0.6, 2.4, 10.45, 1.75);
  heading(s, "Coins and notes of the real (R$)", 0.82, 2.43, 6.0, c, 14.5);
  [["moeda_5", "5 centavos", "R$ 0,05"], ["moeda_10", "10 centavos", "R$ 0,10"], ["moeda_25", "25 centavos", "R$ 0,25"], ["moeda_50", "50 centavos", "R$ 0,50"], ["moeda_1", "1 real", "R$ 1,00"]].forEach(([im, t, v], i) => {
    const x = 0.75 + i * 1.2;
    K.imgFit(s, im, x + 0.2, 2.85, 0.75, 0.75);
    txt(s, t, x - 0.05, 3.6, 1.25, 0.26, { fs: 12, bold: true, align: "center" });
    txt(s, v, x - 0.05, 3.85, 1.25, 0.26, { fs: 12, align: "center", color: C.muted });
  });
  [["nota_2", "R$ 2,00"], ["nota_5", "R$ 5,00"], ["nota_10", "R$ 10,00"], ["nota_20", "R$ 20,00"]].forEach(([im, v], i) => {
    const x = 6.85 + i * 1.03;
    K.imgFit(s, im, x, 3.0, 0.95, 0.5);
    txt(s, v, x - 0.05, 3.6, 1.05, 0.3, { fs: 12, bold: true, align: "center" });
  });
  K.card(s, 0.6, 4.27, 5.15, 2.46, C.butter);
  heading(s, "Remember", 0.78, 4.3, 4.8, c, 14.5);
  rich(s, [B("100 centavos = 1 real ", c), BR("(R$ 1,00)"), BR("2 coins of 50 centavos = R$ 1,00"), BR("4 coins of 25 centavos = R$ 1,00"), BR("10 coins of 10 centavos = R$ 1,00"), B("We write: ", c), "R$ 1,75 = 1 real and 75 centavos."],
    0.78, 4.72, 4.85, 1.95, 13.5, { valign: "top" });
  K.card(s, 5.9, 4.27, 5.15, 2.46);
  heading(s, "How to count money", 6.08, 4.3, 4.8, c, 14.5);
  [["moeda_1"], ["moeda_50"], ["moeda_25"], ["moeda_10"]].forEach(([im], i) => K.imgFit(s, im, 6.15 + i * 1.18, 4.75, 0.62, 0.62));
  ["R$ 1,00", "R$ 1,50", "R$ 1,75", "R$ 1,85"].forEach((t, i) => txt(s, t, 6.0 + i * 1.18, 5.38, 0.95, 0.3, { fs: 12.5, bold: true, align: "center", color: c }));
  rich(s, [B("Start with the biggest value, ", c), "then count on: 1 real... 1,50... 1,75... 1,85. Total: R$ 1,85."], 6.08, 5.75, 4.85, 0.92, 13.5, { valign: "top" });
  K.action(s, "move", "Coin hunt! Dad hides 6 coin cards around the room. Find them all, put them in order from the biggest value and count the total out loud.", 0.6, 6.86, 10.45, 0.84, C.white, 15);
  K.footer(s);
})();

/* ===================== 16. MISSION 7 (part 2): CHANGE, ADDING AND SUBTRACTING MONEY ===================== */
(() => {
  const c = MC[6]; const s = K.newSlide("cream");
  K.topbar(s, 7, "Change", c);
  K.title(s, "Mission 7: Adding, subtracting and making change", c, 27);
  talk(s, "talk", "You pay R$ 5,00 for a juice that costs R$ 3,00. What does the cashier give back to you?", "bilu");
  K.card(s, 0.6, 2.4, 10.45, 1.55, "F0EAF6");
  heading(s, "Moedon's Legend Shop", 0.82, 2.43, 5.0, c, 14.5);
  [["lapis", "pencil", "R$ 2,00"], ["borracha", "eraser", "R$ 1,50"], ["suco", "juice", "R$ 3,00"], ["maca", "apple", "R$ 0,75"], ["livro", "book", "R$ 8,00"], ["bola", "ball", "R$ 10,00"]].forEach(([im, t, v], i) => {
    const x = 0.75 + i * 1.72;
    K.imgFit(s, im, x, 2.9, 0.7, 0.7);
    txt(s, t, x + 0.75, 2.88, 0.95, 0.34, { fs: 13, bold: true });
    K.pill(s, v, x + 0.72, 3.25, 0.95, 0.36, C.orange, "FFFFFF", 12);
  });
  const col = (x, title, runs, fill) => { K.card(s, x, 4.07, 3.38, 2.66, fill); heading(s, title, x + 0.17, 4.1, 3.1, c, 14.5); rich(s, runs, x + 0.17, 4.55, 3.1, 2.12, 13.5, { valign: "top" }); };
  col(0.6, "Adding money (+)", [BR("pencil + eraser"), B("R$ 2,00 + R$ 1,50 = R$ 3,50", c), BR(""), BR(" ", { fontSize: 6 }), BR("Add the reais, then add the centavos."), "apple + apple: 75 + 75 centavos = 150 centavos = R$ 1,50"], C.mint);
  col(4.13, "Subtracting money (−)", [BR("You have R$ 10,00 and buy a book."), B("R$ 10,00 − R$ 8,00 = R$ 2,00", c), BR(""), BR(" ", { fontSize: 6 }), "Subtract to find what is left."], C.ice);
  col(7.66, "Making change", [B("Change ", c), BR("= the money you give − the price"), BR("A snack costs R$ 3,50, you pay R$ 5,00:"), BR("count up from 3,50"), BR("+ 50 centavos → 4,00"), BR("+ 1 real → 5,00"), B("Change: R$ 1,50", c)], C.butter);
  K.action(s, "move", "Shop game! Put the price cards on objects at home. Dad buys something and pays you with the money cards: count up and give him the right change!", 0.6, 6.86, 10.45, 0.84, C.white, 15);
  K.footer(s);
})();

/* ===================== 17. DUEL 7 ===================== */
(() => {
  const s = K.newSlide("cream"); const c = MC[6];
  K.topbar(s, 7, "", c, { challenge: true });
  K.title(s, "Duel 7: Master Cofre and Moedon", C.coral);
  talk(s, "move", "The final duel! Use the money cards: put the coins on the table, count them out loud and then tick.", "pena", 15.5, 0.8);
  K.card(s, 0.6, 2.45, 5.3, 4.05);
  heading(s, "How much money?", 0.82, 2.5, 4.9, c);
  const row = (i, y, ims, os, ok) => {
    txt(s, `${i + 2}.`, 0.82, y + 0.12, 0.35, 0.4, { fs: 14, bold: true });
    ims.forEach((im, k) => K.imgFit(s, im, 1.15 + k * 0.56, y, im.startsWith("nota") ? 0.62 : 0.52, 0.52));
    opt(s, os[0], 3.55, y + 0.08, 1.2, c, 13, `d7_${i + 1}`, ok === 0); opt(s, os[1], 4.7, y + 0.08, 1.2, c, 13, `d7_${i + 1}`, ok === 1);
  };
  txt(s, "1. 1 real =", 0.82, 2.95, 1.5, 0.4, { fs: 14, bold: true });
  opt(s, "10 centavos", 2.35, 2.95, 1.6, c, 13, "d7_0", 0); opt(s, "100 centavos", 3.95, 2.95, 1.9, c, 13, "d7_0", 1);
  [[["moeda_1", "moeda_50", "moeda_25"], ["R$ 1,75", "R$ 1,50"], 0], [["moeda_25", "moeda_25", "moeda_10", "moeda_5"], ["R$ 0,55", "R$ 0,65"], 1], [["nota_5", "nota_2", "moeda_1"], ["R$ 8,00", "R$ 7,00"], 0]].forEach(([ims, os, ok], i) => row(i, 3.45 + i * 0.72, ims, os, ok));
  txt(s, "5. 25-centavo coins in R$ 1,00:", 0.82, 5.62, 3.4, 0.36, { fs: 13, bold: true });
  opt(s, "4", 4.25, 5.6, 0.8, c, 14, "d7_4", 1); opt(s, "5", 5.05, 5.6, 0.8, c, 14, "d7_4", 0);
  K.card(s, 6.05, 2.45, 5.0, 4.05);
  heading(s, "Shop, add and give change (page 16)", 6.25, 2.5, 4.6, c, 14);
  [["6. pencil + juice =", ["R$ 5,00", "R$ 6,00"], 0], ["7. eraser + apple =", ["R$ 2,15", "R$ 2,25"], 1], ["8. R$ 10,00 − R$ 8,00 =", ["R$ 2,00", "R$ 3,00"], 0],
    ["9. Juice R$ 3,00, you pay R$ 5,00. Change:", ["R$ 8,00", "R$ 2,00"], 1], ["10. Eraser R$ 1,50, you pay R$ 2,00. Change:", ["R$ 0,50", "R$ 1,50"], 0], ["11. Ball R$ 10,00, you pay R$ 20,00. Change:", ["R$ 30,00", "R$ 10,00"], 1]].forEach(([q, os, ok], i) => {
    const y = 2.95 + i * 0.58;
    txt(s, q, 6.25, y, 2.55, 0.5, { fs: 12.5, bold: true, fit: "shrink" });
    opt(s, os[0], 8.75, y + 0.04, 1.17, c, 13, `d7_${i + 5}`, ok === 0); opt(s, os[1], 9.9, y + 0.04, 1.15, c, 13, `d7_${i + 5}`, ok === 1);
  });
  K.reward(s, 0.6, 6.62, "Money Master Badge", 10);
  won(s, 7);
  K.footer(s);
})();

/* ===================== 18. CERTIFICATE ===================== */
(() => {
  const s = K.newSlide("sunny");
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 0.5, w: W - 1.0, h: H - 1.0, fill: { color: "FFFCF4" }, line: { color: C.gold, width: 5 }, rectRadius: 0.2, shadow: K.shadow() });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.72, y: 0.72, w: W - 1.44, h: H - 1.44, fill: { color: "FFFCF4" }, line: { color: C.purple, width: 2 }, rectRadius: 0.16 });
  txt(s, "CONGRATULATIONS, LEGEND MASTER ISABEL!", 0.8, 0.95, W - 1.6, 0.7, { face: FT, fs: 28, bold: true, color: C.purple, align: "center", fit: "shrink" });
  txt(s, "You won all 7 duels and the 7 legendary creatures joined your team!", 0.8, 1.65, W - 1.6, 0.5, { face: FT, fs: 17, bold: true, color: C.grassDk, align: "center", fit: "shrink" });
  LEG.forEach(([im], i) => K.imgFit(s, im, 0.95 + i * 1.42, 2.35, 1.3, 1.45));
  K.img(s, "badge", 5.3, 3.85, 0.9);
  K.card(s, 1.3, 4.9, 9.09, 1.7, C.butter);
  txt(s, "You trained: equal parts and fraction names (halves to tenths), numerator and denominator, fractions of a length, fractions of a set, the calendar, temperature, Brazilian coins and notes, adding and subtracting money and making change.", 1.5, 4.95, 8.7, 1.6, { fs: 16, align: "center" });
  K.pill(s, "★  7/7 BADGES  •  70 CRYSTALS  •  READY FOR NOVEMBER 18!  ★", 2.25, 6.82, 7.2, 0.55, C.purple, "FFFFFF", 14.5);
})();

/* ===================== CARDS (separate file) ===================== */
const pc = new pptxgen();
const KC = createKit(pc, { assetsDir: ASSETS, footerText: FOOT, totalMissions: TOTAL, lang: "en", currency: CUR });
(() => {
  const s = KC.newSlide("white");
  const cs = [["moeda_5", "5 centavos"], ["moeda_10", "10 centavos"], ["moeda_10", "10 centavos"], ["moeda_25", "25 centavos"], ["moeda_25", "25 centavos"], ["moeda_25", "25 centavos"],
    ["moeda_25", "25 centavos"], ["moeda_50", "50 centavos"], ["moeda_50", "50 centavos"], ["moeda_1", "1 real"], ["moeda_1", "1 real"], ["moeda_1", "1 real"]];
  KC.cutCards(s, cs.map(([im, t]) => ({ image: im, text: t, color: C.amber, size: 20 })), { cols: 4, rows: 3, title: "Money cards: coins (Mission 7). Cut along the dotted lines." });
})();
(() => {
  const s = KC.newSlide("white");
  const cs = [["nota_2", "R$ 2,00"], ["nota_2", "R$ 2,00"], ["nota_5", "R$ 5,00"], ["nota_5", "R$ 5,00"], ["nota_10", "R$ 10,00"], ["nota_20", "R$ 20,00"],
    ["lapis", "pencil R$ 2,00"], ["borracha", "eraser R$ 1,50"], ["suco", "juice R$ 3,00"], ["maca", "apple R$ 0,75"], ["livro", "book R$ 8,00"], ["bola", "ball R$ 10,00"]];
  KC.cutCards(s, cs.map(([im, t], i) => ({ image: im, text: t, color: i < 6 ? C.grassDk : C.orange, size: 19 })), { cols: 4, rows: 3, title: "Money cards: notes and shop price tags (Mission 7). Cut along the dotted lines." });
})();
(() => {
  const s = KC.newSlide("white");
  const cs = LEG.map(([im, master, name, topic]) => ({ image: im, text: `${name}\n${topic}`, color: C.purple, size: 18 }));
  cs.push({ image: "badge", text: "LEGEND MASTER ISABEL", color: C.gold, size: 18 });
  KC.cutCards(s, cs, { cols: 4, rows: 2, title: "Legendary cards: Dad gives you one card after each duel you win!" });
})();

K.save(OUT).then(() => { fs.writeFileSync(FIELDS_OUT, JSON.stringify({ W, H, fields: FIELDS }, null, 1)); console.log("campos:", FIELDS.length); return KC.save(OUT_CARDS); });
