$( document ).ready(function() {
    $('#like').click(function(e) {
      e.preventDefault();
      console.log('select_link clicked');
      var data = $(this).attr('href');

      $.ajax({
      type:"GET",
      url: data,
      success: function(data) {
        $('#likes').text(data.event + " " + "Person likes this")
      }
      });
    });
});
