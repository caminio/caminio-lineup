var Gear    = require('caminio/gear');
new Gear({ 
  api: true,
    applications: [
      { name: 'lineup', 
        icon: 'fa-asterisk', 
        i18n:{
          en: 'Line-Up',
          de: 'Spielplan'
        }
    }
    ]
});
