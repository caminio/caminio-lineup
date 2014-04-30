(function( App ){
  
  'use strict';

  App.LineupMediaView = Ember.View.extend({

    templateName: 'lineup/media',
    
    didInsertElement: function(){

      var controller = this.get('controller');

      this.$('.media-items').sortable({
        update: function( e, ui ){ updateAndSaveMediaItemPosition( e, ui, $(this), controller.get('content') ); }
      });

      $('#fileupload').fileupload({
        dataType: 'json',
        url: '/caminio/mediafiles',
        done: function (e, data) {
          setTimeout(function(){
            $('#progress').removeClass('active');
          },1000);
          controller.store.pushPayload('mediafile', data.result);
          controller.store.find('mediafile', {parent: controller.get('model.id')}).then(function(mediafiles){
            controller.set('mediafiles', mediafiles);
            setTimeout(function(){
              self.$('.media-items').sortable('refresh');
            }, 100 );
          })

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
                          parentType: 'LineupEntry' };
      });

    }

  });

  function updateAndSaveMediaItemPosition( e, ui, $elem, content ){
    var ids = [];
    $elem.find('.media-item').each(function(i){
      if( $(this).attr('data-id') )
        ids.push( $(this).attr('data-id') );
    });

    $.post('/caminio/mediafiles/reorder/', {
      ids: ids
    }).done( function( response ){
      notify('info', Em.I18n.t('files.new_order_saved'));
    });
  }

})( App );