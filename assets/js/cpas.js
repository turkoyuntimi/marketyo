const path = window.location.pathname;

function getOS() {
    const
        userAgent = window.navigator.userAgent,
        platform = window.navigator.platform,
        iosPlatforms = ['iPhone', 'iPad', 'iPod'];
    let os = null;
    if (iosPlatforms.indexOf(platform) !== -1) os = 'ios';
    else if (/Android/.test(userAgent)) os = 'android';
    else os = 'other';
    return os;
}

if (path !== '/') {
    if (getOS() !== 'other') {
        if (path.includes('/product/')) {
            const path_name = window.location.pathname.substring(1);
            const path_array = path_name.split('/');
            setTimeout(function () { window.location = 'https://app.adjust.com/1bi9b1s'; }, 25);
            window.location = `marketyo://mcProduct?id=${path_array[1]}`;
        } else if (path.includes('/promotion/')) {
            const path_name = window.location.pathname.substring(1);
            const path_array = path_name.split('/');
            setTimeout(function () { window.location = 'https://app.adjust.com/1bi9b1s'; }, 25);
            window.location = `marketyo://promotion?id=${path_array[1]}`;
        } else {
            window.location.href = `/`;
        }
    } else {
        window.location.href = `/`;
    }
}