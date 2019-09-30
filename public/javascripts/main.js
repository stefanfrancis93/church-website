jQuery(function ($) {
  var date;
  $("#menu-button").on("click", function () {
    $("#main-menu").toggleClass("menu-visible");
    $(this).toggleClass("menu-visible");
  });

  var $form = $('#add-row-form');

  $(".add-row-button").on("click", function () {
    $form.slideToggle(function () {
      $(!$form.hasClass("form-hidden"))
      resetForm($form);
      $form.toggleClass("form-hidden");
      $(".add-row-button").toggleClass("open-form");
    });
  });

  $("#dataTable").on("click", "th i", function () {
    var sortBy = $(this).parent().data("sort"), nextUrl,
      url = window.location.pathname.split("/");
    if (url[2].indexOf("sortBy") > -1) {
      url[2] = "sortBy=" + sortBy;
    } else {
      nextUrl = url.insert(2, "sortBy=" + sortBy);
    }
    nextUrl = url.join("/") + window.location.search;

    // window.location = nextUrl

    // sortTable(index);
  });

  $('#add-row-form :input:not([type="submit"])').focusin(function () {
    $(this).removeClass("error");
  });

  $("#search").on("keyup", function (e) {
    if (e.keyCode === 13) {
      searchTable(date);
    }
  });

  $form.on("submit", function (event) {
    event.preventDefault();
    if (validateForm()) return;
    var form = $(this),
      url = form.attr('action');
    $.ajax({
      type: "POST",
      url: url,
      data: form.serialize(),
      success: function (response) {
        alert("Success");
        resetForm($form);
        $(addNewRow(response)).insertAfter("#dataTable thead");
      }
    });
  });
  $('input[name="daterange"]').daterangepicker({
    opens: 'left'
  }, function (start, end, label) {

    var date1 = start.format('YYYY-MM').split('-'),
      date2 = end.format('YYYY-MM').split('-'),
      data = {
        x: new Date(date1[0], date1[1] - 1).getTime(),
        y: new Date(date2[0], date2[1] - 1).getTime()
      };
    date = data
    // window.location = "/vincent-de-paul/get_date_filter?s=" + data.x + "&e=" + data.y
  });
  var pageParam = window.location.href.split('/').slice(-1)[0],
    pageNum = parseInt(pageParam.substring(pageParam.indexOf("page=") + 5)),
    startPage = pageNum > 0 && pageNum <= Math.ceil($("#total").val() / 5) ? pageNum : 1;
  $('#pagination').twbsPagination({
    totalPages: Math.ceil($("#total").val() / 5),
    visiblePages: 5,
    startPage: startPage,
    initiateStartPageClick: false,
    onPageClick: changeToPage
  });
  searchHighlighting();
});

Array.prototype.insert = function (index, item) {
  this.splice(index, 0, item);
};

var changeToPage = function (event, pageNum) {
  event.preventDefault();
  var data = {
    pageNum: pageNum,
    pageSize: 5
  };
  var totalPath = window.location.pathname + window.location.search,
    page = totalPath.split("/").slice(-1)[0], nextUrl;
  if (page.indexOf("page=") > -1) {
    nextUrl = totalPath.replace(totalPath.substring(totalPath.indexOf("page=")), "page=" + data.pageNum);
  } else {
    nextUrl = totalPath + "page=" + data.pageNum;
  }
  window.location = nextUrl
}

var addNewRow = function (data) {

  var template =
    "<tr data-node-id='<%= data._id %>'>" +
    "<td><%= data.date.slice(0,7) %></td>" +
    "<td><%= data.voucher %></td>" +
    "<td><%= data.details %></td>" +
    "<td><%= data.credit %></td>" +
    "<td><%= data.debit %></td>" +
    "<td><%= data.bank_credit_debit %></td>" +
    "<td><%= data.cash_in_bank %></td>" +
    "<td><%= data.cash_in_hand %></td>" +
    "</tr>",
    html = ejs.render(template, { data: data });
  return html;

}

var validateForm = function () {
  var $form = $('#add-row-form :input:not([type="submit"])'),
    isEmpty = false;
  $form.each(function (index, item) {
    var value = $(item).val();
    if (!value) {
      $(item).addClass("error");
      isEmpty = true;
    }
  });
  return isEmpty;
}

var resetForm = function ($form) {
  $form[0].reset();
  $form = $('#add-row-form :input:not([type="submit"])');
  $form.each(function (index, item) {
    $(item).removeClass("error");
  });
}

var searchTable = function (date) {
  var input = document.getElementById("search");

  window.location = "/vincent-de-paul/" + (input.value == "" ? "" : "search=" + input.value + '"/get_date_filter?s=" + date.x + "&e=" + date.y"' + "&page=1");
}

// removes highlighting by replacing each em tag within the specified elements with it's content
var removeHighlighting = function (highlightedElements) {
  highlightedElements.each(function () {
    var element = $(this);
    element.replaceWith(element.html());
  })
}

// add highlighting by wrapping the matched text into an em tag, replacing the current elements, html value with it
var addHighlighting = function (element, textToHighlight, index) {
  var text = element.text(),
    newText = text.substring(0, index) + '<em>' + text.substring(index, index + textToHighlight.length) + '</em>' + text.substring(index + textToHighlight.length, text.length);

  element.html(newText);
}

var searchHighlighting = function () {
  var input, filter, table, tr, td, i, $tdElement, value, matchedIndex;
  input = document.getElementById("search");
  filter = input.value.toUpperCase();
  table = document.getElementById("dataTable");
  tr = table.getElementsByTagName("TR");

  removeHighlighting($("#dataTable tr em"));
  $(tr).each(function (index) {
    $row = $(this);

    var $tdElement = $row.find("td:nth-child(3)");
    var value = $tdElement.text();
    var matchedIndex = value.toUpperCase().indexOf(filter);

    addHighlighting($tdElement, filter, matchedIndex);
  });
}