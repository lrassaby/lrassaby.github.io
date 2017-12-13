document.addEventListener("DOMContentLoaded", function () {
    var grid = document.querySelector('.post-grid');

    var iso = new Isotope(grid, {
        itemSelector: '.grid-item',
        columnWidth: '.grid-sizer',
        percentPosition: true,
        layoutMode: 'packery'
    });


    imagesLoaded(grid).on('progress', function () {
        // layout Isotope after each image loads
        iso.layout();
    });


    // https://codepen.io/desandro/pen/BgcCD

    // filter functions
    var filterFns = {};

    // bind filter button click
    var filtersElem = document.querySelector('.filter-buttons');
    filtersElem.addEventListener('click', function (event) {
        // only work with buttons
        if (!matchesSelector(event.target, 'button')) {
            return;
        }
        var filterValue = event.target.getAttribute('data-filter');

        // use matching filter function
        filterValue = filterFns[filterValue] || filterValue;
        iso.arrange({filter: filterValue});

        // reselect in UI
        var selected = filtersElem.querySelector('.btn-primary');
        if (selected !== null) {
            selected.classList.remove('btn-primary');
            selected.classList.add('btn-secondary');
        }
        event.target.classList.remove('btn-secondary');
        event.target.classList.add('btn-primary');
    });
}, !1);