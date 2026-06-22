import { createContext, useContext, useMemo, useState } from "react";

export const languages = [
  { code: "en", label: "English", shortLabel: "EN" },
  { code: "hi", label: "Hindi", shortLabel: "HI" },
  { code: "mr", label: "Marathi", shortLabel: "MR" },
  { code: "te", label: "Telugu", shortLabel: "TE" }
];

const dictionaries = {
  en: {
    siteName: "Shree Krishna Devasthana",
    siteTagline: "Devasthana",
    nav: {
      home: "Home",
      about: "About",
      temple: "Temple",
      activities: "Activities",
      gallery: "Gallery",
      donations: "Donations",
      contact: "Contact",
      donateNow: "Donate Now",
      menu: "Menu",
      language: "Language"
    },
    home: {
      seoTitle: "Shree Krishna Devasthana | Home",
      seoDescription: "Visit Shree Krishna Devasthana for darshan, aarti, annadan, and devotional community life.",
      overviewEyebrow: "Temple Overview",
      overviewTitle: "A sacred space rooted in devotion, seva, and spiritual learning.",
      overviewDescription:
        "Inspired by timeless temple traditions, Shree Krishna Devasthana offers daily darshan, vibrant festivals, scriptural classes, and community-centered spiritual activities.",
      timingsEyebrow: "Daily Darshan",
      timingsTitle: "Temple timings for prayer, darshan, and aarti.",
      timingsDescription: "Plan your visit with the current daily temple schedule. Major festival timings can vary and are announced in advance.",
      communityEyebrow: "WhatsApp Community",
      communityTitle: "Join the temple WhatsApp group",
      communityDescription: "Scan the QR code or use the invite button to receive updates for darshan timings, satsang, seva, and festivals.",
      communityButton: "Join WhatsApp Group",
      communityNote: "Replace this placeholder invite link with the final WhatsApp group URL when available.",
      offerEyebrow: "Offer Seva",
      offerTitle: "Support annadan, temple care, and community service.",
      offerDescription: "Your donation helps sustain worship, prasadam, education, and compassionate outreach in the temple community.",
      makeDonation: "Make a Donation"
    },
    donations: {
      seoTitle: "Donations | Shree Krishna Devasthana",
      heroTitle: "Offer Your Donation",
      heroDescription: "Select the deity or temple seva first. The donation form and Razorpay payment open only after your seva is chosen.",
      chooseSeva: "Choose Seva",
      chooseTitle: "Donate for a temple or deity",
      chooseDescription: "Select one of the six temple sevas. The payment credentials remain the same, and your selected deity is captured in Razorpay notes.",
      selected: "Selected",
      locked: "Donation form locked",
      chooseFirst: "Please choose a seva card first",
      lockedDescription: "After selecting the temple or deity, the donation form and Razorpay payment option will appear here.",
      paymentTitle: "Razorpay Payment",
      paymentSubtitle: "Secure online donation",
      donationForm: "Donation Form",
      contribute: "Contribute with devotion",
      donationFor: "Donation For",
      name: "Name",
      amount: "Amount",
      purpose: "Purpose",
      pay: "Pay with Razorpay",
      creating: "Creating Razorpay order...",
      verifying: "Verifying payment..."
    },
    footer: {
      description: "A peaceful spiritual home for darshan, seva, satsang, and devotional community life rooted in the teachings of Lord Krishna.",
      visit: "Visit",
      quickLinks: "Quick Links",
      activities: "Temple Activities",
      donations: "Offer Donations",
      rights: "All rights reserved."
    }
  },
  hi: {
    siteName: "श्री कृष्ण देवस्थान",
    siteTagline: "देवस्थान",
    nav: {
      home: "होम",
      about: "परिचय",
      temple: "मंदिर",
      activities: "सेवा",
      gallery: "गैलरी",
      donations: "दान",
      contact: "संपर्क",
      donateNow: "दान करें",
      menu: "मेनू",
      language: "भाषा"
    },
    home: {
      overviewEyebrow: "मंदिर परिचय",
      timingsEyebrow: "दैनिक दर्शन",
      communityEyebrow: "WhatsApp समुदाय",
      communityTitle: "मंदिर WhatsApp समूह से जुड़ें",
      communityDescription: "दर्शन समय, सत्संग, सेवा और उत्सव अपडेट पाने के लिए QR स्कैन करें या invite button उपयोग करें।",
      communityButton: "WhatsApp समूह से जुड़ें",
      offerEyebrow: "सेवा अर्पण",
      makeDonation: "दान करें"
    },
    donations: {
      heroTitle: "अपना दान अर्पित करें",
      chooseSeva: "सेवा चुनें",
      chooseTitle: "मंदिर या देवता के लिए दान करें",
      selected: "चयनित",
      locked: "दान फॉर्म बंद है",
      chooseFirst: "कृपया पहले सेवा कार्ड चुनें",
      donationFor: "दान किसके लिए",
      name: "नाम",
      amount: "राशि",
      purpose: "उद्देश्य",
      pay: "Razorpay से भुगतान करें"
    }
  },
  mr: {
    siteName: "श्री कृष्ण देवस्थान",
    siteTagline: "देवस्थान",
    nav: {
      home: "मुख्य",
      about: "माहिती",
      temple: "मंदिर",
      activities: "सेवा",
      gallery: "गॅलरी",
      donations: "देणगी",
      contact: "संपर्क",
      donateNow: "देणगी द्या",
      menu: "मेनू",
      language: "भाषा"
    },
    home: {
      overviewEyebrow: "मंदिर परिचय",
      timingsEyebrow: "दैनिक दर्शन",
      communityEyebrow: "WhatsApp समुदाय",
      communityTitle: "मंदिराच्या WhatsApp समूहात सामील व्हा",
      communityDescription: "दर्शन वेळा, सत्संग, सेवा आणि उत्सव अपडेटसाठी QR स्कॅन करा किंवा invite button वापरा.",
      communityButton: "WhatsApp समूहात सामील व्हा",
      offerEyebrow: "सेवा अर्पण",
      makeDonation: "देणगी द्या"
    },
    donations: {
      heroTitle: "आपली देणगी अर्पण करा",
      chooseSeva: "सेवा निवडा",
      chooseTitle: "मंदिर किंवा देवतेसाठी देणगी द्या",
      selected: "निवडलेले",
      locked: "देणगी फॉर्म बंद आहे",
      chooseFirst: "कृपया आधी सेवा कार्ड निवडा",
      donationFor: "देणगी कोणासाठी",
      name: "नाव",
      amount: "रक्कम",
      purpose: "उद्देश",
      pay: "Razorpay ने पैसे द्या"
    }
  },
  te: {
    siteName: "శ్రీ కృష్ణ దేవస్థానం",
    siteTagline: "దేవస్థానం",
    nav: {
      home: "హోమ్",
      about: "గురించి",
      temple: "దేవాలయం",
      activities: "సేవలు",
      gallery: "గ్యాలరీ",
      donations: "విరాళాలు",
      contact: "సంప్రదించండి",
      donateNow: "విరాళం ఇవ్వండి",
      menu: "మెనూ",
      language: "భాష"
    },
    home: {
      overviewEyebrow: "దేవాలయ పరిచయం",
      timingsEyebrow: "నిత్య దర్శనం",
      communityEyebrow: "WhatsApp సమాజం",
      communityTitle: "దేవాలయ WhatsApp గ్రూపులో చేరండి",
      communityDescription: "దర్శన సమయాలు, సత్సంగం, సేవ మరియు ఉత్సవాల సమాచారం కోసం QR కోడ్ స్కాన్ చేయండి.",
      communityButton: "WhatsApp గ్రూపులో చేరండి",
      offerEyebrow: "సేవ అర్పణ",
      makeDonation: "విరాళం ఇవ్వండి"
    },
    donations: {
      heroTitle: "మీ విరాళం అర్పించండి",
      chooseSeva: "సేవను ఎంచుకోండి",
      chooseTitle: "దేవాలయం లేదా దేవత కోసం విరాళం ఇవ్వండి",
      selected: "ఎంచుకున్నది",
      locked: "విరాళం ఫారం లాక్ అయింది",
      chooseFirst: "దయచేసి ముందుగా సేవ కార్డ్ ఎంచుకోండి",
      donationFor: "విరాళం ఎవరికోసం",
      name: "పేరు",
      amount: "మొత్తం",
      purpose: "ఉద్దేశ్యం",
      pay: "Razorpay తో చెల్లించండి"
    }
  }
};

const LanguageContext = createContext(null);

function readPath(source, path) {
  return path.split(".").reduce((value, key) => value?.[key], source);
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => localStorage.getItem("temple-language") || "en");

  const setLanguage = (code) => {
    const nextLanguage = dictionaries[code] ? code : "en";
    localStorage.setItem("temple-language", nextLanguage);
    setLanguageState(nextLanguage);
  };

  const value = useMemo(() => {
    const dictionary = dictionaries[language] || dictionaries.en;

    return {
      language,
      languages,
      setLanguage,
      t: (path, fallback = path) => readPath(dictionary, path) ?? readPath(dictionaries.en, path) ?? fallback
    };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}
