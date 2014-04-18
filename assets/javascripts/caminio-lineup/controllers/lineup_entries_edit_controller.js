( function(){
  
  'use strict';

  App.LineupEntriesEditController = Ember.Controller.extend({

    curLang: currentUser.lang,

    curTranslation: function(){
      return this.get('model.translations').findBy('locale', this.get('curLang'));
    }.property('curLang'),

    _createTr: function(){
      var tr = this.store.createRecord('translation', { locale: this.get('curLang'),
                                                        content: Em.I18n.t('content_here') });
      this.get('model.translations').pushObject(tr);
    }

  });

  App.LineupEntriesNewController = App.LineupEntriesEditController.extend();


}).call();