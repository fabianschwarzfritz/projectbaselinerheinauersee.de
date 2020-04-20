$(document).ready(function() {
    // Light/Dark of navigation links
    $(".nav-link").on("click", function() {
        $(".nav-item").find(".active").removeClass("active");
        $(this).addClass("active");
    });
});
