// @author David Reinisch
// @date 01.20.2015
//
// #####################
// # IMPORT FOR LINEUP #
// ##################### 

conn = new Mongo();

var sourceDbName = "camin_io";
var targetDbName = "caminio";

// connect with camin_io database
db = conn.getDB(sourceDbName);
newDb = db.getSiblingDB(targetDbName);

printjson("import from " + sourceDbName + " to " + targetDbName );

var collections = [
  "lineup_ensembles",
  "lineup_entries",
  "lineup_persons",
  "lineup_venues"
]

collections.forEach( function(name){
  if( newDb.getCollectionNames().indexOf( name ) < 0 ){
    db.createCollection(name);
    printjson("collection "+name+" created")
  }
});

// clone lineup_entries in collection named entries
var old_entries = db.lineup_entries.find()
old_entries.forEach( function(e){
  if( "533996f4c987a9ee5f91b244" === e.camDomain.str  ){
    var entry = prepareEntry(e);
    entry.lineup_events.forEach( prepareEvents );
    newDb.lineup_entries.update({ _id: entry._id }, entry, { upsert: true });
  }
});

printjson( newDb.lineup_entries.find().length() + " lineup_entries updated / inserted" );

// clone lineup_persons in collection named persons
db.lineup_people.find().forEach( function(p){
  if( "533996f4c987a9ee5f91b244" === p.camDomain.str  ){
    newDb.lineup_persons.insert({ _id: p._id }, p, { upsert: true });
  }
});

printjson( newDb.lineup_persons.find().length() + " lineup_persons updated / inserted" );

db.lineup_orgs.find().forEach( function(o){
  // decide if its an ensemble or a venue
  if( "533996f4c987a9ee5f91b244" === o.camDomain.str  ){
    if( o.type === "ensemble"){
      var ensemble = prepareEnsemble(o);
      newDb.lineup_ensembles.update({ _id: ensemble._id }, ensemble, { upsert: true });
    }
    else{
      var venue = prepareVenue(o);
      newDb.lineup_venues.update({ _id: venue._id }, venue, { upsert: true });
    }
  }
});

printjson( newDb.lineup_ensembles.find().length() + " lineup_ensembles updated / inserted" );
printjson( newDb.lineup_venues.find().length() + " lineup_venues updated / inserted" );

function prepareEntry(e){
  var entry = e;
  e.access_rules = accessRules();
  entry.translations.forEach(function(t){
    makeTranslation( entry.title, t.locale, t.title )
    makeTranslation( entry.subtitle, t.locale, t.subtitle )
    makeTranslation( entry.description, t.locale, t.content )
    if ( entry.quotes === undefined )
      entry.quotes = [];
    var quote = {
      title: {},
      description: {}
    }
    makeTranslation( quote.description, t.locale, t.aside )
    makeTranslation( quote.title, t.locale, t.aside2 )
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
  e.access_rules = accessRules();
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
  v.access_rules = accessRules();
  delete venue.camDomain;
  delete venue.members;
  delete venue.type;
  return venue;
}

function accessRules(){
  return [
    {
      "_id" : ObjectId("5461e7d27461731976020000"),
      "can_write" : true,
      "can_share" : true,
      "can_delete" : true,
      "organizational_unit_id" : ObjectId("54221a4d7461734f36000000"),
      "user_id" : ObjectId("54221a4d7461734f36010000")
    }
  ];
}

