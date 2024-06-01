let sayacCalistirici = true;
let logos = [];
let sehirler = [];
let marketSayisi = 0;
let sehirSayisi = 0;

function appendLogos(logos) {
    logos.forEach(logo => {
        if (sayacCalistirici) marketSayisi++;
        $('#marketler').append(
            '<div class="col-4 col-md-3 col-lg-2 p-2" style="height: 120px;">' +
            '<div class="border octo-logo p-3 shadow-sm" style="background-color: #F4F4F4; height: 100%; width: 100%; border-radius: 15px; display: flex; align-items: center; flex-wrap: wrap;" data-toggle="tooltip" data-placement="bottom" title="' + logo.name + '">' +
            '<img class="img-fluid mx-auto d-block rounded" src="/assets/marketler/' + logo.src + '" style="max-width: 100%; max-height: 100%;" alt="' + logo.name + '">' +
            '</div>' +
            '</div>'
        );
    });
    $('[data-toggle="tooltip"]').tooltip();
}
function appendSehirler(sehirler, logos) {
    sehirler.forEach(sehir => {
        if (logos.filter(logo => {return logo.filter.includes(sehir.value);}).length !== 0) {
            if (sayacCalistirici) sehirSayisi++;
            $('#sehirler').append(
                '<option value="' + sehir.value + '">' + sehir.name + '</option>'
            )
        }
    });
}

function setStoreLinks() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        $("#app_store_link").attr("href", "https://app.adjust.com/1bi9b1s");
        $("#google_store_link").attr("href", "https://app.adjust.com/1bi9b1s");
        $("#huawei_store_link").attr("href", "https://appgallery.huawei.com/#/app/C102895789");
    } else {
        $("#app_store_link").attr("href", "https://apps.apple.com/app/marketyo/id1311612291");
        $("#google_store_link").attr("href", "https://play.google.com/store/apps/details?id=com.marketyo.platform");
        $("#huawei_store_link").attr("href", "https://appgallery.huawei.com/#/app/C102895789");
    }
}

$(window).resize(() => {
    let vh = window.innerHeight * 0.01;
    $('#baslarken').css('--vh', `${vh}px`);
    $('.tanitim-ici').css('--vh', `${vh}px`);
});

$(document).ready(function () {
    setStoreLinks();
    let vh = window.innerHeight * 0.01;
    $('#baslarken').css('--vh', `${vh}px`);
    $('.tanitim-ici').css('--vh', `${vh}px`);

    $.getJSON("assets/js/marketler.json", function (dataMarketler) {
        logos = dataMarketler.sort((a, b) => a.src.localeCompare(b.src));
        $.getJSON("assets/js/sehirler.json", function (dataSehirler) {
            sehirler = dataSehirler;
            appendLogos(logos);
            appendSehirler(sehirler, logos);
            if (sayacCalistirici) {
                $("#sehirSayisi").html(sehirSayisi);
                $("#marketSayisi").html(marketSayisi);
                sayacCalistirici = false;
            }
        })
    })
});

$(document).scroll(function () {
    if (document.body.scrollTop > $(window).height()/2 || document.documentElement.scrollTop > $(window).height()/2) {
        $("#navbar").toggleClass('d-none', false);
    } else {
        $("#navbar").toggleClass('d-none', true);
    }
});

$('#sehirler').change(function () {
    const selected = $('#sehirler').children("option:selected").val();
    $('#marketler').empty();
    appendLogos(
        selected === 'tumiller'
            ? logos
            : logos.filter(logo => {return logo.filter.includes(selected);})
    );
    if (selected !== 'tumiller' && logos.filter(logo => {return logo.filter.includes(selected);}).length === 0) {
        $('#marketler').append(
            '<div class="alert alert-warning btn-block ml-3 mr-3 mb-0" role="alert">' +
            'Üzgünüz. Seçilen şehirde Marketyo üyesi herhangi bir market maalesef bulunmuyor.' +
            '</div>'
        );
    }
});

$('#iletisimformu').submit(function(event) {
    event.preventDefault();
    const action = $(this).attr("action");
    const data = new FormData(this);
    console.log(data.get('g-recaptcha-response'));
    if (data.get('g-recaptcha-response') === "") {
        $('#formalani').empty();
        $('#formalani').append(
            '<div class="alert alert-warning btn-block text-center mb-0" role="alert">' +
            'Sayın <strong>"' + data.get('name') + '"</strong>, form gönderimi sırasında reCAPTCHA doğrulamasından kaynaklı bir hata oluştu. Lütfen daha sonra tekrar deneyin.' +
            '</div>'
        );
        return;
    } else {
        $.ajax({
            type: "POST",
            url: action,
            crossDomain: true,
            data: data,
            dataType: "json",
            processData: false,
            contentType: false,
            headers: {
                "Accept": "application/json"
            }
        }).done(function() {
            $('#formalani').empty();
            $('#formalani').append(
                '<div class="alert alert-success btn-block text-center mb-0" role="alert">' +
                'Sayın <strong>"' + data.get('name') + '"</strong>, <strong>"' + data.get('email') + '"</strong> eposta adresiyle tarafımıza ilettiğiniz <strong>"' + data.get('message') + '"</strong> mesajınız alınmıştır.' +
                '</div>'
            );
        }).fail(function() {
            $('#formalani').empty();
            $('#formalani').append(
                '<div class="alert alert-danger btn-block text-center mb-0" role="alert">' +
                'Sayın <strong>"' + data.get('name') + '"</strong>, <strong>"' + data.get('email') + '"</strong> eposta adresiyle tarafımıza iletmek istediğiniz <strong>"' + data.get('message') + '"</strong> mesajınızın gönderimi sırasında bir hata ile karşılaşılmıştır. Lütfen daha sonra tekrar deneyin.' +
                '</div>'
            );
        });
    }
});