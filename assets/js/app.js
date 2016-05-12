$(document).ready(function () {
    $(".typed-header").typed({
        strings: ["<span style='color:#006e20'>~/^200</span>louis^200-^100rassaby^100<span style='color:#006e20'>/</span>"],
        typeSpeed: 80,
        startDelay: 1000
    });
    $(".navbar-nav li a").click(function (event) {
        $(".navbar-collapse").collapse('hide');
    });
    $('#fullpage').fullpage({
        anchors: ['home', 'about', 'about2'],
        menu: '#main-menu',
        fixedElements: '#navbar-main',
        sectionsColor: ['white', '#4BBFC3', '#7BAABE', 'whitesmoke', '#000']
    });
});