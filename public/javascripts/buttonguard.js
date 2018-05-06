$(document).ready(function(){
  $('input[type="text"]').keyup(function() {
    if($(this).val() != '') {
      $('button[type="submit"]').prop('disabled', false);
    } else {
      $('button[type="submit"]').attr('disabled', 'disabled');
    }
  });
});
