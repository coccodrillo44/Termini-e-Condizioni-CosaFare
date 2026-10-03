# CosaFare — Termini e Condizioni di Utilizzo (Sito Web)

Sito web statico, moderno e reattivo, realizzato per la consultazione e pubblicazione online dei **Termini e Condizioni di Utilizzo** dell'applicazione mobile e piattaforma **CosaFare** (Eventi, Sagre e Tradizioni in Toscana).

---

## 🚀 Come visualizzare il sito

Il sito è completamente statico e non richiede l'installazione di librerie o dipendenze server:

1. **Apertura diretta nel browser:**
   - Fai doppio clic sul file [`index.html`](./index.html) per aprirlo direttamente in qualsiasi browser (Google Chrome, Edge, Firefox, Safari).

2. **Anteprima con server locale (opzionale):**
   - Con Python:
     ```bash
     python -m http.server 8000
     ```
     e visita `http://localhost:8000` nel browser.
   - Con Node.js (`npx serve`):
     ```bash
     npx serve .
     ```

---

## 🌟 Funzionalità Principali

- **Design Moderno & Curato:** Ispirato all'identità toscana di *CosaFare*, con una palette cromatica calda, layout pulito e massima leggibilità legale.
- **Indice Interattivo con ScrollSpy:** Navigazione rapida tra tutte le 15 sezioni con evidenziazione automatica della sezione attiva durante lo scorrimento.
- **Ricerca Dinamica nel Testo:** Barra di ricerca istantanea con conteggio delle corrispondenze, pulsanti *precedente/successivo* ed evidenziazione visiva dei termini cercati. Scorciatoia rapida da tastiera: `/` o `Ctrl + K`.
- **Tema Chiaro / Scuro (Dark Mode):** Rilevamento automatico delle preferenze del sistema operativo con interruttore manuale e memorizzazione in `localStorage`.
- **Barra di Avanzamento Lettura:** Indicatore visivo fisso in alto che mostra la percentuale di avanzamento della lettura.
- **Copia Rapida Link Sezione:** Pulsante accanto a ogni titolo di sezione per copiare negli appunti l'URL con ancoraggio diretto (es. `#sec-6`), con notifica toast animata.
- **Stile di Stampa & Esportazione PDF:** Foglio di stile dedicato `@media print` per una stampa pulita e professionale o esportazione in PDF (rimuove barre di navigazione, bottoni ed elementi interattivi).
- **Completamente Responsive:** Ottimizzato per smartphone, tablet e desktop, con cassetto mobile per l'indice.

---

## 📁 Struttura dei File

- [`index.html`](./index.html) — Struttura semantica del documento con tutte le 15 sezioni contrattuali.
- [`style.css`](./style.css) — Foglio di stile CSS moderno con variabili CSS, design responsive e supporto dark/light mode.
- [`script.js`](./script.js) — Logica interattiva (ricerca, scrollspy, copia link, progress bar, dark mode).
- [`termini-e-condizioni.txt`](./termini-e-condizioni.txt) — File originale del testo legale.
