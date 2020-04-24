export function getCurrentWeekNo() {
  var currentDate = new Date();
  var firstDay = new Date(currentDate.getFullYear(),0,1);
  var dayms = 24 * 60 * 60 * 1000;
  var numday = ((currentDate - firstDay) / dayms );
  var weeks = Math.ceil((numday + firstDay.getDay() + 1) / 7);
  return weeks;
}