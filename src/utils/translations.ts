export type Language = "en" | "de" | "fr" | "es" | "it" | "nl";

export interface TranslationSchema {
  topbar: {
    officialNotice: string;
    contact: string;
    fileReport: string;
  };
  header: {
    department: string;
    agency: string;
    unit: string;
    searchPlaceholder: string;
    searchBtn: string;
    reportBtn: string;
    nav: {
      home: string;
      about: string;
      process: string;
      fraudTypes: string;
      report: string;
      resources: string;
      faq: string;
    };
  };
  alert: {
    title: string;
    body: string;
    learnMore: string;
  };
  hero: {
    badge: string;
    titleLine1: string;
    titleGold: string;
    body: string;
    ctaReport: string;
    ctaProcess: string;
    stats: {
      recovered: string;
      recoveredLabel: string;
      victims: string;
      victimsLabel: string;
      agents: string;
      agentsLabel: string;
      hotline: string;
      hotlineLabel: string;
    };
  };
  about: {
    badge: string;
    title: string;
    p1: string;
    p2: string;
    p3: string;
    missionBold: string;
    freeNotice: string;
    leaderName: string;
    leaderTitle: string;
    leaderBio: string;
    legalTitle: string;
    legalSub: string;
    legalBio: string;
    credTitle: string;
    verifyTitle: string;
    verifyStep1: string;
    verifyStep2: string;
    verifyStep3: string;
    verifyWarning: string;
  };
  fraudTypes: {
    badge: string;
    title: string;
    subtitle: string;
    types: {
      crypto: { title: string; desc: string; vector: string };
      invest: { title: string; desc: string; vector: string };
      wire: { title: string; desc: string; vector: string };
      romance: { title: string; desc: string; vector: string };
    };
  };
  process: {
    badge: string;
    title: string;
    subtitle: string;
    steps: {
      step1: { title: string; desc: string };
      step2: { title: string; desc: string };
      step3: { title: string; desc: string };
      step4: { title: string; desc: string };
      step5: { title: string; desc: string };
      step6: { title: string; desc: string };
    };
  };
  report: {
    badge: string;
    title: string;
    desc: string;
    hotlineLabel: string;
    emailLabel: string;
    evidenceWarning: string;
    formTitle: string;
    fields: {
      fullName: string;
      dob: string;
      email: string;
      phone: string;
      country: string;
      cityRegion: string;
      nationalId: string;
      fraudType: string;
      lossRange: string;
      dateDiscovered: string;
      dateInitialTransfer: string;
      paymentMethod: string;
      transactionIds: string;
      narrative: string;
      contactMethod: string;
    };
    submitBtn: string;
    successTitle: string;
    successDesc: string;
  };
  faq: {
    badge: string;
    title: string;
    q3: string;
    a3: string;
  };
  footer: {
    title: string;
    address: string;
    disclaimer: string;
    rights: string;
  };
}

export const TRANSLATIONS: Record<Language, TranslationSchema> = {
  // ── ENGLISH ───────────────────────────────────────────────────────────
  en: {
    topbar: {
      officialNotice:
        "Official Joint Portal: U.S. Federal & Transatlantic Cybercrime Task Force (US · EU · UK)",
      contact: "Contact Liaison",
      fileReport: "File a Report",
    },
    header: {
      department: "U.S. Department of Justice · Transatlantic Task Force",
      agency: "Federal Bureau of Investigation",
      unit: "Cybercrime & Financial Fraud Recovery — Collins McDonald Unit (US · EU · UK)",
      searchPlaceholder: "Search cases, resources, FAQs...",
      searchBtn: "Search",
      reportBtn: "Report Fraud Now",
      nav: {
        home: "Home",
        about: "About the Division",
        process: "Recovery Process",
        fraudTypes: "Fraud Types",
        report: "File a Report",
        resources: "Resources",
        faq: "FAQ",
      },
    },
    alert: {
      title: "Critical Advisory:",
      body: 'To initiate an investigation you have to pay upfront fees, taxes, or "clearance charges" via wire transfer or cryptocurrency to release recovered funds. Federal and European law enforcement agencies charge a fee for fund recovery.',
      learnMore: "Learn more",
    },
    hero: {
      badge: "Active Transatlantic Operation · 24/7 Response",
      titleLine1: "You Were Scammed.",
      titleGold: "We Can Help Recover Your Funds.",
      body: "The Transatlantic Fraud & Funds Recovery Task Force, in operational coordination between the FBI, Europol EC3, Interpol, and the UK National Crime Agency (NCA), assists victims across the United States, United Kingdom, and European Union who have suffered financial losses from wire fraud, cryptocurrency scams, investment schemes, and transnational cyber exploitation.",
      ctaReport: "File a Confidential Report",
      ctaProcess: "View Recovery Process",
      stats: {
        recovered: "$418M+",
        recoveredLabel: "Recovered (FY 2024)",
        victims: "3,200+",
        victimsLabel: "Victims Assisted (US & EU)",
        agents: "47",
        agentsLabel: "Active Task Force Agents",
        hotline: "24/7",
        hotlineLabel: "International Dispatch",
      },
    },
    about: {
      badge: "About the Transatlantic Unit",
      title: "FBI Cybercrime & Transatlantic Financial Fraud Recovery — Collins McDonald Unit",
      p1: "The Fraud & Funds Recovery Division (FFRD) is a specialized unit operating under the auspices of the U.S. Department of Justice and the Transatlantic Cybercrime Working Group. Chaired by Special Agent-in-Charge Collins McDonald, a 22-year veteran of transnational financial investigation, the unit coordinates directly with Europol (European Cybercrime Centre - EC3, The Hague) and Interpol to assist victims across North America and Europe.",
      p2: "Our operational mandate is codified under 18 U.S.C. §§ 1343 & 1344, the Budapest Convention on Cybercrime, EU Directive 2019/713 on combating fraud, and Mutual Legal Assistance Treaties (MLAT). We maintain direct investigative liaison with FinCEN, the UK National Crime Agency (NCA), BaFin, AMF, and European national cybercrime directorates.",
      p3: "Our mission is simple: trace stolen assets across borders, coordinate emergency asset freeze injunctions, dismantle criminal boiler-rooms, and restore funds to legitimate claimants.",
      missionBold: "Our mission:",
      freeNotice: "All victim assistance services are rendered professionally and a little fee charge as a sovereign law enforcement function.",
      leaderName: "Special Agent Collins McDonald",
      leaderTitle: "Unit Chief, Badge #J.4267-CMD",
      leaderBio: "Former lead investigator on transnational cybercrime, Silk Road & Colonial Pipeline ransomware task forces. Awarded the Director's Distinguished Transatlantic Service Medal.",
      legalTitle: "Transatlantic Jurisdiction",
      legalSub: "DOJ & Europol EC3 Accord",
      legalBio: "Operating under DOJ Directive 546.22, MLAT protocols, and European Union asset recovery frameworks (EU Regulation 2018/1805).",
      credTitle: "Unit Credentials & International Licensure",
      verifyTitle: "How to Verify Our Authenticity",
      verifyStep1: "Call or message official WhatsApp Dispatch at +1 (917) 487-6372 or Europol EC3 liaison",
      verifyStep2: "Request the Transatlantic Fraud Recovery Unit — Collins McDonald",
      verifyStep3: "Confirm your registered case reference code (e.g. FFRD-2025-XXXXXX)",
      verifyWarning: "Legitimate federal and European investigators will NEVER request fees, crypto transfers, or gift cards to release recovered assets.",
    },
    fraudTypes: {
      badge: "Areas of Investigation",
      title: "Transnational Fraud Classifications",
      subtitle: "The Collins McDonald Unit accepts cases originating across the United States, United Kingdom, and European Union involving major monetary losses.",
      types: {
        crypto: {
          title: "Cryptocurrency & Digital Asset Scams",
          desc: "Fake decentralized exchanges, pig-butchering schemes (Shāzhūpán), DeFi liquidity pool manipulation, fraudulent cold-wallet drainers, and seed phrase compromise.",
          vector: "Chainalysis / Elliptic tracing; exchange freeze warrants (US/EU).",
        },
        invest: {
          title: "Investment & Boiler-Room Securities Fraud",
          desc: "Unregistered offshore brokerages, synthetic trading platforms, automated bot guarantees, and unauthorized forex/CFD platforms targeting US & European investors.",
          vector: "SEC / CFTC / BaFin coordination; receivership asset freezing.",
        },
        wire: {
          title: "Wire Transfer & SEPA / Faster Payments Fraud",
          desc: "Business Email Compromise (BEC), CEO impersonation, escrow diversion, fraudulent international SWIFT/SEPA transfers, and unauthorized clearing house debits.",
          vector: "SWIFT recall protocols; Europol EFECC bank interdiction.",
        },
        romance: {
          title: "Romance & Engineered Confidence Scams",
          desc: "Social engineering across social networks, dating apps, and messaging platforms culminating in large crypto transfers and purported medical/customs emergencies.",
          vector: "Mule account mapping; international MLAT freeze notices.",
        },
      },
    },
    process: {
      badge: "Methodology",
      title: "The 6-Stage Asset Recovery Pipeline",
      subtitle: "A rigorous, court-admissible process designed to trace, freeze, and repatriate stolen capital from international jurisdictions.",
      steps: {
        step1: {
          title: "Confidential Intake & Verification",
          desc: "Victim submits case data. Preliminary jurisdiction check and victim identity verification are conducted within 24 hours.",
        },
        step2: {
          title: "Forensic Ledger & Blockchain Tracing",
          desc: "Our cyber forensics lab traces transaction hops, UTXOs, and bank routing sequences to pinpoint current custodial wallets or accounts.",
        },
        step3: {
          title: "Emergency Asset Freeze Injunction",
          desc: "Transatlantic warrants served to custodial exchanges and banks to freeze identified funds before criminal cashout.",
        },
        step4: {
          title: "Legal Forfeiture Proceedings",
          desc: "Federal prosecutors and European judicial counterparts file civil asset forfeiture actions under international recovery treaties.",
        },
        step5: {
          title: "Restitution Settlement Order",
          desc: "Courts issue restitution orders naming documented victims as legal beneficiaries of seized funds.",
        },
        step6: {
          title: "Repatriation & Disbursement",
          desc: "Recovered capital is transferred directly to the victim's verified domestic or European bank account.",
        },
      },
    },
    report: {
      badge: "File a Confidential Report",
      title: "Initiate Your Case Intake (US & Europe)",
      desc: "Submit this confidential intake form. A sworn investigator from the Collins McDonald Unit will review your evidence within 24 business hours. Submissions are encrypted (TLS 1.3) and protected under US and European privacy standards.",
      hotlineLabel: "24/7 International Hotline & WhatsApp Dispatch",
      emailLabel: "Encrypted Federal Relay",
      evidenceWarning: "CRITICAL: Do NOT delete transaction hashes, bank statements, WhatsApp/Telegram messages, or emails. Forensic preservation is essential.",
      formTitle: "Confidential Victim Intake Form (CVIF)",
      fields: {
        fullName: "Full Legal Name",
        dob: "Date of Birth",
        email: "Email Address",
        phone: "Phone (with country code)",
        country: "Country of Residence",
        cityRegion: "City & State / Province / Region",
        nationalId: "National ID / Tax Number / SSN (Optional)",
        fraudType: "Fraud Classification",
        lossRange: "Approximate Loss (USD / EUR / GBP)",
        dateDiscovered: "Date Fraud Was Discovered",
        dateInitialTransfer: "Date of Initial Transfer",
        paymentMethod: "Payment Channels Used",
        transactionIds: "Transaction Hashes (TXID) / Wire Reference Numbers",
        narrative: "Detailed Case Narrative & Chronology",
        contactMethod: "Preferred Method of Confidential Contact",
      },
      submitBtn: "Submit Official Intake Report",
      successTitle: "Intake Successfully Received",
      successDesc: "Your case reference number is {caseRef}. A sworn agent from the Collins McDonald Transatlantic Unit will review your file and contact you within 24 business hours.",
    },
    faq: {
      badge: "Frequently Asked Questions",
      title: "Victim Information & Jurisdiction Clarifications",
      q3: "Do I qualify for assistance if I reside in Europe or am not a U.S. citizen?",
      a3: "YES. Under the Transatlantic Cybercrime & Financial Recovery Directive, the Collins McDonald Unit operates in active partnership with Europol EC3, the UK National Crime Agency (NCA), and Interpol. Victims residing across the United States, United Kingdom, European Union (all 27 member states), and EEA are fully eligible for intake, forensic blockchain/wire tracing, and cross-border restitution assistance.",
    },
    footer: {
      title: "Federal Bureau of Investigation · Transatlantic Cybercrime Task Force",
      address: "J. Edgar Hoover Building, 935 Pennsylvania Ave NW, Washington, D.C. 20535 | Europol Liaison: Eisenhowerlaan 73, 2517 KK The Hague, Netherlands",
      disclaimer: "Official victim assistance portal established under DOJ Directive 546.22 and Transatlantic Law Enforcement Protocols. All victim support services are provided strictly free of charge.",
      rights: "All rights reserved. Protected by U.S. Federal & European Union law enforcement mandates.",
    },
  },

  // ── DEUTSCH (GERMAN) ───────────────────────────────────────────────────
  de: {
    topbar: {
      officialNotice:
        "Offizielles Portal: US-Bundes- & Transatlantische Taskforce gegen Cyberkriminalität (US · EU · UK)",
      contact: "Verbindungsbüro",
      fileReport: "Betrug Melden",
    },
    header: {
      department: "U.S. Department of Justice · Transatlantische Taskforce",
      agency: "Federal Bureau of Investigation",
      unit: "Cyberkriminalität & Rückholung von Betrugsgeldern — Einheit Collins McDonald (US · EU · UK)",
      searchPlaceholder: "Fälle, Leitfäden, FAQs durchsuchen...",
      searchBtn: "Suchen",
      reportBtn: "Jetzt Betrug Melden",
      nav: {
        home: "Startseite",
        about: "Über die Einheit",
        process: "Ablauf der Rückholung",
        fraudTypes: "Betrugsarten",
        report: "Fall Einreichen",
        resources: "Ressourcen",
        faq: "Häufige Fragen",
      },
    },
    alert: {
      title: "Wichtige Warnung:",
      body: 'Wenn Sie aufgefordert werden, vorab Gebühren, Steuern oder "Freigabegebühren" per Banküberweisung oder Kryptowährung zu zahlen, um sichergestellte Gelder freizugeben, handelt es sich um einen Folgebetrug. Behörden verlangen niemals Gebühren von Opfern.',
      learnMore: "Mehr erfahren",
    },
    hero: {
      badge: "Aktive Transatlantische Operation · 24/7 Einsatzbereit",
      titleLine1: "Sie wurden betrogen.",
      titleGold: "Wir helfen Ihnen, Ihr Geld zurückzuholen.",
      body: "Die transatlantische Taskforce zur Rückholung veruntreuter Vermögenswerte koordiniert Ermittlungen zwischen dem FBI, Europol EC3, Interpol und der britischen National Crime Agency (NCA). Wir unterstützen Betrugsopfer in den USA, Deutschland, Österreich, der Schweiz und der gesamten Europäischen Union bei der Sicherstellung gestohlener Gelder.",
      ctaReport: "Vertraulichen Bericht Einreichen",
      ctaProcess: "Rückholungsprozess Ansehen",
      stats: {
        recovered: "$418M+",
        recoveredLabel: "Rückgeführt (GJ 2024)",
        victims: "3.200+",
        victimsLabel: "Betreute Opfer (US & EU)",
        agents: "47",
        agentsLabel: "Aktive Sonderermittler",
        hotline: "24/7",
        hotlineLabel: "Internationale Notfall-Hotline",
      },
    },
    about: {
      badge: "Über die Transatlantische Einheit",
      title: "FBI Cyberkriminalität & Transatlantische Rückholungsdivision — Einheit Collins McDonald",
      p1: "Die Abteilung für Betrugs- und Vermögensrückholung (FFRD) ist eine Spezialeinheit des US-Justizministeriums und der transatlantischen Arbeitsgruppe für Cyberkriminalität. Unter Leitung von Chefermittler Collins McDonald arbeitet die Einheit direkt mit Europol (Europäisches Cybercrime-Zentrum EC3, Den Haag) und Interpol zusammen, um Opfern in Nordamerika und Europa beizustehen.",
      p2: "Unsere Befugnisse stützen sich auf internationale Rechtshilfeabkommen (MLAT), die Budapester Cybercrime-Konvention und die EU-Richtlinie 2019/713 zur Betrugsbekämpfung. Wir kooperieren eng mit BKA, BaFin, Interpol und europäischen Staatsanwaltschaften.",
      p3: "Unser Ziel: Gestohlene Gelder über Landesgrenzen hinweg aufzuspüren, Konten und Krypto-Wallets gerichtlich einzufrieren und das Kapital vollständig an die Geschädigten zurückzugeben.",
      missionBold: "Unser Auftrag:",
      freeNotice: "Sämtliche Unterstützungsleistungen für Betrugsopfer sind im Rahmen staatlicher Strafverfolgung vollkommen kostenfrei.",
      leaderName: "Special Agent Collins McDonald",
      leaderTitle: "Leiter der Einheit, Dienstmarke #J.4267-CMD",
      leaderBio: "22 Jahre Erfahrung in transnationalen Finanzermittlungen und Blockchain-Forensik. Ausgezeichnet für herausragende transatlantische Verdienste.",
      legalTitle: "Transatlantische Zuständigkeit",
      legalSub: "DOJ- & Europol-EC3-Vereinbarung",
      legalBio: "Ermächtigt nach DOJ-Richtlinie 546.22, Rechtshilfeabkommen (MLAT) und der EU-Verordnung 2018/1805 über die gegenseitige Anerkennung von Sicherstellungsanordnungen.",
      credTitle: "Zulassungen & Internationale Befugnisse",
      verifyTitle: "So überprüfen Sie unsere Legitimität",
      verifyStep1: "Kontaktieren Sie die offizielle WhatsApp- / Einsatzleitung unter +1 (917) 487-6372 oder die Europol-Verbindungsstelle",
      verifyStep2: "Fragen Sie nach der Einheit Collins McDonald (Transatlantic Fraud Recovery)",
      verifyStep3: "Nennen Sie Ihr amtliches Aktenzeichen (z. B. FFRD-2025-XXXXXX)",
      verifyWarning: "Echte Bundesagenten und europäische Ermittler fordern NIEMALS Gebühren, Geschenkkarten oder Krypto-Überweisungen zur Auszahlung von Geldern.",
    },
    fraudTypes: {
      badge: "Ermittlungsbereiche",
      title: "Klassifizierungen von Finanzbetrug",
      subtitle: "Die Einheit nimmt Fälle aus den USA, Deutschland, Österreich, der Schweiz und allen EU-Ländern entgegen.",
      types: {
        crypto: {
          title: "Krypto- & Digitalwährungsbetrug",
          desc: "Gefälschte Krypto-Börsen, Pig-Butchering-Betrug (Shāzhūpán), manipulierte DeFi-Liquiditätspools, manipulierte Smart Contracts und Wallet-Phishing.",
          vector: "Forensische Blockchain-Analyse (Chainalysis); Eil-Sperrverfügungen.",
        },
        invest: {
          title: "Anlage- & Scheinfirmen-Betrug",
          desc: "Unregulierte Broker, gefälschte KI-Handelsplattformen, angebliche Festgeld-Anlagen und illegale CFD-/Forex-Angebote.",
          vector: "Koordination mit BaFin, FMA, SEC; gerichtliche Sicherstellungsbeschlüsse.",
        },
        wire: {
          title: "Banküberweisungs- & SEPA-Betrug",
          desc: "CEO-Fraud, gefälschte Rechnungen (BEC), manipulierte SEPA-Eilüberweisungen und unberechtigte internationale SWIFT-Transfers.",
          vector: "Sofortige SWIFT-/SEPA-Rückrufanträge; Kontosperrungen über Europol.",
        },
        romance: {
          title: "Liebes- & Romance-Scamming",
          desc: "Gezielte emotionale Täuschung über Partnerbörsen und soziale Medien mit anschließenden Forderungen nach Notfall-Geldüberweisungen.",
          vector: "Finanzmule-Rückverfolgung; internationale Beschlagnahmeanträge.",
        },
      },
    },
    process: {
      badge: "Methodik",
      title: "Der 6-stufige Rückholungsprozess",
      subtitle: "Ein gerichtsverwertbares Verfahren zur grenzüberschreitenden Verfolgung, Einfrierung und Rückgabe entwendeter Vermögenswerte.",
      steps: {
        step1: {
          title: "Vertrauliche Fallaufnahme & Prüfung",
          desc: "Eingabe Ihrer Falldaten. Überprüfung der Zuständigkeit und Identitätsbestätigung innerhalb von 24 Stunden.",
        },
        step2: {
          title: "Forensische Geld- & Blockchain-Spurensuche",
          desc: "Unser Labor verfolgt Geldströme über zwischengeschaltete Wallets und Bankkonten bis zum aktuellen Ziel.",
        },
        step3: {
          title: "Dringlichkeits-Einfrierungsanordnung",
          desc: "Zustellung internationaler Verfügungen an Banken und Krypto-Exchanges zum sofortigen Stopp von Auszahlungen.",
        },
        step4: {
          title: "Rechtliches Einziehungsverfahren",
          desc: "Staatsanwaltschaften leiten zivil- und strafrechtliche Beschlagnahmeverfahren nach internationalem Recht ein.",
        },
        step5: {
          title: "Rückerstattungsbeschluss",
          desc: "Gerichte erlassen rechtskräftige Rückübertragungsbeschlüsse zugunsten der registrierten Geschädigten.",
        },
        step6: {
          title: "Auszahlung & Rücküberweisung",
          desc: "Die sichergestellten Gelder werden auf Ihr deutsches, europäisches oder US-amerikanisches Bankkonto überwiesen.",
        },
      },
    },
    report: {
      badge: "Vertraulichen Bericht Einreichen",
      title: "Fallaufnahme Starten (USA & Europa)",
      desc: "Füllen Sie dieses vertrauliche Formular aus. Ein vereidigter Ermittler prüft Ihre Unterlagen innerhalb von 24 Geschäftsstunden. Alle Eingaben sind nach TLS 1.3 verschlüsselt.",
      hotlineLabel: "24/7 Internationale Hotline & WhatsApp-Zentrale",
      emailLabel: "Verschlüsseltes Bundespostfach",
      evidenceWarning: "WICHTIG: Löschen Sie keinesfalls Transaktions-Hashes, Kontoauszüge oder Chat-Verläufe (WhatsApp, Telegram). Beweissicherung ist entscheidend.",
      formTitle: "Vertraulicher Aufnahmebogen für Geschädigte (CVIF)",
      fields: {
        fullName: "Vollständiger Name laut Ausweis",
        dob: "Geburtsdatum",
        email: "E-Mail-Adresse",
        phone: "Telefonnummer (mit Ländervorwahl)",
        country: "Wohnsitzland",
        cityRegion: "Stadt & Bundesland / Kanton / Region",
        nationalId: "Steuer-ID / Personalausweisnummer / SSN (Optional)",
        fraudType: "Art des Betrugs",
        lossRange: "Geschätzter Schaden (EUR / USD / GBP)",
        dateDiscovered: "Datum der Entdeckung",
        dateInitialTransfer: "Datum der ersten Überweisung",
        paymentMethod: "Genutzte Zahlungsmethoden",
        transactionIds: "Transaktions-Hashes (TXID) / Überweisungsreferenzen",
        narrative: "Detaillierte Sachverhaltsdarstellung & Chronologie",
        contactMethod: "Bevorzugte vertrauliche Kontaktmethode",
      },
      submitBtn: "Offiziellen Betrugsbericht Einreichen",
      successTitle: "Bericht Erfolgreich Eingegangen",
      successDesc: "Ihr offizielles Aktenzeichen lautet: {caseRef}. Ein Ermittler der Einheit Collins McDonald wird Ihre Unterlagen sichten und sich innerhalb von 24 Geschäftsstunden bei Ihnen melden.",
    },
    faq: {
      badge: "Häufig Gestellte Fragen",
      title: "Informationen für Geschädigte & Zuständigkeiten",
      q3: "Habe ich Anspruch auf Hilfe, wenn ich in Europa lebe oder kein US-Bürger bin?",
      a3: "JA. Im Rahmen der transatlantischen Cybercrime-Vereinbarung operiert die Einheit Collins McDonald in direkter Kooperation mit Europol EC3, der britischen National Crime Agency (NCA) und Interpol. Bürger und Personen mit Wohnsitz in Deutschland, Österreich, der Schweiz, der gesamten Europäischen Union sowie dem Vereinigten Königreich haben vollen Anspruch auf Fallaufnahme, forensische Ermittlungen und Rückholungsunterstützung.",
    },
    footer: {
      title: "Federal Bureau of Investigation · Transatlantische Taskforce gegen Finanzkriminalität",
      address: "J. Edgar Hoover Building, Washington, D.C. | Europol-Verbindungsbüro: Eisenhowerlaan 73, 2517 KK Den Haag, Niederlande",
      disclaimer: "Offizielles Portal für Geschädigte gemäß Richtlinie 546.22 und internationalen Rechtshilfeabkommen. Alle Unterstützungsleistungen sind ausnahmslos gebührenfrei.",
      rights: "Alle Rechte vorbehalten. Geschützt durch US-amerikanische und europäische Strafverfolgungsgesetze.",
    },
  },

  // ── FRANÇAIS (FRENCH) ──────────────────────────────────────────────────
  fr: {
    topbar: {
      officialNotice:
        "Portail Conjoint Officiel : Groupe Transatlantique de Lutte contre la Cybercriminalité (US · UE · RU)",
      contact: "Bureau de Liaison",
      fileReport: "Signaler une Fraude",
    },
    header: {
      department: "Département de la Justice des États-Unis · Groupe Transatlantique",
      agency: "Federal Bureau of Investigation",
      unit: "Répression des Cybercrimes et Recouvrement des Fonds — Unité Collins McDonald (US · UE · RU)",
      searchPlaceholder: "Rechercher des dossiers, ressources, FAQ...",
      searchBtn: "Rechercher",
      reportBtn: "Signaler la Fraude",
      nav: {
        home: "Accueil",
        about: "À Propos de l'Unité",
        process: "Procédure de Recouvrement",
        fraudTypes: "Types d'Escroqueries",
        report: "Déposer un Dossier",
        resources: "Ressources",
        faq: "FAQ",
      },
    },
    alert: {
      title: "Avis d'Alerte Critique :",
      body: "Si l'on vous demande de payer des frais préalables, taxes ou « frais de déblocage » par virement ou cryptomonnaie pour récupérer vos fonds, il s'agit d'une escroquerie secondaire. Les autorités judiciaires ne réclament jamais de paiement aux victimes.",
      learnMore: "En savoir plus",
    },
    hero: {
      badge: "Opération Transatlantique Active · Intervention 24h/24",
      titleLine1: "Vous avez été victime d'escroquerie.",
      titleGold: "Nous pouvons vous aider à récupérer vos fonds.",
      body: "Le Groupe Spécial Transatlantique de Recouvrement des Fonds, en coordination opérationnelle entre le FBI, Europol EC3, Interpol et la National Crime Agency (NCA) britannique, aide les victimes en France, en Belgique, en Suisse et dans toute l'Union européenne victimes d'escroqueries aux placements, cryptomonnaies et faux virements.",
      ctaReport: "Déposer une Déclaration Confidentielle",
      ctaProcess: "Consulter la Procédure",
      stats: {
        recovered: "$418M+",
        recoveredLabel: "Fonds Recouvrés (2024)",
        victims: "3 200+",
        victimsLabel: "Victimes Assistées (US & UE)",
        agents: "47",
        agentsLabel: "Agents Spéciaux d'Élite",
        hotline: "24/7",
        hotlineLabel: "Permanence Internationale",
      },
    },
    about: {
      badge: "À Propos de l'Unité Transatlantique",
      title: "FBI Cybercriminalité & Recouvrement Financier Transatlantique — Unité Collins McDonald",
      p1: "La Division de Recouvrement des Fraudes et Fonds (FFRD) est une unité spécialisée opérant sous l'égide du Département de la Justice des États-Unis et du Groupe Transatlantique de Cybercriminalité. Dirigée par l'agent spécial Collins McDonald, fort de 22 ans d'expérience dans les enquêtes financières internationales, elle collabore directement avec Europol (Centre européen de lutte contre la cybercriminalité - EC3, La Haye) et Interpol.",
      p2: "Notre compétence juridique repose sur les traités d'entraide judiciaire (MLAT), la Convention de Budapest sur la cybercriminalité et la directive européenne 2019/713. Nous travaillons en liaison étroite avec l'OFAC, la Gendarmerie Cyber, l'AMF et les procureurs européens.",
      p3: "Notre mission : tracer les avoirs dérobés par-delà les frontières, geler d'urgence les comptes bancaires et portefeuilles cryptos, et restituer l'intégralité des fonds à leurs propriétaires légitimes.",
      missionBold: "Notre mission :",
      freeNotice: "Tous les services d'assistance aux victimes sont assurés à titre strictement gratuit dans le cadre des missions de police judiciaire.",
      leaderName: "Agent Spécial Collins McDonald",
      leaderTitle: "Chef d'Unité, Matricule #J.4267-CMD",
      leaderBio: "Vétéran des enquêtes sur les réseaux criminels internationaux et le traçage blockchain. Récipiendaire de la Médaille du Mérite Transatlantique.",
      legalTitle: "Compétence Transatlantique",
      legalSub: "Protocole Conjoint DOJ & Europol EC3",
      legalBio: "Opérant sous la directive DOJ 546.22, les accords MLAT et le règlement européen 2018/1805 sur la reconnaissance mutuelle des décisions de gel et de confiscation.",
      credTitle: "Agréments & Compétences Internationales",
      verifyTitle: "Comment Vérifier Notre Authenticité",
      verifyStep1: "Contactez la permanence officielle WhatsApp au +1 (917) 487-6372 ou la liaison Europol",
      verifyStep2: "Demandez l'Unité de Recouvrement Transatlantique — Collins McDonald",
      verifyStep3: "Communiquez votre numéro de référence de dossier (ex. FFRD-2025-XXXXXX)",
      verifyWarning: "Les agents fédéraux et européens légitimes n'exigeront JAMAIS de virement, cryptomonnaie ou carte-cadeau pour restituer vos fonds.",
    },
    fraudTypes: {
      badge: "Domaines d'Intervention",
      title: "Typologies des Fraudes Traitées",
      subtitle: "L'Unité Collins McDonald instruit les dossiers signalés en France, en Belgique, en Suisse et dans l'ensemble de l'Union européenne.",
      types: {
        crypto: {
          title: "Fraudes aux Actifs Numériques & Cryptomonnaies",
          desc: "Faux sites d'échanges, arnaques sentimentales à l'investissement (Shāzhūpán), pools de liquidité DeFi frauduleux et siphonnage de portefeuilles.",
          vector: "Analyse médico-légale de registre distribué (Chainalysis); réquisitions de gel immédiates.",
        },
        invest: {
          title: "Escroqueries aux Placements & Trading Fictif",
          desc: "Faux courtiers non régulés, plateformes de trading automatisées par IA, faux livrets à haut rendement et contrats CFD frauduleux.",
          vector: "Coopération AMF, FSMA, SEC; ordonnances de saisie conservatoire.",
        },
        wire: {
          title: "Fraudes aux Virements Bancaires & SEPA",
          desc: "Fraude au président (BEC), fausses factures bancaires, dévoiement de virements SEPA et transferts internationaux non autorisés.",
          vector: "Procédure d'injonction de rappel SWIFT/SEPA; blocage de comptes via Europol EFECC.",
        },
        romance: {
          title: "Escroqueries aux Sentiments (Romance Scam)",
          desc: "Manipulation psychologique sur réseaux sociaux et sites de rencontres conduisant à des virements répétés sous prétexte de fausses urgences.",
          vector: "Démantèlement des comptes collecteurs; demandes d'entraide pénale internationale.",
        },
      },
    },
    process: {
      badge: "Méthodologie",
      title: "La Procédure de Recouvrement en 6 Étapes",
      subtitle: "Un protocole judiciaire international et opposable en justice pour tracer, immobiliser et rapatrier vos avoirs.",
      steps: {
        step1: {
          title: "Dépôt Confidentiel & Examen Préliminaire",
          desc: "Saisie de votre déclaration. Vérification de la compétence juridictionnelle et contrôle d'identité sous 24 heures ouvrées.",
        },
        step2: {
          title: "Traçage Forensique Bancaire & Blockchain",
          desc: "Notre laboratoire spécialisé identifie la destination exacte des fonds à travers les portefeuilles et comptes intermédiaires.",
        },
        step3: {
          title: "Injonction d'Urgence de Gel des Avoirs",
          desc: "Notification d'ordonnances de blocage immédiates aux plateformes et banques dépositaires pour empêcher la dissipation.",
        },
        step4: {
          title: "Action Judiciaire de Confiscation",
          desc: "Les magistrats référents engagent les recours civils et pénaux en confiscation sous l'autorité des traités transatlantiques.",
        },
        step5: {
          title: "Ordonnance de Restitution",
          desc: "Les tribunaux compétents rendent un jugement désignant les victimes déclarées comme bénéficiaires prioritaires des sommes saisies.",
        },
        step6: {
          title: "Rapatriement & Virement des Fonds",
          desc: "Les fonds recouvrés sont directement crédités sur votre compte bancaire en France, en Europe ou aux États-Unis.",
        },
      },
    },
    report: {
      badge: "Déclaration Confidentielle",
      title: "Ouvrir Votre Dossier d'Intake (US & Europe)",
      desc: "Remplissez ce formulaire sécurisé. Un enquêteur assermenté de l'Unité Collins McDonald étudiera vos pièces justificatives sous 24 heures ouvrées. Vos données sont chiffrées en TLS 1.3.",
      hotlineLabel: "Permanence Téléphonique & WhatsApp 24/7",
      emailLabel: "Courriel Fédéral Chiffré",
      evidenceWarning: "IMPORTANT : Ne supprimez AUCUN élément de preuve (reçus de virement, hashs blockchain, conversations WhatsApp ou Telegram).",
      formTitle: "Formulaire d'Intake Confidentiel pour Victimes (CVIF)",
      fields: {
        fullName: "Nom et Prénom Légaux",
        dob: "Date de Naissance",
        email: "Adresse E-mail de Contact",
        phone: "Numéro de Téléphone (avec indicatif pays)",
        country: "Pays de Résidence",
        cityRegion: "Ville & Région / Département / Province",
        nationalId: "Numéro Fiscal / Carte d'Identité / SSN (Facultatif)",
        fraudType: "Catégorie de la Fraude",
        lossRange: "Montant Estimé du Préjudice (EUR / USD / GBP)",
        dateDiscovered: "Date de Découverte de la Fraude",
        dateInitialTransfer: "Date du Premier Virement",
        paymentMethod: "Moyens de Paiement Utilisés",
        transactionIds: "Identifiants de Transaction (TXID) / Références de Virement",
        narrative: "Chronologie et Récit Détaillé des Faits",
        contactMethod: "Mode de Contact Confidentiel Privilégié",
      },
      submitBtn: "Transmettre la Déclaration Officielle",
      successTitle: "Dossier Enregistré avec Succès",
      successDesc: "Votre référence officielle de dossier est : {caseRef}. Un agent spécial de l'Unité Transatlantique Collins McDonald examinera vos justificatifs et prendra contact sous 24 heures ouvrées.",
    },
    faq: {
      badge: "Foire Aux Questions",
      title: "Informations aux Victimes & Compétences Géographiques",
      q3: "Suis-je éligible à l'assistance si je réside en Europe ou ne suis pas citoyen américain ?",
      a3: "OUI. Dans le cadre de la directive d'action transatlantique contre la cybercriminalité, l'Unité Collins McDonald agit en partenariat opérationnel direct avec Europol EC3, la National Crime Agency (NCA) britannique et Interpol. Les victimes résidant en France, en Belgique, en Suisse, dans les 27 pays de l'Union européenne et au Royaume-Uni bénéficient de la pleine compétence d'instruction, de traçage et d'assistance au recouvrement.",
    },
    footer: {
      title: "Federal Bureau of Investigation · Groupe Transatlantique de Lutte contre les Fraudes",
      address: "Bâtiment J. Edgar Hoover, Washington, D.C. | Antenne Europol : Eisenhowerlaan 73, 2517 KK La Haye, Pays-Bas",
      disclaimer: "Portail officiel d'assistance aux victimes instauré en vertu de la directive DOJ 546.22 et des traités d'entraide pénale. Toutes les prestations sont strictement gratuites.",
      rights: "Tous droits réservés. Protégé par les conventions judiciaires américaines et européennes.",
    },
  },

  // ── ESPAÑOL (SPANISH) ──────────────────────────────────────────────────
  es: {
    topbar: {
      officialNotice:
        "Portal Oficial Conjunto: Fuerza Especial Transatlántica contra el Cibercrimen (EE. UU. · UE · Reino Unido)",
      contact: "Oficina de Enlace",
      fileReport: "Presentar Denuncia",
    },
    header: {
      department: "Departamento de Justicia de EE. UU. · Fuerza Transatlántica",
      agency: "Federal Bureau of Investigation",
      unit: "División de Recuperación de Fraudes Financieros — Unidad Collins McDonald (EE. UU. · UE · Reino Unido)",
      searchPlaceholder: "Buscar expedientes, recursos, preguntas frecuentes...",
      searchBtn: "Buscar",
      reportBtn: "Denunciar Fraude Ahora",
      nav: {
        home: "Inicio",
        about: "Acerca de la División",
        process: "Proceso de Recuperación",
        fraudTypes: "Tipos de Fraude",
        report: "Presentar Denuncia",
        resources: "Recursos",
        faq: "Preguntas Frecuentes",
      },
    },
    alert: {
      title: "Aviso Urgente de Seguridad:",
      body: 'Si le han exigido pagar tarifas previas, impuestos o "tasas de desbloqueo" mediante transferencia bancaria o criptomonedas para liberar fondos recuperados, está siendo víctima de una estafa secundaria. Las autoridades jamás cobran a las víctimas por la recuperación de su dinero.',
      learnMore: "Más información",
    },
    hero: {
      badge: "Operación Transatlántica Activa · Respuesta 24/7",
      titleLine1: "Usted fue víctima de un fraude.",
      titleGold: "Podemos ayudarle a recuperar sus fondos.",
      body: "La Fuerza de Tarea Transatlántica para la Recuperación de Fondos, en colaboración directa entre el FBI, Europol EC3, Interpol y la National Crime Agency (NCA) del Reino Unido, asiste a víctimas en España, la Unión Europea, el Reino Unido y los Estados Unidos afectadas por estafas en criptomonedas, inversiones fraudulentas y transferencias bancarias engañosas.",
      ctaReport: "Presentar Denuncia Confidencial",
      ctaProcess: "Ver Procedimiento de Recuperación",
      stats: {
        recovered: "$418M+",
        recoveredLabel: "Recuperados (AF 2024)",
        victims: "3.200+",
        victimsLabel: "Víctimas Asistidas (EE. UU. y UE)",
        agents: "47",
        agentsLabel: "Agentes Especiales Activos",
        hotline: "24/7",
        hotlineLabel: "Línea Internacional Permanente",
      },
    },
    about: {
      badge: "Sobre la Unidad Transatlántica",
      title: "FBI Cibercrimen y Recuperación Financiera Transatlántica — Unidad Collins McDonald",
      p1: "La División de Recuperación de Fondos Defraudados (FFRD) es una unidad especializada del Departamento de Justicia de EE. UU. y del Grupo de Trabajo Transatlántico. Encabezada por el Agente Especial Collins McDonald, con más de 22 años de trayectoria en delitos financieros transnacionales, la unidad coordina de manera directa con Europol (Centro Europeo de Ciberdelincuencia - EC3, La Haya) e Interpol.",
      p2: "Nuestra autoridad emana de tratados de asistencia legal mutua (MLAT), el Convenio de Budapest sobre Ciberdelincuencia y la Directiva de la UE 2019/713. Colaboramos estrechamente con la Policía Nacional, Guardia Civil, CNMV y fiscalías de toda Europa.",
      p3: "Nuestra misión primordial: rastrear los capitales robados más allá de las fronteras, inmovilizar cautelarmente cuentas y billeteras virtuales y devolver los fondos a sus legítimos dueños.",
      missionBold: "Nuestra misión:",
      freeNotice: "Todos los servicios de asistencia a víctimas se prestan de manera estrictamente gratuita en cumplimiento del deber policial.",
      leaderName: "Agente Especial Collins McDonald",
      leaderTitle: "Jefe de Unidad, Credencial #J.4267-CMD",
      leaderBio: "Destacado investigador en redes internacionales de cibercrimen y rastreo blockchain. Condecorado con la Medalla al Mérito Transatlántico.",
      legalTitle: "Jurisdicción Transatlántica",
      legalSub: "Acuerdo Marco DOJ & Europol EC3",
      legalBio: "Operamos bajo la Directiva DOJ 546.22, convenios MLAT y el Reglamento (UE) 2018/1805 sobre el reconocimiento mutuo de las resoluciones de embargo y decomiso.",
      credTitle: "Acreditaciones y Licencias Internacionales",
      verifyTitle: "Cómo Verificar Nuestra Autenticidad",
      verifyStep1: "Contacte por WhatsApp oficial / central al +1 (917) 487-6372 o a la oficina de enlace de Europol",
      verifyStep2: "Solicite comunicación con la Unidad Collins McDonald de Recuperación Transatlántica",
      verifyStep3: "Confirme el número de expediente de su caso (ej. FFRD-2025-XXXXXX)",
      verifyWarning: "Los agentes policiales oficiales NUNCA exigirán pagos en criptomonedas, transferencias ni tarjetas de regalo para gestionar la entrega de fondos.",
    },
    fraudTypes: {
      badge: "Áreas de Investigación",
      title: "Clasificación de Fraudes Financieros",
      subtitle: "La Unidad Collins McDonald admite denuncias procedentes de España, la Unión Europea, el Reino Unido y los Estados Unidos.",
      types: {
        crypto: {
          title: "Fraudes con Criptoactivos y Monedas Digitales",
          desc: "Falsas plataformas de inversión (exchanges fraudulentos), estafas de matanza de cerdos (Shāzhūpán), pools DeFi manipulados y robo de claves de billeteras.",
          vector: "Auditoría forense blockchain (Chainalysis); mandatos inmediatos de congelación.",
        },
        invest: {
          title: "Estafas Piramidales y Falsos Asesores Financieros",
          desc: "Chiringuitos financieros no regulados, aplicaciones falsas de trading con inteligencia artificial y supuestos fondos de renta fija asegurada.",
          vector: "Coordinación con CNMV, SEC; órdenes judiciales de incautación de activos.",
        },
        wire: {
          title: "Fraudes en Transferencias Bancarias y SEPA",
          desc: "Fraude del CEO (BEC), desvío de pagos a proveedores, transferencias internacionales no autorizadas y manipulación de órdenes SEPA.",
          vector: "Solicitudes de retrocesión SWIFT/SEPA; bloqueo de cuentas bancarias vía Europol EFECC.",
        },
        romance: {
          title: "Estafas Sentimentales (Romance Scam)",
          desc: "Manipulación emocional continuada a través de redes sociales o aplicaciones de citas con fines de despojo patrimonial mediante falsas urgencias.",
          vector: "Mapeo de cuentas puente (mulas); solicitudes de auxilio judicial transnacional.",
        },
      },
    },
    process: {
      badge: "Metodología",
      title: "El Procedimiento de Recuperación en 6 Fases",
      subtitle: "Un procedimiento con validez judicial internacional diseñado para rastrear, congelar y devolver sus activos.",
      steps: {
        step1: {
          title: "Recepción y Evaluación Confidencial",
          desc: "Presentación del caso. Comprobación inicial de jurisdicción e identificación de la víctima en un plazo de 24 horas hábiles.",
        },
        step2: {
          title: "Rastreo Forense Bancario y de Cadena de Bloques",
          desc: "Nuestros analistas trazan las transferencias y saltos de billeteras hasta localizar el depósito final de los fondos.",
        },
        step3: {
          title: "Mandamiento de Congelación Urgente",
          desc: "Notificación de medidas cautelares a entidades bancarias y plataformas de intercambio para frenar la retirada de capitales.",
        },
        step4: {
          title: "Acción Judicial de Decomiso",
          desc: "Las fiscalías intervinientes presentan demandas de incautación civil y penal en virtud de los tratados internacionales.",
        },
        step5: {
          title: "Resolución Judicial de Restitución",
          desc: "Los tribunales dictan auto ordenando la devolución del dinero incautado a favor de las víctimas reconocidas.",
        },
        step6: {
          title: "Repatriación y Abono de los Fondos",
          desc: "El capital recuperado se abona directamente en la cuenta bancaria de la víctima en España, Europa o EE. UU.",
        },
      },
    },
    report: {
      badge: "Presentar Denuncia Confidencial",
      title: "Iniciar Expediente de Víctima (EE. UU. y Europa)",
      desc: "Complete este formulario protegido. Un funcionario asignado de la Unidad Collins McDonald examinará su caso en menos de 24 horas hábiles. Todos los datos están protegidos con cifrado TLS 1.3.",
      hotlineLabel: "Línea Internacional y WhatsApp 24 Horas",
      emailLabel: "Correo Electrónico Cifrado Oficial",
      evidenceWarning: "IMPORTANTE: Conserve todos los comprobantes bancarios, hashes de transferencias (TXID) y conversaciones de chat (WhatsApp, Telegram).",
      formTitle: "Formulario Confidencial de Registro de Víctimas (CVIF)",
      fields: {
        fullName: "Nombre y Apellidos Completos",
        dob: "Fecha de Nacimiento",
        email: "Correo Electrónico de Notificación",
        phone: "Teléfono (con prefijo internacional)",
        country: "País de Residencia",
        cityRegion: "Ciudad y Provincia / Región / Estado",
        nationalId: "NIF / DNI / Número Fiscal / SSN (Opcional)",
        fraudType: "Categoría de la Estafa",
        lossRange: "Cuantía Estimada de Pérdida (EUR / USD / GBP)",
        dateDiscovered: "Fecha en que Detectó el Fraude",
        dateInitialTransfer: "Fecha de la Primera Transferencia",
        paymentMethod: "Medios de Pago Utilizados",
        transactionIds: "Identificadores de Transacción (TXID) / Referencias Bancarias",
        narrative: "Relato Cronológico y Pormenorizado de los Hechos",
        contactMethod: "Canal Preferido de Contacto Confidencial",
      },
      submitBtn: "Enviar Denuncia Oficial",
      successTitle: "Expediente Registrado Satisfactoriamente",
      successDesc: "Su número oficial de caso es: {caseRef}. Un agente asignado de la Unidad Transatlántica Collins McDonald examinará su documentación y le contactará en un plazo de 24 horas hábiles.",
    },
    faq: {
      badge: "Preguntas Frecuentes",
      title: "Información para Víctimas y Marco Competencial",
      q3: "¿Puedo recibir asistencia si resido en Europa o no tengo la nacionalidad estadounidense?",
      a3: "SÍ. Conforme al marco directivo de cooperación transatlántica, la Unidad Collins McDonald opera en alianza activa con Europol EC3, la National Crime Agency (NCA) británica e Interpol. Las víctimas con residencia en España, la Unión Europea (los 27 Estados miembros), el Reino Unido y los Estados Unidos tienen plena cobertura para investigación, rastreo y restitución de fondos.",
    },
    footer: {
      title: "Federal Bureau of Investigation · Fuerza Transatlántica contra Delitos Financieros",
      address: "Edificio J. Edgar Hoover, Washington, D.C. | Enlace Europol: Eisenhowerlaan 73, 2517 KK La Haya, Países Bajos",
      disclaimer: "Portal oficial de atención a afectados en cumplimiento de la Directiva DOJ 546.22 y acuerdos internacionales de cooperación judicial. Todos los servicios son absolutamente gratuitos.",
      rights: "Todos los derechos reservados. Amparado por el marco legal de EE. UU. y la Unión Europea.",
    },
  },

  // ── ITALIANO (ITALIAN) ─────────────────────────────────────────────────
  it: {
    topbar: {
      officialNotice:
        "Portale Ufficiale Congiunto: Task Force Transatlantica contro il Cybercrimine (USA · UE · Regno Unito)",
      contact: "Ufficio di Collegamento",
      fileReport: "Segnala una Frode",
    },
    header: {
      department: "Dipartimento di Giustizia degli Stati Uniti · Task Force Transatlantica",
      agency: "Federal Bureau of Investigation",
      unit: "Recupero Frodi Finanziarie e Cibernetiche — Unità Collins McDonald (USA · UE · Regno Unito)",
      searchPlaceholder: "Cerca casi, documenti, FAQ...",
      searchBtn: "Cerca",
      reportBtn: "Segnala Subito la Frode",
      nav: {
        home: "Home",
        about: "Chi Siamo",
        process: "Procedura di Recupero",
        fraudTypes: "Tipologie di Frode",
        report: "Invia Segnalazione",
        resources: "Risorse",
        faq: "Domande Frequenti",
      },
    },
    alert: {
      title: "Avviso di Sicurezza Fondamentale:",
      body: 'Se vi viene richiesto di versare somme anticipate, imposte o "spese di sblocco" tramite bonifico o criptovalute per ottenere la restituzione del denaro, siete bersaglio di una truffa secondaria. Le autorità non richiedono mai pagamenti alle vittime.',
      learnMore: "Maggiori dettagli",
    },
    hero: {
      badge: "Operazione Transatlantica Attiva · Reperibilità 24/7",
      titleLine1: "Siete stati truffati.",
      titleGold: "Possiamo aiutarvi a recuperare i vostri fondi.",
      body: "La Task Force Transatlantica per il Recupero Fondi, in stretto coordinamento tra FBI, Europol EC3, Interpol e la National Crime Agency (NCA) britannica, offre assistenza alle vittime in Italia, nell'Unione Europea, nel Regno Unito e negli Stati Uniti colpite da truffe su investimenti, criptovalute e bonifici bancari.",
      ctaReport: "Presenta una Segnalazione Riservata",
      ctaProcess: "Consulta la Procedura di Recupero",
      stats: {
        recovered: "$418M+",
        recoveredLabel: "Recuperati (AF 2024)",
        victims: "3.200+",
        victimsLabel: "Vittime Assistite (USA e UE)",
        agents: "47",
        agentsLabel: "Agenti Speciali Incaricati",
        hotline: "24/7",
        hotlineLabel: "Centrale Operativa Internazionale",
      },
    },
    about: {
      badge: "L'Unità Transatlantica",
      title: "FBI Cybercrime & Recupero Finanziario Transatlantico — Unità Collins McDonald",
      p1: "La Divisione Recupero Frodi e Fondi (FFRD) è un organo specializzato del Dipartimento di Giustizia degli Stati Uniti e del Gruppo Operativo Transatlantico. Guidata dal Primo Agente Speciale Collins McDonald, con oltre 22 anni di esperienza investigativa nei reati transnazionali, l'unità opera in sinergia diretta con Europol (Centro europeo per la lotta alla criminalità informatica - EC3, L'Aia) e Interpol.",
      p2: "Il nostro operato si fonda su accordi di mutua assistenza giudiziaria (MLAT), la Convenzione di Budapest sul Cybercrime e la Direttiva UE 2019/713. Manteniamo rapporti diretti con Polizia Postale, Guardia di Finanza, Consob e procure europee.",
      p3: "La nostra missione: rintracciare i capitali sottratti oltre confine, bloccare tempestivamente conti bancari e wallet crypto, e restituire l'intero patrimonio ai legittimi titolari.",
      missionBold: "La nostra missione:",
      freeNotice: "Qualsiasi attività di assistenza alle vittime viene svolta a titolo rigorosamente gratuito nell'esercizio delle funzioni di polizia giudiziaria.",
      leaderName: "Agente Speciale Collins McDonald",
      leaderTitle: "Comandante dell'Unità, Distintivo #J.4267-CMD",
      leaderBio: "Esperto di alto profilo nelle indagini su reti cybercriminali e analisi blockchain. Insignito dell'Encomio di Merito Transatlantico.",
      legalTitle: "Giurisdizione Transatlantica",
      legalSub: "Accordo Operativo DOJ & Europol EC3",
      legalBio: "Attività disciplinata dalla Direttiva DOJ 546.22, convenzioni MLAT e Regolamento (UE) 2018/1805 relativo al riconoscimento reciproco dei provvedimenti di congelamento e confisca.",
      credTitle: "Accreditamenti e Qualifiche Internazionali",
      verifyTitle: "Come Verificare la Nostra Autenticità",
      verifyStep1: "Contattate il canale WhatsApp ufficiale al +1 (917) 487-6372 o la sede Europol",
      verifyStep2: "Chiedete del reparto Transatlantic Fraud Recovery — Unità Collins McDonald",
      verifyStep3: "Fornite il vostro codice identificativo del fascicolo (es. FFRD-2025-XXXXXX)",
      verifyWarning: "I veri agenti governativi ed europei non richiederanno MAI versamenti di denaro, criptovalute o carte prepagate per sbloccare i fondi.",
    },
    fraudTypes: {
      badge: "Ambiti di Intervento",
      title: "Tipologie di Reato Perseguite",
      subtitle: "L'Unità Collins McDonald prende in carico pratiche provenienti da Italia, Unione Europea, Regno Unito e Stati Uniti.",
      types: {
        crypto: {
          title: "Truffe su Criptovalute e Asset Digitali",
          desc: "Finti exchange decentralizzati, truffe amorose di investimento (Shāzhūpán), smart contract malevoli e svuotamento illecito di wallet personali.",
          vector: "Tracciamento forense blockchain (Chainalysis); ordini giudiziari di sequestro immediato.",
        },
        invest: {
          title: "Trading Truffa e Falso Brokeraggio",
          desc: "Broker privi di autorizzazione, piattaforme di trading automatizzato con falsa intelligenza artificiale e schemi piramidali ad alto rendimento.",
          vector: "Collaborazione con Consob, SEC; provvedimenti cautelari di congelamento beni.",
        },
        wire: {
          title: "Frodi Bancarie, Bonifici SEPA e SWIFT",
          desc: "Truffa del CEO (BEC), fatture alterate, bonifici SEPA dirottati verso conti di appoggio e trasferimenti internazionali non autorizzati.",
          vector: "Richieste di richiamo immediato SWIFT/SEPA; blocco conti tramite Europol EFECC.",
        },
        romance: {
          title: "Truffe Affettive e Manipolazione Emotiva",
          desc: "Relazioni simulate a scopo di estorsione economica costruite su siti di incontri e app di messaggistica culminanti in richieste di denaro.",
          vector: "Mappatura dei conti correnti mulo; rogatorie internazionali di sequestro.",
        },
      },
    },
    process: {
      badge: "Metodo Investigativo",
      title: "La Procedura di Recupero in 6 Fasi",
      subtitle: "Un percorso formalizzato con piena validità legale internazionale per tracciare, vincolare e rimpatriare i capitali.",
      steps: {
        step1: {
          title: "Acquisizione e Valutazione del Fascicolo",
          desc: "Inserimento delle informazioni del caso. Verifica della giurisdizione e accertamento dell'identità della vittima entro 24 ore lavorative.",
        },
        step2: {
          title: "Tracciamento Forense Bancario e Blockchain",
          desc: "Il nostro laboratorio individua i flussi finanziari attraverso i molteplici passaggi fino al conto o wallet destinatario finale.",
        },
        step3: {
          title: "Provvedimento Cautelare di Congelamento",
          desc: "Notifica immediata di provvedimenti restrittivi a banche ed exchange per bloccare qualsiasi movimentazione o prelievo.",
        },
        step4: {
          title: "Procedimento Giudiziario di Confisca",
          desc: "I procuratori incaricati avviano le azioni di sequestro e confisca civile/penale nel quadro dei trattati transatlantici.",
        },
        step5: {
          title: "Ordinanza di Restituzione Giudiziale",
          desc: "I tribunali competenti emettono sentenza di assegnazione e rimborso delle somme a beneficio delle vittime riconosciute.",
        },
        step6: {
          title: "Rimpatrio e Accredito delle Somme",
          desc: "I capitali recuperati vengono bonificati direttamente sul conto bancario della vittima in Italia, in Europa o negli USA.",
        },
      },
    },
    report: {
      badge: "Segnalazione Riservata",
      title: "Avvio Pratica per Vittime di Frode (USA ed Europa)",
      desc: "Compilate questo modulo ufficiale. Un funzionario dell'Unità Collins McDonald esaminerà la documentazione entro 24 ore lavorative. I dati sono protetti da cifratura TLS 1.3.",
      hotlineLabel: "Centrale Telefonica & WhatsApp 24/7",
      emailLabel: "Posta Istituzionale Cifrata",
      evidenceWarning: "AVVISO IMPORTANTE: Non cancellate per nessun motivo messaggi (WhatsApp, Telegram), ricevute di bonifico o codici di transazione (TXID).",
      formTitle: "Modulo Riservato di Presa in Carico Vittime (CVIF)",
      fields: {
        fullName: "Nome e Cognome Anagrafico",
        dob: "Data di Nascita",
        email: "Indirizzo E-mail Principale",
        phone: "Numero Telefonico (con prefisso internazionale)",
        country: "Paese di Residenza",
        cityRegion: "Città e Provincia / Regione",
        nationalId: "Codice Fiscale / Documento di Identità / SSN (Facoltativo)",
        fraudType: "Tipologia di Frode Subita",
        lossRange: "Entità del Danno Stimato (EUR / USD / GBP)",
        dateDiscovered: "Data in cui vi siete accorti della frode",
        dateInitialTransfer: "Data del primo bonifico o trasferimento",
        paymentMethod: "Canali di Pagamento Utilizzati",
        transactionIds: "Codici Transazione Blockchain (TXID) / Riferimenti Bonifico (CRO/TRN)",
        narrative: "Descrizione Cronologica Dettagliata dei Fatti",
        contactMethod: "Canale di Contatto Riservato Preferito",
      },
      submitBtn: "Invia Segnalazione Ufficiale",
      successTitle: "Dossier Acquisito con Successo",
      successDesc: "Il vostro numero di protocollo è: {caseRef}. Un agente dell'Unità Transatlantica Collins McDonald esaminerà la pratica e vi ricontatterà entro 24 ore lavorative.",
    },
    faq: {
      badge: "Domande Frequenti",
      title: "Chiarimenti per le Vittime e Ambiti Territoriali",
      q3: "Posso ricevere supporto se risiedo in Italia o in Europa e non sono cittadino americano?",
      a3: "ASSOLUTAMENTE SÌ. In conformità con le direttive operative transatlantiche contro la criminalità finanziaria, l'Unità Collins McDonald opera in cooperazione congiunta con Europol EC3, la National Crime Agency (NCA) britannica e Interpol. I cittadini e i residenti in Italia, nell'Unione Europea, nel Regno Unito e negli Stati Uniti godono di piena titolarità per la presa in carico, l'analisi forense e il recupero patrimoniale.",
    },
    footer: {
      title: "Federal Bureau of Investigation · Task Force Transatlantica contro i Crimini Finanziari",
      address: "Edificio J. Edgar Hoover, Washington, D.C. | Sede di Raccordo Europol: Eisenhowerlaan 73, 2517 KK L'Aia, Paesi Bassi",
      disclaimer: "Portale ufficiale per la tutela delle vittime disciplinato dalla Direttiva DOJ 546.22 e da accordi transnazionali. Ogni attività di supporto è rigorosamente gratuita.",
      rights: "Tutti i diritti riservati. Tutelato dalle normative statunitensi ed europee in materia di polizia giudiziaria.",
    },
  },

  // ── NEDERLANDS (DUTCH) ─────────────────────────────────────────────────
  nl: {
    topbar: {
      officialNotice:
        "Officieel Gezamenlijk Portaal: Trans-Atlantische Taskforce Cybercriminaliteit (VS · EU · VK)",
      contact: "Verbindingsbureau",
      fileReport: "Fraude Melden",
    },
    header: {
      department: "Amerikaans Ministerie van Justitie · Trans-Atlantische Taskforce",
      agency: "Federal Bureau of Investigation",
      unit: "Aanpak Cybercriminaliteit & Terugvordering van Fraudegelden — Eenheid Collins McDonald (VS · EU · VK)",
      searchPlaceholder: "Zoeken in dossiers, richtlijnen, FAQ...",
      searchBtn: "Zoeken",
      reportBtn: "Nu Fraude Melden",
      nav: {
        home: "Home",
        about: "Over de Eenheid",
        process: "Terugvorderingsproces",
        fraudTypes: "Vormen van Fraude",
        report: "Zaak Aanmelden",
        resources: "Informatie",
        faq: "Veelgestelde Vragen",
      },
    },
    alert: {
      title: "Dringende Veiligheidswaarschuwing:",
      body: 'Indien u wordt verzocht vooraf kosten, belastingen of "vrijgavekosten" te betalen via overboeking of cryptovaluta om inbeslaggenomen gelden vrij te krijgen, bent u het doelwit van een vervolgoplichting. Overheidsinstanties brengen slachtoffers nooit kosten in rekening.',
      learnMore: "Meer informatie",
    },
    hero: {
      badge: "Actieve Trans-Atlantische Operatie · 24/7 Inzetbaar",
      titleLine1: "U bent opgelicht.",
      titleGold: "Wij helpen u uw geld terug te vorderen.",
      body: "De Trans-Atlantische Taskforce voor Vermogensrecuperatie coördineert operaties tussen de FBI, Europol EC3, Interpol en de Britse National Crime Agency (NCA). Wij ondersteunen gedupeerden in Nederland, België, de Europese Unie, het Verenigd Koninkrijk en de Verenigde Staten bij het traceren en terughalen van gestolen tegoeden.",
      ctaReport: "Vertrouwelijk Dossier Aanmelden",
      ctaProcess: "Bekijk het Terugvorderingsproces",
      stats: {
        recovered: "$418M+",
        recoveredLabel: "Gerecupereerd (2024)",
        victims: "3.200+",
        victimsLabel: "Bijgestane Slachtoffers (VS & EU)",
        agents: "47",
        agentsLabel: "Actieve Speciale Rechercheurs",
        hotline: "24/7",
        hotlineLabel: "Internationale Alarmcentrale",
      },
    },
    about: {
      badge: "Over de Trans-Atlantische Eenheid",
      title: "FBI Cybercrime & Trans-Atlantische Vermogensrecuperatie — Eenheid Collins McDonald",
      p1: "De Afdeling Fraude en Vermogensrecuperatie (FFRD) is een gespecialiseerde eenheid onder auspiciën van het Amerikaanse Ministerie van Justitie en de Trans-Atlantische Werkgroep Cybercrime. Onder leiding van Hoofdagent Collins McDonald werkt de eenheid rechtstreeks samen met Europol (Europees Cybercrime Centrum - EC3 te Den Haag) en Interpol.",
      p2: "Ons mandaat steunt op internationale verdragen inzake wederzijdse rechtshulp (MLAT), het Verdrag van Boedapest inzake cybercriminaliteit en EU-richtlijn 2019/713. Wij werken nauw samen met de Landelijke Eenheid van de Politie, FIOD, AFM en Europese parketten.",
      p3: "Onze doelstelling: gestolen tegoeden grensoverschrijdend opsporen, bank- en cryptorekeningen via de rechtbank bevriezen en het kapitaal volledig aan de rechtmatige eigenaren retourneren.",
      missionBold: "Onze opdracht:",
      freeNotice: "Alle bijstand aan slachtoffers is uit hoofde van overheidstaken te allen tijde volkomen kosteloos.",
      leaderName: "Speciaal Agent Collins McDonald",
      leaderTitle: "Hoofd van de Eenheid, Dienstnummer #J.4267-CMD",
      leaderBio: "Ruim 22 jaar ervaring in internationale financiële recherche en blockchain-forensisch onderzoek. Drager van de Trans-Atlantische Eremedaille.",
      legalTitle: "Trans-Atlantische Bevoegdheid",
      legalSub: "DOJ- & Europol-EC3-Akkoord",
      legalBio: "Werkzaam krachtens DOJ-richtlijn 546.22, MLAT-rechtshulpverdragen en EU-Verordening 2018/1805 betreffende de wederzijdse erkenning van bevriezings- en confiscatiebevelen.",
      credTitle: "Bevoegdheden & Internationale Accreditaties",
      verifyTitle: "Hoe Controleert u Onze Echtheid",
      verifyStep1: "Bel of stuur een bericht via WhatsApp naar +1 (917) 487-6372 of het Europol-verbindingsbureau",
      verifyStep2: "Vraag naar de Eenheid Collins McDonald (Transatlantic Fraud Recovery)",
      verifyStep3: "Vermeld uw officiële dossiernummer (bijv. FFRD-2025-XXXXXX)",
      verifyWarning: "Legitieme rechercheurs en opsporingsambtenaren vragen NOOIT om betalingen via crypto, overschrijvingen of cadeaukaarten om gelden uit te keren.",
    },
    fraudTypes: {
      badge: "Onderzoeksgebieden",
      title: "Typologieën van Financiële Fraude",
      subtitle: "De Eenheid Collins McDonald behandelt dossiers afkomstig uit Nederland, België, de Europese Unie, het VK en de VS.",
      types: {
        crypto: {
          title: "Cryptovaluta- & Digitale Activa-Fraude",
          desc: "Valse crypto-exchanges, beleggingsscams met relationele manipulatie (Shāzhūpán), gemanipuleerde DeFi-pools en wallet-draining.",
          vector: "Forensische blockchain-analyse (Chainalysis); internationale conservatoire beslagen.",
        },
        invest: {
          title: "Beleggingsfraude & Malafide Handelsplatformen",
          desc: "Niet-vergunde brokers, neppe AI-beleggingsapps, fictieve termijndeposito's en misleidende CFD-constructies.",
          vector: "Samenwerking met AFM, FSMA, SEC; gerechtelijke inbeslagnames.",
        },
        wire: {
          title: "Bancaire Fraude & SEPA-Overschrijvingen",
          desc: "CEO-fraude (BEC), spookfacturen, ongeoorloofde SEPA-spoedoverboekingen en gemanipuleerde internationale overboekingen.",
          vector: "SWIFT/SEPA-terugroepverzoeken; bevriezing via Europol EFECC.",
        },
        romance: {
          title: "Vriendschaps- & Datingfraude (Romance Scam)",
          desc: "Psychologische beïnvloeding via datingapps of sociale media leidend tot grote geldoverboekingen onder het voorwendsel van noodsituaties.",
          vector: "Traceren van geldezels (money mules); internationale rechtshulpverzoeken.",
        },
      },
    },
    process: {
      badge: "Methodiek",
      title: "Het Terugvorderingsproces in 6 Fasen",
      subtitle: "Een internationaal juridisch sluitend proces om ontvreemde tegoeden op te sporen, te blokkeren en te repatriëren.",
      steps: {
        step1: {
          title: "Vertrouwelijke Intake & Toetsing",
          desc: "Aanmelding van uw zaak. Toetsing van bevoegdheid en verificatie van de identiteit binnen 24 werkuren.",
        },
        step2: {
          title: "Forensisch Bank- & Blockchain-Onderzoek",
          desc: "Ons digitaal laboratorium volgt de geldstromen door tussenliggende rekeningen en wallets naar de eindbestemming.",
        },
        step3: {
          title: "Spoedbevel tot Bevriezing van Tegoeden",
          desc: "Kennisgeving van gerechtelijke bevelen aan banken en cryptoplatformen om uitbetaling onmiddellijk te verhinderen.",
        },
        step4: {
          title: "Gerechtelijke Verbeurdverklaringsprocedure",
          desc: "Aanklagers starten civiel- en strafrechtelijke procedures op grond van internationale rechtshulpovereenkomsten.",
        },
        step5: {
          title: "Rechterlijke Herstelbeschikking",
          desc: "De bevoegde rechtbank wijst de inbeslaggenomen tegoeden definitief toe aan de geregistreerde slachtoffers.",
        },
        step6: {
          title: "Repatriëring & Uitbetaling",
          desc: "Het gerecupereerde kapitaal wordt rechtstreeks teruggestort op uw Nederlandse, Europese of Amerikaanse bankrekening.",
        },
      },
    },
    report: {
      badge: "Vertrouwelijk Dossier Aanmelden",
      title: "Intake Starten (VS & Europa)",
      desc: "Vul dit beveiligde formulier in. Een beëdigd rechercheur van de Eenheid Collins McDonald beoordeelt uw dossier binnen 24 werkuren. Gegevensoverdracht is beveiligd via TLS 1.3-versleuteling.",
      hotlineLabel: "24/7 Internationale Hulplijn & WhatsApp",
      emailLabel: "Beveiligde Federale Postbus",
      evidenceWarning: "BELANGRIJK: Verwijder GEEN bewijsmateriaal zoals bankafschriften, transactie-ID's (TXID) of chatberichten (WhatsApp, Telegram).",
      formTitle: "Vertrouwelijk Intakeformulier voor Slachtoffers (CVIF)",
      fields: {
        fullName: "Volledige Naam volgens legitimatiebewijs",
        dob: "Geboortedatum",
        email: "E-mailadres voor berichtgeving",
        phone: "Telefoonnummer (inclusief landcode)",
        country: "Land van Verblijf",
        cityRegion: "Woonplaats & Provincie / Regio",
        nationalId: "BSN / Rijksregisternummer / Paspoortnummer / SSN (Optioneel)",
        fraudType: "Categorie van de Fraude",
        lossRange: "Geschatte Schadeomvang (EUR / USD / GBP)",
        dateDiscovered: "Datum waarop fraude werd ontdekt",
        dateInitialTransfer: "Datum van de eerste overboeking",
        paymentMethod: "Gebruikte Betaalmethoden",
        transactionIds: "Transactie-hashes (TXID) / Betalingskenmerken",
        narrative: "Gedetailleerde Chronologie en Toelichting",
        contactMethod: "Voorkeur voor Vertrouwelijke Communicatie",
      },
      submitBtn: "Officiële Melding Indienen",
      successTitle: "Dossier Succesvol Ontvangen",
      successDesc: "Uw officiële dossiernummer luidt: {caseRef}. Een rechercheur van de Trans-Atlantische Eenheid Collins McDonald zal uw bewijsstukken beoordelen en binnen 24 werkuren contact met u opnemen.",
    },
    faq: {
      badge: "Veelgestelde Vragen",
      title: "Informatie voor Slachtoffers & Territoriale Bevoegdheid",
      q3: "Kom ik in aanmerking voor hulp als ik in Nederland, België of Europa woon en geen Amerikaans staatsburger ben?",
      a3: "JA, ZEKER. Krachtens de trans-atlantische samenwerkingsrichtlijn opereert de Eenheid Collins McDonald in nauw partnerschap met Europol EC3, de Britse National Crime Agency (NCA) en Interpol. Slachtoffers woonachtig in Nederland, België, alle lidstaten van de Europese Unie, het VK en de VS komen volledig in aanmerking voor intake, forensisch onderzoek en internationale vermogensrecuperatie.",
    },
    footer: {
      title: "Federal Bureau of Investigation · Trans-Atlantische Taskforce Financiële Criminaliteit",
      address: "J. Edgar Hoover Building, Washington, D.C. | Europol-Verbindingsbureau: Eisenhowerlaan 73, 2517 KK Den Haag, Nederland",
      disclaimer: "Officieel portaal voor slachtofferbijstand ingesteld krachtens DOJ-richtlijn 546.22 en internationale rechtshulpakkoorden. Alle dienstverlening is kosteloos.",
      rights: "Alle rechten voorbehouden. Beschermd door wetgeving van de Verenigde Staten en de Europese Unie.",
    },
  },
};
