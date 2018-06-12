jQuery(function($) {
  $("#menu-button").on("click", function() {
    $("#main-menu").toggleClass("menu-visible");
    $(this).toggleClass("menu-visible");
  });

  var $form = $('#add-row-form');

  $(".add-row-button").on("click", function() {
    $form.slideToggle(function(){
      $(!$form.hasClass("form-hidden"))
        resetForm($form);
      $form.toggleClass("form-hidden");
      $(".add-row-button").toggleClass("open-form");
    });  
  });

  $("#dataTable").on("click", "th i", function() {
    var index = $("#dataTable thead tr th").index($(this).parent());
    sortTable(index);
  });

  $('#add-row-form :input:not([type="submit"])').focusin(function() {
    $('#add-row-form :input:not([type="submit"])').removeClass("error");
  });

  $("#search").on("keyup", searchTable);

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
  $('input[name="daterange"]').daterangepicker({
    opens: 'left'
  }, function(start, end, label) {

    var date1 = start.format('YYYY-MM').split('-'),
      date2 = end.format('YYYY-MM').split('-'),
      data = {
        x:new Date(date1[0], date1[1]-1).getTime(),
        y:new Date(date2[0], date2[1]-1).getTime()
      }
    $.ajax({
      type: "POST",
      url: "/get_date_filter",
      data: data,
      success: function( response ) {
        console.log(response);
      }
    });
  });
  $("span.next").on('click', function(event) {
    event.preventDefault();
    /* Act on the event */
    var data = {
      pageNum: 2,
      pageSize: 5
    };
    $.ajax({
      type: "GET",
      url: "/vincent-de-paul",
      data: data,
      success: function( response ) {
        var template = 
          "<tr data-node-id='<%= data._id %>'>"+
            "<td><%= data.date.slice(0,7) %></td>"+
            "<td><%= data.voucher %></td>"+
            "<td><%= data.details %></td>"+
            "<td><%= data.credit %></td>"+
            "<td><%= data.debit %></td>"+
            "<td><%= data.bank_credit_debit %></td>"+
            "<td><%= data.cash_in_bank %></td>"+
            "<td><%= data.cash_in_hand %></td>"+
          "</tr>", html;
        $(response).each(function(index, el) {
          html += ejs.render(template, {data: el});
        });
        $("#dataTable tbody").html(html);
      }
    });
  });
  // initPagination();
});

var addNewRow = function(data) {

  var template = 
    "<tr data-node-id='<%= data._id %>'>"+
      "<td><%= data.date.slice(0,7) %></td>"+
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
  $form = $('#add-row-form :input:not([type="submit"])');
  $form.each(function(index,item){
    $(item).removeClass("error");
  });
}

function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("dataTable");
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc"; 
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.getElementsByTagName("TR");
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < (rows.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = parseInt(rows[i].getElementsByTagName("TD")[n].innerHTML);
      y = parseInt(rows[i + 1].getElementsByTagName("TD")[n].innerHTML);
      if (n == 2) {
        x = rows[i].getElementsByTagName("TD")[n].innerHTML.toLowerCase();
        y = rows[i + 1].getElementsByTagName("TD")[n].innerHTML.toLowerCase();
      } else if (n == 0) {
        var $first = rows[i].getElementsByTagName("TD")[n],
          $second = rows[i + 1].getElementsByTagName("TD")[n],
          date1 = $first.innerHTML.split('-'),
          date2 = $second.innerHTML.split('-');
        x = new Date(date1[0], date1[1]-1).getTime();
        y = new Date(date2[0], date2[1]-1).getTime();
      }
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dir == "asc") {
        if (x > y) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x < y) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount ++; 
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

var initPagination = function() {
  // Consider adding an ID to your table
  // incase a second table ever enters the picture.
  var items = $("#dataTable tbody tr");

  var numItems = items.length;
  var perPage = 5;

  // Only show the first 2 (or first `per_page`) items initially.
  items.slice(perPage).hide();

  // Now setup the pagination using the `.pagination-page` div.
  $(".pagination-page").pagination({
      items: numItems,
      itemsOnPage: perPage,
      cssStyle: "light-theme",

      // This is the actual page changing functionality.
      onPageClick: function(pageNumber) {
          // We need to show and hide `tr`s appropriately.
          var showFrom = perPage * (pageNumber - 1);
          var showTo = showFrom + perPage;

          // We'll first hide everything...
          items.hide()
               // ... and then only show the appropriate rows.
               .slice(showFrom, showTo).show();
      }
  });



  // EDIT: Let's cover URL fragments (i.e. #page-3 in the URL).
  // More thoroughly explained (including the regular expression) in: 
  // https://github.com/bilalakil/bin/tree/master/simplepagination/page-fragment/index.html

  // We'll create a function to check the URL fragment
  // and trigger a change of page accordingly.
  function checkFragment() {
      // If there's no hash, treat it like page 1.
      var hash = window.location.hash || "#page-1";

      // We'll use a regular expression to check the hash string.
      hash = hash.match(/^#page-(\d+)$/);

      if(hash) {
          // The `selectPage` function is described in the documentation.
          // We've captured the page number in a regex group: `(\d+)`.
          $(".pagination-page").pagination("selectPage", parseInt(hash[1]));
      }
  };

  // We'll call this function whenever back/forward is pressed...
  $(window).bind("popstate", checkFragment);

  // ... and we'll also call it when the page has loaded
  // (which is right now).
  checkFragment();
}

var searchTable = function() {
  var input, filter, table, tr, td, i;
  input = document.getElementById("search");
  filter = input.value.toUpperCase();
  table = document.getElementById("dataTable");
  tr = table.getElementsByTagName("TR");

  removeHighlighting($("#dataTable tr em"));

/*  $(tr).each(function(index) {
    if (index !== 0) {
      $row = $(this);

      var $tdElement = $row.find("td:nth-child(3)");
      var value = $tdElement.text();
      var matchedIndex = value.toUpperCase().indexOf(filter);

      if (matchedIndex > -1) {
        if ($row.hasClass('hide-row')) $row.removeClass('hide-row');
        addHighlighting($tdElement, filter, matchedIndex);
      } else {
        $row.addClass('hide-row');
      }
    }
  });*/

  window.location = "/vincent-de-paul/search/"+input.value
}

// removes highlighting by replacing each em tag within the specified elements with it's content
var removeHighlighting = function(highlightedElements) {
    highlightedElements.each(function(){
        var element = $(this);
        element.replaceWith(element.html());
    })
}

// add highlighting by wrapping the matched text into an em tag, replacing the current elements, html value with it
var addHighlighting = function(element, textToHighlight, index) {
    var text = element.text(),
      newText = text.substring(0,index) + '<em>' + text.substring(index,index+textToHighlight.length) + '</em>' + text.substring(index+textToHighlight.length,text.length);

    element.html(newText);
}