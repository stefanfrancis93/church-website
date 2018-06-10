jQuery(function($) {
  $("#menu-button").on("click", function() {
    $("#main-menu").toggleClass("menu-visible");
    $(this).toggleClass("menu-visible");
  });

  var $form = $('#add-row-form');

  $(".add-row-button").on("click", function() {
    $form.slideToggle(function(){
      $form.toggleClass("form-hidden");
      $(".add-row-button").toggleClass("open-form");
    });  
  });

  $('#add-row-form :input:not([type="submit"])').focusin(function() {
    $('#add-row-form :input:not([type="submit"])').removeClass("error");
  });

  $form.on( "submit", function(event) {
    event.preventDefault();
    if(validateForm()) return;
    var form = $( this ),
        url = form.attr( 'action' );
    $.ajax({
      type: "POST",
      url: url,
      data: form.serialize(),
      success: function( response ) {
        alert("Success");
        resetForm($form);
        $(addNewRow(response)).insertAfter("#dataTable thead");
      }
    });
  });
});

var addNewRow = function(data) {

  var template = 
    "<tr>"+
      "<td><%= data.date %></td>"+
      "<td><%= data.voucher %></td>"+
      "<td><%= data.details %></td>"+
      "<td><%= data.credit %></td>"+
      "<td><%= data.debit %></td>"+
      "<td><%= data.bank_credit_debit %></td>"+
      "<td><%= data.cash_in_bank %></td>"+
      "<td><%= data.cash_in_hand %></td>"+
    "</tr>",
    html = ejs.render(template, {data: data});
    return html;

}

var validateForm = function() {
  var $form = $('#add-row-form :input:not([type="submit"])'),
    isEmpty = false;
  $form.each(function(index,item){
    var value = $(item).val();
    if (!value) {
      $(item).addClass("error");
      isEmpty = true;
    }
  });
  return isEmpty;
}

var resetForm = function($form) {
  $form[0].reset();
}