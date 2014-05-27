(function(){

  'use strict';

  if( currentLang !== 'en' ) return;

  var translations = {

    'nav.overview': 'Overview',
    'nav.entries': 'Entries',
    'nav.organizations': 'Venues / Ensembles',
    'nav.people': 'People',
    'nav.settings': 'Settings',

    'lineup_overview': 'Line up overview',

    'entries.title': 'Line up entries',

    'entry.title': 'Title',
    'entry.adv_settings': 'Advanced settings',
    'entry.last_changes': 'Latest changes',
    'entry.notify_creator_on_change': 'Notify owner when entry is changed by someone else',
    'entry.labels': 'Labels',
    'entry.currently_labeled': 'is currently labeled with',
    'entry.available_labels': 'Available labels',
    'entry.no_labels': 'No label',
    'entry.click_label': 'Click a label below to mark this entry with it',
    'entry.video_id': 'Embedded video ID',
    'entry.video_provider': 'Embedded video provider',
    'entry.subtitle': 'Subtitle',
    'entry.date': 'Date',
    'entry.venues': 'Venue(s)',
    'entry.create': 'Create new line up entry',
    'entry.description': 'Description',
    'entry.meta_keywords': 'Keywords',
    'entry.author': 'Author',
    'entry.director': 'Director',
    'entry.keywords': 'Keywords',
    'entry.save_before_content': 'Save your content first before starting to upload images',

    'entry.marketing_adv': 'Marketing / Advanced',
    'entry.orig_project_url': 'Original project URL',
    'entry.orig_project_url_desc': 'e.g.: http://example.com/path/to/project',
    'entry.vimeo': 'Vimeo (http://vimeo.com)',
    'entry.youtube': 'Youtube (http://youtube.com)',
    'entry.linked_media_placeholder': 'e.g.: 6ddpV1GvF7E',
    'entry.youtube_desc': 'Just copy and paste the ID part of the youtube video you wish to use here. if your video link is: http://www.youtube.com/watch?v=6ddpV1GvF7E the 66dpV1GvF7E part is the ID of your video',
    'entry.vimeo_desc': 'Just copy and paste the ID part of the vimeo video you wish to use here. if your video link is: http://vimeo.com/92688138 the 92688138 part is the ID of your video',
    'entry.video_switch': 'Click the icon of your video provider to switch',

    'entry.premiere': 'Premiere',
    'entry.derniere': 'Derniere',
    'entry.cancelled': 'Cancelled',

    'entry.draft': 'Draft',
    'entry.published': 'Published',
    'entry.marked_published': '{{name}} is now published',
    'entry.marked_draft': '{{name}} is no longer published and marked as draft',

    'entry.ttp': 'Theatre / Dance / Performance',
    'entry.youth': 'Young audience',
    'entry.cab': 'Cabaret',
    'entry.fes': 'Festival',
    'entry.category': 'Category',

    'entry.duration': 'Duration',
    'entry.breaks': 'Breaks',
    'entry.from_age_of': 'From',
    'entry.years': 'years',
    'entry.filename': 'Filename / Part of Internet address',
    'entry.press_voices': 'Press voices',

    'entry.media': 'Media',

    'entry.saved': 'Entry {{name}} has been saved',
    'entry.saving_failed': 'Entry {{name}} failed to save',
    'entry.deleted': 'Entry {{name}} has been deleted',
    'entry.really_delete': 'Really delete {{name}}?',

    'entry.ensembles': 'Ensembles',

    'entries.search': 'Search',
    'entries.search.quick': 'Quick search',
    'entries.search.advanced': 'Advanced search',

    'events': 'Events',
    'events.add': 'Add event',
    'event.no_yet': 'No event yet',
    'event.starts_placeholder': 'YYYY-MM-DD',
    'event.starts_time_placeholder': 'HH:MM',
    'event.select_venue': 'Select a venue or enter new name',
    'event.edit_prices': 'Edit prices',
    'event.nothing_found_create_new': 'No results. Press Enter to create venue',
    'event.saved': 'Event {{starts}} has been saved',
    'event.venue_required': 'Venue is required in order to save event',

    'org.created': 'Venue {{name}} has been created',

    'org.contact': 'Contact',
    'org.type': 'Type',
    'org.type.venue': 'Venue',
    'org.type.ensemble': 'Ensemble',
    'org.type.organizer': 'Organizer',
    'org.title': 'Venues',
    'org.create': 'Create a new venue',
    'org.name': 'Name',
    'org.country': 'Country',
    'org.city': 'City',
    'org.address': 'Address',
    'org.saved': 'Organization {{name}} has been saved',
    'org.orig_org_url': 'Link to website',

    'org.accessibility': 'Accessibility',
    'org.phone': 'Phone',
    'org.email': 'Email',
    'org.opening_hours': 'Opening hours',

    'org.public_transports': 'Public transports nearby',
    'org.train': 'Train',
    'org.tram': 'Tram',
    'org.bus': 'Bus',

    'people.title': 'People',
    'person.title': 'Person name',
    'person.create': 'Create person',
    'person.name': 'Name',
    'person.saved': 'Person {{name}} has been saved',
    'person.firstname': 'Firstname',
    'person.lastname': 'Lastname',

    'person.select_or_create': 'Select or create person',
    'person.nothing_found_create_new': 'No person matched your search. Enter to create',
    'person.created': 'Person {{name}} has been created',
    'person.show_edit_form': 'Show form of this person',
    'person.unlink_from_entry': 'Unlink person from this entry',

    'jobs': 'Team / Jobs',
    'jobs.add': 'Add a job',
    'jobs.no_yet': 'There is no job yet',
    'job.description': 'Job description',
    'job.saved': 'Job for {{name}} has been saved',
    'job.author': 'Playwright',
    'job.director': 'Directing',

    'ensemble.select_or_create': 'Select or create ensemble',
    'ensemble.nothing_found_create_new': 'No ensemble matched your search. Enter to create',
    'ensemble.created': 'Ensemble {{name}} has been created',
    'ensemble.show_edit_form': 'Show form of ensemble',
    'ensemble.unlink_from_entry': 'Unlink ensemble from this entry',

    'error.missing_title': 'Title must be filled in before you can continue',
    'error.missing_firstname': 'Firstname must be filled in before you can continue',
  };

  for( var i in translations )
    Em.I18n.translations[i] = translations[i];

}).call();
