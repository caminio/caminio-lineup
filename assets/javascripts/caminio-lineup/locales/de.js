(function(){

  'use strict';

  if( currentLang !== 'de' ) return;

  var translations = {

    'nav.overview': 'Übersicht',
    'nav.entries': 'Einträge',
    'nav.organizations': 'Spielorte / Ensembles',
    'nav.people': 'Personen',
    'nav.settings': 'Einstellungen',

    'entries.export': 'Spielplan exportieren',

    'lineup_overview': 'Übersicht',
    'only_future': 'Nur Termine in der Zukunft',

    'entries.title': 'Einträge im Spielplan',

    'entry.title': 'Titel',
    'entry.adv_settings': 'Erweiterte Einstellungen',
    'entry.last_changes': 'Letzte Änderungen',
    'entry.notify_creator_on_change': 'BesitzerIn benachrichtigen wenn jemand anderes Änderungen am Eintrag vornimmt',
    'entry.labels': 'Labels',
    'entry.currently_labeled': 'ist aktuell gelabelt mit',
    'entry.available_labels': 'Verfügbare Labels',
    'entry.no_labels': 'Keinem Label',
    'entry.click_label': 'Auf eines der verfügbaren Labels unterhalb klicken um diesen Spielplaneintrag damit zu markieren',
    'entry.video_id': 'Video einbetten (ID)',
    'entry.video_provider': 'Video-Provider',
    'entry.subtitle': 'Untertitel',
    'entry.date': 'Datum',
    'entry.venues': 'Spielorte',
    'entry.create': 'Neuer Spielplaneintrag',
    'entry.description': 'Beschreibung',
    'entry.meta_keywords': 'Schlagwörter',
    'entry.author': 'Autorenschaft',
    'entry.director': 'Inszenierung',
    'entry.keywords': 'Schlagwörter',
    'entry.save_before_content': 'Eintrag speichern, um diese Einstellungen verfügbar zu machen',
    'entry.concessions': 'Ermäßigungen',
    'entry.book_email': 'Reservierungen Email',
    'entry.book_phone': 'Reservierungen Telefon',
    'entry.book_url': 'Reservierungslink',
    'entry.note': 'Notiz',

    'entry.marketing_adv': 'Marketing / Erweitert',
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
    'entry.cancelled': 'Abgesagt',
    'entry.festival': 'Festival',
    'entry.select_festival': 'Festival auswählen (oder neues anlegen)',
    'entry.no_festival_found_create_new': 'Kein Festival gefunden (neues anlegen?)',
    'festival.created': 'Festival {{name}} wurde angelegt',

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
    'entry.filename': 'Dateiname / Teil der Internetadresse',
    'entry.press_voices': 'Pressestimmen',

    'entry.media': 'Medien',

    'entry.saved': 'Eintrag {{name}} wurde gespeichert',
    'entry.saving_failed': '{{name}} konnte nicht gespeichert werden',
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
    'event.venue_required': 'Ohne Spielort kann der Termin nicht angelegt werden',
    'event.person_required': 'Bitte eine Person zuordnen',

    'org.created': 'Spielort {{name}} wurde erstellt',

    'org.title': 'Spielorte',
    'org.type': 'Typ',
    'org.type.venue': 'Spielort',
    'org.type.ensemble': 'Ensemble',
    'org.type.organizer': 'Organisator',
    'org.create': 'Neuer Spielort',
    'org.name': 'Name',
    'org.country': 'Land',
    'org.city': 'Stadt',
    'org.address': 'Adresse',
    'org.saved': 'Organisation {{name}} wurde gespeichert',
    'org.orig_org_url': 'Link zur Webseite',

    'org.contact': 'Kontakt',
    'org.accessibility': 'Erreichbarkeit',
    'org.phone': 'Telefon',
    'org.email': 'Email',
    'org.opening_hours': 'Öffnungszeiten',

    'org.public_transports': 'Öffentliche Verkehrsmittel in der Nähe',
    'org.train': 'Zug',
    'org.tram': 'Straßenbahn',
    'org.bus': 'Bus',

    'people.title': 'Personen',
    'person.title': 'Name der Person',
    'person.create': 'Person erstellen',
    'person.name': 'Name',
    'person.saved': 'Person {{name}} wurde gespeichert',
    'person.firstname': 'Vorname',
    'person.lastname': 'Nachname',

    'person.select_or_create': 'Person auswählen oder neuen Namen eintragen',
    'person.nothing_found_create_new': 'Keine Ergebnisse. [ENTER] legt diesen Namen an',
    'person.created': 'Person {{name}} wurde erstellt',
    'person.show_edit_form': 'Formular dieser Person anzeigen',
    'person.unlink_from_entry': 'Verknüpfung mit diesem Eintrag lösen',

    'jobs': 'Mitwirkende',
    'jobs.add': 'Neue Person/Funktion',
    'jobs.no_yet': 'Keine Funktionen definiert',
    'job.description': 'Funktion',
    'job.saved': 'Funktion {{name}} wurde gespeichert',
    'job.author': 'Autorenschaft',
    'job.director': 'Inszenierung',
    'job.no_title': 'Mitwirkende/r',

    'venue.created': 'Spielort {{name}} wurde angelegt',

    'ensemble.select_or_create': 'Ensemble auswählen oder neuen Namen eintragen',
    'ensemble.nothing_found_create_new': 'Keine Ergebnisse. [ENTER] legt diesen Namen an',
    'ensemble.created': 'Ensemble {{name}} wurde erstellt',
    'ensemble.show_edit_form': 'Formular dieses Ensembles anzeigen',
    'ensemble.unlink_from_entry': 'Verknüpfung mit diesem Eintrag lösen',

    'error.missing_title': 'Titel muss vor dem Fortfahren ausgefüllt werden.',
    'error.missing_firstname': 'Vorname muss vor dem Fortfahren ausgefüllt werden.'
  };

  for( var i in translations )
    Em.I18n.translations[i] = translations[i];

}).call();
