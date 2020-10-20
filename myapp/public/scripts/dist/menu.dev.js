"use strict";

$(document).ready(function () {
  $('#btnCollapse').click(function () {
    // $('#my-sidebar').toggleClass('my-sidebar', 1000)
    $('#my-sidebar').animate({
      width: 'toggle'
    }, 350);
  });
  $('#btnavatar').click(function () {
    // $('#my-sidebar').toggleClass('my-sidebar', 1000)
    if ($('#my-setting').is(":hidden")) {
      $('#my-setting').slideDown("slow");
    } else {//$('#my-setting').hide();
    }
  });
  $(document).click(function (e) {
    var containermenu = $('.mysetting');

    if (!containermenu.is(e.target) && containermenu.has(e.target).length === 0) {
      //Đúng là bấm chuột ngoài menu
      var isopened = containermenu.find('#my-setting').css("display"); //Ẩn menu đang mở

      if (isopened == 'block') {
        containermenu.find('#my-setting').slideToggle(500);
      }
    }
  });
});