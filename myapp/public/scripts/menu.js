$(document).ready(function () {
    var OriginalWidth = 256;
    $('#btnCollapse').click(function () {
        // $('#my-sidebar').toggleClass('my-sidebar', 1000)
        $('#my-sidebar').animate({ width: 'toggle' }, 350);

        // width = $('#my-sidebar').width();
        // if (OriginalWidth == width) {
        //     $('#my-sidebar').animate({ width: '50' }, 'slow');
        // }
        // else {
        //     $('#my-sidebar').animate({ width: OriginalWidth }, 'slow');
        // }
    });
});

$('#btnavatar').click(function () {
    // $('#my-sidebar').toggleClass('my-sidebar', 1000)
    if ($('#my-setting').is(":hidden")) {
        $('#my-setting').slideDown("slow")
    } else {
        //$('#my-setting').hide();
    }
});

$(document).click(function (e) {
    var containermenu = $('.mysetting');
    if (!containermenu.is(e.target) && containermenu.has(e.target).length === 0) {
        //Đúng là bấm chuột ngoài menu
        var isopened =
            containermenu.find('#my-setting').css("display");

        //Ẩn menu đang mở
        if (isopened == 'block') {
            containermenu.find('#my-setting').slideToggle(500);
        }
    }
});