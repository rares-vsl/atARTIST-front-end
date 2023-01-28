export function setToast(location, msg, status) {
    var toast = {
        location: location,
        msg: msg,
        status: status
    }

    localStorage.setItem('toast', JSON.stringify(toast))
}