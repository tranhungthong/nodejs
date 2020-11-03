"use strict";

module.exports = {
  convertFtoC: function convertFtoC(val) {
    return Math.round(val - 273.15);
  }
};
module.exports = {
  formatDateTime: function formatDateTime(dt) {
    var day = new Date(dt * 1000).getDay();
    var dayofweek = 'None';

    switch (day) {
      case 0:
        dayofweek = 'Sunday';
        break;

      case 1:
        dayofweek = 'Monday';
        break;

      case 2:
        dayofweek = 'Tuesday';
        break;

      case 3:
        dayofweek = 'Wednesday ';
        break;

      case 4:
        dayofweek = 'Thurday';
        break;

      case 5:
        dayofweek = 'Friday';
        break;

      case 6:
        dayofweek = 'Saturday ';
        break;
    }

    return dayofweek;
  }
};