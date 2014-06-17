( function( App ){

  'use strict';

  App.Price = DS.Model.extend({
    name: DS.attr('string'),
    description: DS.attr('string'),
    note: DS.attr('string'),
    limited: DS.attr('number'),
    price: DS.attr('number'),
    reductions: DS.hasMany('reduction', { embedded: 'always' }),
    vat: DS.attr('number'),
    priceIncl: function(){
      var price = isNaN(this.get('price')) ? 0.0 : parseFloat(this.get('price'));
      var vat = this.get('vat'); //isNaN(App._shopSettings.get('vat')) ? 0.0 : parseFloat(App._shopSettings.get('vat'));
      console.log('price is', price, vat);
      return (price + price * vat * 0.01).toFixed(2);
    }.property('vat','price'),
    observeIncl: function(){
      var inclPrice = isNaN(this.get('priceIncl')) ? 0.0 : this.get('priceIncl');
      var vat = this.get('vat'); //isNaN(App._shopSettings.get('vat')) ? 0.0 : parseFloat(App._shopSettings.get('vat'));
      var perc1 = inclPrice / (100 + vat);
      var perc100 = perc1 * 100;
      console.log('observer vat', vat, 'perc1', perc1, 'perc100', perc100);
      this.set('price', perc100.toFixed(2));
    }.observes('priceIncl'),
    priceExcl: function(){
      var price = isNaN(this.get('price')) ? 0.0 : parseFloat(this.get('price'));
      return price.toFixed(2);
    }.property('vat','price'),
    formattedPrice: function(){
      var p = App._shopSettings.get('grossInt') ? this.get('priceIncl') : this.get('priceExcl');
      if( currentUser.lang === 'de' )
        p = p.replace('.', ',');
      return new Handlebars.SafeString(p + ' ' + caminio.util.currencyCode2Symbol( App._shopSettings.get('currency') ));
    }.property('price')
  });

  App.Reduction = App.Price.extend();

})( App );
