var textItems = document.getElementsByClassName("centered");
var flexItems = document.getElementsByClassName("flexbox-item");
var deviceWidth = window.innerWidth;
var itemWidth;

var allP = document.getElementsByTagName("p");

if (deviceWidth <= 420) {
    for (var i = 0; i < allP.length; i++)
        allP[i].style.fontSize = 16;

    for (var i = 0; i < flexItems.length; i++)
        flexItems[i].style.minWidth = deviceWidth*0.9;

    for (var i = 0; i < textItems.length; i++) {
        itemWidth = flexItems[i].clientWidth;
        textItems[i].style.paddingLeft = deviceWidth*0.05;
        textItems[i].style.paddingRight = deviceWidth*0.05;
    }
} 

// console.log(textItems);
// console.log(deviceWidth);
// console.log(allP);