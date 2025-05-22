$(function(){
   
  var timepickerStart = $('#timepicker-start');
var timepickerEnd = $('#timepicker-end');
console.log('timepickerStart',timepickerStart.val())
timepickerEnd.timepicker({
//  'timeFormat': 'H:i',
 'minTime': '9:00am',
 'maxTime': '8:00pm',
//  'step': 15,
 'showDuration': true,
 'timeFormat': 'H:i:s'
});

timepickerStart.timepicker({
//  'timeFormat': 'H:i',
 'minTime': '9:00am',
 'maxTime': '8:00pm',
 'step': 15,
 'lang': {
   mins: 'min',
   hrs: 'hr'
 }
}).on('changeTime', function(){
console.log('onTimechange')
 // When the first input is selected, set its value as minTime. This should be 15 minutes higher
 timepickerEnd.timepicker('option', { 
   'minTime': timepickerStart.val() + step,
   'timeFormat': 'H:i:s'
 });


 for (var i = 5; i <= 60; i += 5) {
  $('#meeting').append('<option value="' + i + '">' + i + '   min' + '</option>');
}

function setEndTime() {
  var meetingLength = parseInt($('#meeting').find('option:selected').val() || 0),
    selectedTime = $('#start').timepicker('getTime');
  selectedTime.setMinutes(selectedTime.getMinutes() + parseInt(meetingLength, 10), 0);
  $('#end').timepicker('option', 'minTime', selectedTime);
  $('#end').timepicker('setTime', selectedTime);
  //  $('#end').timepicker('refresh');
}

$('#start').timepicker({
  'minTime': '8:00 AM',
  'maxTime': '9:00 PM',
  'step': 5
}).on('changeTime', function() {
  setEndTime();
});

$('#end').timepicker({
  'minTime': '8:00 AM',
  'maxTime': '9:00 PM',
  'step': function() {
    return parseInt($('#meeting').find('option:selected').val());
  }
});

$('#meeting').bind('change', function() {
  setEndTime();
});

});


});