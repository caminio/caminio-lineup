module.exports = function ( caminio ){

  'use strict';

  var LineupEntry   = caminio.models.LineupEntry;
  var LineupOrg     = caminio.models.LineupOrg;
  var Mediafile     = caminio.models.Mediafile;
  var builder       = require('xmlbuilder');
  var RSVP          = require('rsvp');
  var moment        = require('moment');
  var async         = require('async');
  var periodStart;
  var periodEnd;
  var domainId;

  return function exportDat( req, res ){

    moment.lang( req.curLang || 'de');
    domainId = req.domain._id;

    var result = new RSVP.Promise( function(resolve){ resolve(req.query); });

    result = result.then( processQuery );
    result = result.then( processXML );

    return result;

  };

  function processQuery(query){
    return new RSVP.Promise( function(resolve, reject){
      periodStart = getFirstMonth(query.period ? query.period : moment());
      periodEnd = periodStart.clone().add('day',32).endOf('month');
      LineupEntry.find({ camDomain: domainId, 'lineup_events.starts': { $gte: periodStart.toDate(), $lte: periodEnd.toDate() } })
        .populate('ensembles')
        .populate('labels')
        .exec( function( err, entries ){
          if( err ){ reject(err); }
          LineupOrg.populate( entries, 'lineup_events.lineup_org', function( err, entries ){
            async.eachSeries( entries, function(entry, next){
              Mediafile.find({ parent: entry._id}).exec(function(err,mediafiles){
                entry.mediafiles = mediafiles;
                next();
              });
            }, function(){
              resolve(entries);
            });
          });
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
          record.ele('organiser').ele('name', ensemble.curTranslation.title);
          record.ele('info_contact', infoTickets);
        });
        var production = record.ele('production');
        production.ele('title', { maxchars: 36 }, entry.curTranslation.title);
        production.ele('label', entry.labels.map(function(label){ return label.name; }).join(', '));
        production.ele('subtitle', { maxchars: 40 }, entry.curTranslation.subtitle);
        production.ele('author', getJobPerson('author',entry).map(function(person){ return person.name; }));
        production.ele('company_performer', entry.ensembles.map(function(ensemble){ return ensemble.curTranslation.title; }).join(', '));
        production.ele('short_desc', entry.curTranslation.content);

        var categories = record.ele('categories');
        if( entry.curTranslation.metaKeywords )
          entry.curTranslation.metaKeywords.split(',').forEach(function(keyword){
            keyword = keyword.replace(/\W/g,'');
            if( keyword.substring(0,1).match(/\d/) )
              keyword = '_'+keyword;
            categories.ele(keyword,1);
          });


        var dates = record.ele('dates');
        entry.lineup_events.forEach(function(evnt){
          var date = dates.ele('date');
          date.ele('dayname', moment(evnt.starts).format('dddd'));
          date.ele('day', moment(evnt.starts).format('YYYY-MM-DD'));
          date.ele('time', moment(evnt.starts).format('HH:mm'));
          date.ele('premiere', evnt.premiere);
          var location = date.ele('location');
          if( !evnt.lineup_org )
            return;
          location.ele('name', evnt.lineup_org.curTranslation.title);
          location.ele('phone', evnt.lineup_org.phone);
          location.ele('email', evnt.lineup_org.email);
          var addr = location.ele('address');
          addr.ele( 'street', evnt.lineup_org.street );
          addr.ele( 'zip', evnt.lineup_org.zip );
          addr.ele( 'city', evnt.lineup_org.city );
          addr.ele( 'country', evnt.lineup_org.country );
          var concessions = date.ele('reductions');
          evnt.concessions.forEach(function(concession){
            concessions.ele(concession.replace(/\W/g,''),1);
          });
        });

        var images = record.ele('images');
        entry.mediafiles.forEach(function(mediafile){
          images.ele('img',{ copyright: mediafile.copyright || '', description: mediafile.description || '', name: mediafile.name || '', src:'http://dasanderetheater.camin.io/files/'+mediafile.relPath});
        });

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
