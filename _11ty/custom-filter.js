const moment = require('moment');

module.exports = {

  // Custom slug
  pslug: (obj) => {
    var result = obj.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=_'`~()]/g, '').replace(/\s+/g, '-');
    return result;
  },

  // Universal date filter
  date: (dateObj, fromformat , toformat, language = "en") => {
    return moment(dateObj, fromformat).locale(language).format(toformat);
  },

  // Twitter filter
  tweetExcludeAnswers: (obj) => {
    const result = obj.filter(el => el.text.charAt(0) !== "@");
    return result;
  },
  tweetRemoveLink: (obj) => {
    const result = obj.replace(/https:\/\/t.co\/\S*/gm, "");
    return result;
  },

  // Add/Remove Hashtags
  addHash: (obj) => {
    var result = "#" + obj;
    return result;
  },
  removeHash: (obj) => {
    var result = obj.replace(/# /g, "");
    return result;
  }

}