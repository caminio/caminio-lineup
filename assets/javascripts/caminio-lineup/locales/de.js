(function(){

  'use strict';

  if( currentLang !== 'de' ) return;

  var translations = {

    'nav.overview': 'Übersicht',
    'nav.entries': 'Einträge',
    'nav.organizations': 'Spielorte / Ensembles',
    'nav.people': 'Personen',
    'nav.settings': 'Einstellungen',

    'lineup_overview': 'Übersicht',

    'entries.title': 'Einträge im Spielplan',

    'entry.title': 'Titel',
    'entry.video_id': 'Video einbetten (ID)',
    'entry.video_provider': 'Video-Provider',
    'entry.subtitle': 'Untertitel',
    'entry.date': 'Datum',
    'entry.venues': 'Spielorte',
    'entry.create': 'Neuer Spielplaneintrag',
    'entry.description': 'Beschreibung',
    'entry.meta_keywords': 'Schlagwörter',
    'entry.author': 'Autor',
    'entry.director': 'Regie',
    'entry.keywords': 'Schlagwörter',
    'entry.save_before_content': 'Vor dem Hinzufügen von Bildern bitte speichern',

    'entry.marketing': 'Marketing',
    'entry.orig_project_url': 'Projekt URL (extern)',
    'entry.orig_project_url_desc': 'z.B..: http://example.com/path/to/project',
    'entry.vimeo': 'Vimeo (http://vimeo.com)',
    'entry.youtube': 'Youtube (http://youtube.com)',
    'entry.linked_media_placeholder': 'z.B..: 6ddpV1GvF7E',
    'entry.youtube_desc': 'Youtube-Id aus der Youtube-Adresse herauskopieren und hier einsetzen. Beispiel: Der Link lautet: http://www.youtube.com/watch?v=6ddpV1GvF7E - die ID davon ist: 66dpV1GvF7E',
    'entry.vimeo_desc': 'Youtube-Id aus der Youtube-Adresse herauskopieren und hier einsetzen. Beispiel: Der Link lautet: http://vimeo.com/92688138 - die ID davon ist 92688138',
    'entry.video_switch': 'Video-Provider wählen',

    'entry.premiere': 'Premiere',
    'entry.derniere': 'Derniere',
    'entry.canceled': 'Abgesagt',

    'entry.draft': 'Entwurf',
    'entry.published': 'Veröffentlicht',
    'entry.marked_published': '{{name}} ist jetzt veröffentlicht',
    'entry.marked_draft': 'Veröffentlichung von {{name}} wurde zurückgezogen',

    'entry.ttp': 'Theatre / Tanz / Performance',
    'entry.youth': 'Junges Publikum',
    'entry.cab': 'Kabaret',
    'entry.fes': 'Festival',
    'entry.category': 'Kategorie',

    'entry.duration': 'Dauer',
    'entry.breaks': 'Anzahl Pausen',
    'entry.from_age_of': 'ab',
    'entry.years': 'Jahren',
    'entry.filename': 'Dateiname',
    'entry.press_voices': 'Pressestimmen',

    'entry.media': 'Medien',

    'error.missing_title': 'Titel muss vor dem Fortfahren ausgefüllt werden.',
    'entry.saved': 'Eintrag {{name}} wurde gespeichert',
    'entry.deleted': 'Eintrag {{name}} wurde gelöscht',
    'entry.really_delete': '{{name}} wirklich löschen?',

    'entry.ensembles': 'Ensembles',

    'entries.search': 'Such',
    'entries.search.quick': 'Schnelle Suche',
    'entries.search.advanced': 'Erweiterte Suche',

    'events': 'Termine',
    'events.add': 'Termin hinzufügen',
    'event.no_yet': 'Kein Termin eingetragen',
    'event.starts_placeholder': 'JJJJ-MM-TT',
    'event.starts_time_placeholder': 'HH:MM',
    'event.select_venue': 'Spielort auswählen oder neuen Namen eintragen',
    'event.edit_prices': 'Preise bearbeiten',
    'event.nothing_found_create_new': 'Keine Ergebnisse. [ENTER] legt diesen Namen an',
    'event.saved': 'Termin {{starts}} wurde erstellt',

    'venue.created': 'Spielort {{name}} wurde erstellt',

    'venues.title': 'Spielorte',
    'venue.create': 'Neuer Spielort',
    'venue.name': 'Name',
    'venue.country': 'Land',
    'venue.city': 'Stadt',
    'venue.address': 'Adresse',
    'venue.saved': 'Organisation {{name}} wurde gespeichert',
    'venue.orig_org_url': 'Link zur Webseite',

    'venue.contact': 'Kontakt',
    'venue.accessibility': 'Erreichbarkeit',
    'venue.phone': 'Telefon',
    'venue.email': 'Email',
    'venue.opening_hours': 'Öffnungszeiten',

    'venue.public_transports': 'Öffentliche Verkehrsmittel in der Nähe',
    'venue.train': 'Zug',
    'venue.tram': 'Straßenbahn',
    'venue.bus': 'Bus',

    'person.select_or_create': 'Person auswählen oder neuen Namen eintragen',
    'person.nothing_found_create_new': 'Keine Ergebnisse. [ENTER] legt diesen Namen an',
    'person.created': 'Person {{name}} wurde erstellt',

    'jobs': 'Team / Funktionen',
    'jobs.add': 'Neue Person/Funktion',
    'jobs.no_yet': 'Keine Funktionen definiert',
    'job.description': 'Funktion',
    'job.saved': 'Funktion {{name}} wurde gespeichert'

  };

  for( var i in translations )
    Em.I18n.translations[i] = translations[i];

}).call();