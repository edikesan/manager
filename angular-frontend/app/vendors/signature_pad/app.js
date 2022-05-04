console.log('Start');

var wrapper1, clearButton, canvas1, signaturePad1,
	wrapper2, clearButton2, canvas2, signaturePad2;

function initSignaturePads() {

    wrapper1 = document.getElementById("signature-pad-1");
    clearButton = wrapper1.querySelector("[data-action=clear]");
    canvas1 = wrapper1.querySelector("canvas");
    wrapper2 = document.getElementById("signature-pad-2");
    clearButton2 = wrapper2.querySelector("[data-action=clear-2]");
    canvas2 = wrapper2.querySelector("canvas");

    signaturePad1 = new SignaturePad(canvas1);
    signaturePad2 = new SignaturePad(canvas2);

    signPadResizeAll();

    clearButton.addEventListener("click", function (event) {
        console.log('Call Clear 1');
        signaturePad1.clear();
    });

    clearButton2.addEventListener("click", function (event) {
        console.log('Call Clear 2');
        signaturePad2.clear();
    });
}

function signPadResizeAll() {

    resizeCanvas1();
    resizeCanvas2();
}

// Adjust canvas coordinate space taking into account pixel ratio,
// to make it look crisp on mobile devices.
// This also causes canvas to be cleared.
function resizeCanvas1() {

    console.log('Call Resize 1');
    // When zoomed out to less than 100%, for some very strange reason,
    // some browsers report devicePixelRatio as less than 1
    // and only part of the canvas is cleared then.
    var ratio =  Math.max(window.devicePixelRatio || 1, 1);
    canvas1.width = canvas1.offsetWidth * ratio;
    canvas1.height = canvas1.offsetHeight * ratio;
    canvas1.getContext("2d").scale(ratio, ratio);
}

// Adjust canvas coordinate space taking into account pixel ratio,
// to make it look crisp on mobile devices.
// This also causes canvas to be cleared.
function resizeCanvas2() {

    console.log('Call Resize 2');
    // When zoomed out to less than 100%, for some very strange reason,
    // some browsers report devicePixelRatio as less than 1
    // and only part of the canvas is cleared then.
    var ratio =  Math.max(window.devicePixelRatio || 1, 1);
    canvas2.width = canvas2.offsetWidth * ratio;
    canvas2.height = canvas2.offsetHeight * ratio;
    canvas2.getContext("2d").scale(ratio, ratio);
}

function getSignatures(){

    var signatures = {};

    if (!signaturePad1.isEmpty()) {
        signatures.customer = signaturePad1.toDataURL();
        console.log(signatures.customer);
    }

    if (!signaturePad2.isEmpty()) {
        signatures.sales_staff = signaturePad2.toDataURL();
        console.log(signatures.sales_staff);
    }

    return signatures;
}