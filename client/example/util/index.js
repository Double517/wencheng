
export function getWXCode() {
    return getParameterByName('code');
}

function getParameterByName(name) {
    console.log(window.location);
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.hash);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
