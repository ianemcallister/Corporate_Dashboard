'use strict';

(function(){

class MapviewComponent {
  constructor() {
    this.message = 'Hello';
  }
}

angular.module('ahNutsApp')
  .component('mapview', {
    templateUrl: 'app/mapview/mapview.html',
    controller: MapviewComponent//,
    //controllerAs: Mapview
  });

})();
