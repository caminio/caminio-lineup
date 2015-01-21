// @author David Reinisch
// @date 01.20.2015
//
// #####################
// # IMPORT FOR LINEUP #
// ##################### 

conn = new Mongo();
// connect with camin_io database
db = conn.getDB("camin_io");
newDb = db.getSiblingDB("caminio_lineup");

// clone lineup_entries in collection named entries
db.lineup_entries.find().forEach( function(e){
  var entry = prepareEntry(e);
  entry.lineup_events.forEach( prepareEvents );
  newDb.lineup_entries.insert(entry);
});

// clone lineup_persons in collection named persons
db.lineup_people.find().forEach( function(p){
  newDb.lineup_persons.insert(p);
});

db.lineup_orgs.find().forEach( function(o){
  // decide if its an ensemble or a venue
  if( o.type === "ensemble"){
    var ensemble = prepareEnsemble(o);
    newDb.lineup_ensembles.insert(ensemble);
  }
  else{
    var venue = prepareVenue(o);
    newDb.lineup_venues.insert(venue);
  }
});

function prepareEntry(e){
  var entry = e;
  entry.translations.forEach(function(t){
    makeTranslation( entry.title, t.locale, t.title )
    makeTranslation( entry.subtitle, t.locale, t.subtitle )
    makeTranslation( entry.description, t.locale, t.content )
    if ( entry.quotes === undefined )
      entry.quotes = [];
    var quote = {}
    makeTranslation( quote.title, t.locale, t.aside2 )
    makeTranslation( quote.description, t.locale, t.aside )
    entry.quotes.push( quote );
  });
  delete entry.camDomain;
  delete entry.filename;
  delete entry.type;
  delete entry.venues;
  delete entry.translations;
  return entry;
}

function makeTranslation( hash, locale, content ){
  if ( hash === undefined )
    hash = {};
  hash[locale] = content;
}

function prepareEvents(e){
  var evt = e;
  evt.lineup_venue = evt.lineup_org;
  delete evt.camDomain;
  delete evt.lineup_org;
  delete evt.festival;
  delete evt.prices;
  delete evt.shop_orders;
}

function prepareEnsemble(e){
  var ensemble = e;
  ensemble.lineup_persons = ensemble.members;
  delete ensemble.camDomain;
  delete ensemble.members;
  delete ensemble.reachByBus;
  delete ensemble.reachByTram;
  delete ensemble.reachByTrain;
  delete ensemble.type;
  return ensemble;
}

function prepareVenue(v){
  var venue = v;
  delete venue.camDomain;
  delete venue.members;
  delete venue.type;
  return venue;
}
