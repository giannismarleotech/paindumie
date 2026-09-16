/* =========================================================
   INSTELLINGEN PAIN DU MIE
   Alles hieronder is ook aanpasbaar via het dashboard (/admin).
   Het blok tussen PDM-DATA-START en PDM-DATA-END is pure JSON:
   laat die twee markeringen staan, anders werkt het dashboard niet meer.

   hours       : per dag ["open","sluit"] of null bij gesloten. 0 = zondag.
   opensOn     : reserveren kan pas vanaf deze datum ("" = meteen open)
   seats       : plaatsen in de zaak; in de lounge kan enkel iets gedronken worden
   durationMinutes : hoelang een tafel bezet blijft na het gekozen uur (voor de
                  beschikbaarheid op de website)
   closedDates : verlofdagen, bv. ["2026-12-25","2027-01-01"]

   boekingenApi : adres van het Google-script waar reservaties en berichten
                  in een Google Sheet bewaard worden en in het dashboard
                  verschijnen. Leeg = enkel per e-mail. Zie LEESMIJ punt 5.
   boekingenKey : het geheime woord dat je in datzelfde script instelde

   FORMULIEREN (reservaties + contact)
   1) Netlify Forms werkt zodra de site op Netlify draait.
   2) Anders gaat het bericht via FormSubmit naar het e-mailadres hieronder.
      FormSubmit stuurt de eerste keer een activatiemail: één keer op
      "Activate Form" klikken.
   3) Lukt ook dat niet, dan krijgt de bezoeker een kant-en-klare e-mail
      en ons telefoonnummer te zien.
   ========================================================= */
window.PDM = /*PDM-DATA-START*/{
  "email": "paindumie.bazel@gmail.com",
  "phone": "+32498482256",
  "phoneLabel": "0498 48 22 56",
  "netlifyForms": false,
  "boekingenApi": "https://script.google.com/macros/s/AKfycbxdSf6yfhA8o8QWH0A4j3iULa2hKJ9iFmVzi9rAW6gR6oxajkWh_eR7kUsE_1cYKoIj/exec",
  "boekingenKey": "paindumie-2026",
  "formEndpoint": "https://formsubmit.co/ajax/paindumie.bazel@gmail.com",
  "links": {
    "google": "",
    "facebook": "https://www.facebook.com/p/PainduMie-Bakkerij-Tearoom-61587728842605/",
    "instagram": ""
  },
  "hours": {
    "0": ["07:00", "18:00"],
    "1": null,
    "2": null,
    "3": ["07:00", "16:00"],
    "4": ["07:00", "16:00"],
    "5": ["07:00", "18:00"],
    "6": ["07:00", "18:00"]
  },
  "reservations": {
    "opensOn": "2026-10-07",
    "firstSlot": "08:00",
    "slotStep": 30,
    "lastSlotBeforeClose": 60,
    "minNoticeMinutes": 60,
    "seats": { "tearoom": 26, "lounge": 8 },
    "durationMinutes": 90,
    "maxPeople": 8,
    "daysAhead": 60,
    "closedDates": []
  }
}/*PDM-DATA-END*/;
