// Delgetstei ajillah controller
var uiController = (function() {
})();

// Sanhuutei ajillah controller
var financeController = (function() {
})();

// Programm-n holbogch controller
var appController = (function(uiController, financeController) {
    var ctrlAddItem = function() {
    // Oruulah uguduliig delgetsees olj avna
    console.log("Delgetseer uguduluu avah heseg");

    // Olj avsan ugugduluudee sanhuugiiin controller-t damjuulj tend hadgalna

    // Olj avsan ugugduluudee web-deeree tohiroh hesegt gargana

    // Tusuv-g tootsoolono

    // Etsiin uldegdel tootsoog delgetsend gargana
    };
    document.querySelector(".add__btn").addEventListener("click", function() {
        ctrlAddItem();
    });
    document.addEventListener("keypress", function(event) {
        if (event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
        };
    });
})(uiController, financeController);
