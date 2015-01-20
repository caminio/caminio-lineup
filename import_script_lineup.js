// @author David Reinisch
// @date 01.20.2015
//
// #####################
// # IMPORT FOR LINEUP #
// ##################### 

conn = new Mongo();
// connect with camin_io database
db = conn.getDB("camin_io");

// clone lineup_entries in collection named entries
db.lineup_entries.find().forEach( function(e){
  var entry = prepareEntry(e);
  entry.lineup_events.forEach( prepareEvents );
  db.entries.insert(entry);
});

// clone lineup_persons in collection named persons
db.lineup_persons.find().forEach( function(p){
  db.persons.insert(p);
});

db.lineup_orgs.find().forEach( function(o){
  // decide if its an ensemble or a venue
});

// move collections to new database


function prepareEntry(e){
  var entry = e;
  delete entry.camDomain;
  delete entry.filename;
  delete entry.type;
  delete entry.venues;
  // TODO translations into description and press_quotes
  delete entry.translations;
  return entry;
}

function prepareEvents(e){
  var evt = e;
  evt.lineup_venue = evt.lineup_org;
  delete evt.lineup_org;
  delete evt.festival;
  delete evt.prices;
  delete evt.shop_orders;
}

