$(document).ready(function () {
    $('#btnCollapse').click(function () {
        // $('#my-sidebar').toggleClass('my-sidebar', 1000)
        $('#my-sidebar').animate({ width: 'toggle' }, 350);
    });

    $('#btnavatar').click(function () {
        // $('#my-sidebar').toggleClass('my-sidebar', 1000)
        if ($('#my-setting').is(":hidden")) {
            $('#my-setting').slideDown("slow")
        } else {
            $('#my-setting').hide();
        }
    });
});