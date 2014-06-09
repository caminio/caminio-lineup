module.exports = function ( caminio ){

  'use strict';

  var LineupEntry   = caminio.models.LineupEntry;
  var builder       = require('xmlbuilder');
  var RSVP          = require('rsvp');
  var moment        = require('moment');
  var periodStart;
  var periodEnd;
  var domainId;

  return function exportDat( req ){

    domainId = req.domain._id;

    var result = new RSVP.Promise( function(resolve){ resolve(req.query); });

    result = result.then( processQuery );
    result = result.then( processXML );

    return result;

  };

  function processQuery(query){
    console.log('first call', query);
    return new RSVP.Promise( function(resolve, reject){
      periodStart = getFirstMonth(query.period ? query.period : moment());
      periodEnd = periodStart.clone().add('day',32).endOf('month');
      LineupEntry.find({ camDomain: domainId, 'lineup_events.starts': { $gte: periodStart.toDate(), $lte: periodEnd.toDate() } })
        .populate('labels ensembles lineup_jobs.lineup_person')
        .exec( function( err, entries ){
          if( err ){ reject(err); }
          resolve(entries);
        });
    });
  }

  function processXML(entries){
    return new RSVP.Promise( function( resolve ){
      var xml = builder.create('schedule', {'version': '1.0',
                                            'encoding': 'utf-8',
                                            'standalone': 'true'} );

      entries.forEach(function(entry){
        var record = xml.ele('record', { id: entry._id });
        entry.ensembles.forEach( function(ensemble){
          var infoTickets = ensemble.email ? ensemble.email + ' ' : '';
          infoTickets += ensemble.phone;
          record.ele('organiser')
            .ele('name', ensemble.curTranslation.title)
            .ele('info_contact', infoTickets);
        });
        var production = record.ele('production')
          .ele('title', { maxchars: 36 }, entry.curTranslation.title)
          .ele('label', entry.labels.map(function(label){ return label.name; }).join(', '))
          .ele('subtitle', { maxchars: 40 }, entry.curTranslation.subtitle)
          .ele('author', getJobPerson('author',entry).map(function(person){ return person.name; }));
      });

      xml = xml.end({ pretty: true});
      resolve( xml.toString() );
    });

  }

  function getFirstMonth( d ){

    var date = moment(d);

    if( date.month() % 2 > 0 )
      date = date.subtract('month',1);

    return date.startOf('month');

  }

  function getJobPerson( title, entry ){
    var found = [];
    entry.lineup_jobs.forEach(function(job){
      if( job.title === title )
        found.push( job.lineup_person )
    });
    return found;
  }


};
