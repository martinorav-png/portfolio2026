export type Locale = 'en' | 'et';

export const messages = {
  en: {
    navWork: 'Work',
    navSkills: 'Skills',
    navContact: 'Contact',
    navAbout: 'About',
    heroHey: "Hey, I'm",
    heroSubtitle:
      'A student with a thing for design. I make graphics, UI concepts, and a bunch of other fun stuff!',
    heroCtaWork: "See What I've Made",
    heroCtaContact: 'Say Hi',
    workTitle: 'Selected Work',
    workSubtitle: 'A mix of client projects, UI concepts, and personal experiments.',
    viewAllWork: 'View All Work',
    skillsTitle: 'Tools & Skills',
    contactTitle: 'Say Hi',
    contactSubtitle: "Want to chat or work on something together? I'm always open to it.",
    sayHello: 'Say Hello',
    contactUseMailApp: 'Use my mail app instead',
    footer: '© 2026 Martin Orav. Built with care.',
    bioTitle: 'About',
    bioP1:
      'My name is Martin and I am a Digital Product Design student at the Estonian Academy of Arts. I like to work on things such as graphic design, interaction design, game design and much more!',
    bioP2:
      'I care about making technology feel human - to create experiences that are clear, meaningful, and quietly satisfying to use.',
    bioP3: 'Good design makes the world a nicer place :)',
    bioPhotoAlt: 'Martin outdoors in Sofia',
    themeToLight: 'Switch to light mode',
    themeToDark: 'Switch to dark mode',
    langSwitch: 'Language',
    langEn: 'English',
    langEt: 'Eesti',
    modalViewLive: 'View live project',
  },
  et: {
    navWork: 'Tööd',
    navSkills: 'Oskused',
    navContact: 'Kontakt',
    navAbout: 'Minust',
    heroHey: 'Hei, olen',
    heroSubtitle:
      'Õpilane, kellele meeldib disain. Teen graafikat, UI kontseptsioone ja veel igasugu lõbusaid asju!',
    heroCtaWork: 'Vaata, mida olen teinud',
    heroCtaContact: 'Ütle tsau!',
    workTitle: 'Valitud tööd',
    workSubtitle: 'Klientprojektid, UI kontseptsioonid ja isiklikud katsetused.',
    viewAllWork: 'Kõik tööd',
    skillsTitle: 'Tööriistad ja oskused',
    contactTitle: 'Ütle tsau!',
    contactSubtitle: 'Tahad rääkida või koos midagi teha? Olen alati avatud.',
    sayHello: 'Kirjuta mulle',
    contactUseMailApp: 'Kasuta hoopis meilirakendust',
    footer: '© 2026 Martin Orav. Ehitatud hoolega.',
    bioTitle: 'Minust',
    bioP1:
      'Minu nimi on Martin ja olen Eesti Kunstiakadeemia digitaalse tootedisaini õppe suuna õpilane. Meeldib teha asju nagu graafiline disain, interaktsioonidisain, mängudisain ja palju muud!',
    bioP2:
      'Minu jaoks on oluline, et tehnoloogia tunduks inimlik — luua kogemusi, mis on selged, mõttekad ja vaikselt rahuldust pakkuvad.',
    bioP3: 'Hea disain teeb maailma ilusamaks :)',
    bioPhotoAlt: 'Martin väljas Sofias',
    themeToLight: 'Lülitu heledale režiimile',
    themeToDark: 'Lülitu tumedale režiimile',
    langSwitch: 'Keel',
    langEn: 'English',
    langEt: 'Eesti',
    modalViewLive: 'Vaata projekti võrgus',
  },
} as const satisfies Record<Locale, Record<string, string>>;

export type MessageKey = keyof (typeof messages)['en'];
