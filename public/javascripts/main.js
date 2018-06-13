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
    var sortBy = $(this).parent().data("sort"), nextUrl,
      url = window.location.pathname.split("/");
    if (url[2] == "sortBy") {
      url[3] = sortBy;
    } else {
      nextUrl = url.insert(2, "sortBy/" + sortBy);
    }
    nextUrl = url.join("/");

    window.location = nextUrl

    // sortTable(index);
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
      };
    window.location = "/vincent-de-paul/get_date_filter?x="+data.x+"&y="+data.y
  });
  var startPage = parseInt(window.location.pathname.split('/').slice(-1)[0]) > 0 ? parseInt(window.location.pathname.split('/').slice(-1)[0]) : 1;
  startPage = parseInt(window.location.pathname.split('/').slice(-1)[0]) > Math.ceil($("#total").val()/5) ? 1 : startPage;
  $('#pagination').twbsPagination({
      totalPages: Math.ceil($("#total").val()/5),
      visiblePages: 5,
      startPage: startPage,
      initiateStartPageClick: false,
      onPageClick: changeToPage
  });
});

Array.prototype.insert = function ( index, item ) {
    this.splice( index, 0, item );
};

var changeToPage = function(event, pageNum) {
    event.preventDefault();
    var data = {
      pageNum: pageNum,
      pageSize: 5
    };
/*    $.ajax({
      type: "GET",
      url: "/vincent-de-paul/"+data.pageNum,
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
    });*/
    var page = window.location.pathname.split("/").slice(-1), nextUrl;
    if(isNaN(page)) {
      nextUrl = window.location.pathname + "/" + data.pageNum;
    } else {
      nextUrl = window.location.pathname.replace(page, data.pageNum);
    }
    window.location = nextUrl
  }

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

  window.location = "/vincent-de-paul/" + (input.value == "" ? "" : "search/" + input.value + "/1");
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