(function( App ){
  
  'use strict';

  App.LineupEntriesEditView = Ember.View.extend({

    didInsertElement: function(){

      var controller = this.get('controller');

      $('#fileupload').fileupload({
        dataType: 'json',
        url: '/caminio/mediafiles',
        done: function (e, data) {
          setTimeout(function(){
            $('#progress').removeClass('active');
          },1000);
          App.Mediafile.store.pushPayload('mediafile', data.result);
          controller.set('mediafiles', App.Mediafile.store.all('mediafile', {parent: controller.get('model.id')}));
        },
        progressall: function (e, data) {
          $('#progress').addClass('active');
          var progress = parseInt(data.loaded / data.total * 100, 10);
          $('#progress .progress-bar').css(
            'width',
            progress + '%'
          )
          .attr('aria-valuenow', progress)
          .find('.perc-text').text(progress+'%');
        }
      }).on('fileuploadsubmit', function( e, data ){
        data.formData = { parent: controller.get('model.id') || null,
                          parentType: 'ShopItem' };
      });

    }

  });

  App.LineupEntriesNewView = App.LineupEntriesEditView.extend();

})( App );