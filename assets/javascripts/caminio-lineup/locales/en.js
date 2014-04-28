(function(){

  'use strict';

  if( currentLang !== 'en' ) return;

  var translations = {

    'nav.overview': 'Overview',
    'nav.entries': 'Entries',
    'nav.venues': 'Venues',
    'nav.people': 'People',
    'nav.settings': 'Settings',

    'lineup_overview': 'Line up overview',

    'entries.title': 'Line up entries',

    'entry.title': 'Title',
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

    'entry.marketing': 'Marketing',
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
    'entry.canceled': 'Cancelled',

    'entry.ttp': 'Theatre / Dance / Performance',
    'entry.youth': 'Young audience',
    'entry.cab': 'Cabaret',
    'entry.fes': 'Festival',
    'entry.category': 'Category',

    'entry.duration': 'Duration',
    'entry.breaks': 'Breaks',
    'entry.from_age_of': 'From',
    'entry.years': 'years',

    'entry.media': 'Media',

    'error.missing_title': 'Title must be filled in before you can continue',
    'entry.saved': 'Entry {{name}} has been saved',

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

    'venue.created': 'Venue {{name}} has been created',

  };

  for( var i in translations )
    Em.I18n.translations[i] = translations[i];

}).call();