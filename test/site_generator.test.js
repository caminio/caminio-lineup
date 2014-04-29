/** 
 * @Author: David Reinisch
 * @Company: TASTENWERK e.U.
 * @Copyright: 2014 by TASTENWERK
 * @License: Commercial
 *
 * @Date:   2014-04-16 00:14:37
 *
 * @Last Modified by:   David Reinisch
 * @Last Modified time: 2014-04-29 18:36:06
 *
 * This source code is not part of the public domain
 * If server side nodejs, it is intendet to be read by
 * authorized staff, collaborator or legal partner of
 * TASTENWERK only
 */

var helper = require('./helper'),
    async = require('async'),
    expect = helper.chai.expect;

var caminio,
    user,
    domain;

var Entry,
    projects = [],
    names = [ 'aproject' ];

var path = __dirname + "/support/content/test_com";

describe( 'Site Generator lineup test', function(){

  function addWebpage( name, next ){ 
    var project = new Entry( { 
      camDomain: domain.id, 
      translations: [
        { content: 'testcontent', locale: 'en',
          title: name },
        { content: 'deutsch', locale: 'de',
          title: name}
      ] 
    } );
    project.save( function( err ){
      projects.push( project );
      next();
    });
  }

  before( function( done ){
    var akku = this;
    helper.initApp( this, function( test ){ 
      caminio = helper.caminio;
      Entry = caminio.models.LineupEntry;
      helper.cleanup( caminio, function(){
        helper.getDomainAndUser( caminio, function( err, u, d ){
          user = u;
          domain = d;
          akku.agent.post( helper.url+'/login' )
          .send({ username: user.email, password: user.password })
          .end(function(err,res){
            akku.agent.get( helper.url+'/website/available_layouts')
            .end( function( err, res ){
              async.forEach( names, addWebpage, done );
            });
          });
        });
      });
    });
  });

  describe( 'SiteGen', function(){

    describe( 'methods: ', function(){
      var gen;

      before( function( done ){
        var SiteGen = require('caminio-rocksol/lib/site/site_generator');
        gen = new SiteGen( caminio, path, 'projects' );
        done();
      });

      describe('compileObject', function(){
        it('works with a webpage', function( done ){
          gen.compileObject( 
            projects[0], 
            { locals: {  currentUser: 'adsfsadf', }, isPublished: true },
            function( err, content ){
              done();
          });
        });
      });

    });

  });

});