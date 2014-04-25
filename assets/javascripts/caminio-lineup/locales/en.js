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

    'entry.marketing': 'Marketing',
    'entry.orig_project_url': 'Original project URL',
    'entry.orig_project_url_desc': 'e.g.: http://example.com/path/to/project',
    'entry.vimeo': 'Vimeo (http://vimeo.com)',
    'entry.youtube': 'Youtube (http://youtube.com)',
    'entry.linked_media_placeholder': 'e.g.: 6ddpV1GvF7E',
    'entry.linked_media_desc': 'The ID will be linked with the full url e.g.: http://www.youtube.com/watch?v=6ddpV1GvF7E',
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

    'entry.ensembles': 'Ensembles',

    'entries.search': 'Search',
    'entries.search.quick': 'Quick search',
    'entries.search.advanced': 'Advanced search',
    
  };

  for( var i in translations )
    Em.I18n.translations[i] = translations[i];

}).call();