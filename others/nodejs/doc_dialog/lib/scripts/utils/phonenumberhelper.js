module.exports = {};

module.exports.isMobile = function(phone_number){
  // mobile: +79xxxxxxxxx
  // city  : +78xxxxxxxxx
  return ( phone_number[ 2] == '9');
}