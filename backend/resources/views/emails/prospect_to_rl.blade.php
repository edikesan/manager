<table>
    <tr>
        <td style="font-size: 12pt;padding-bottom: 20px;padding-top: 20px;font-weight: bold;" colspan="2">Allgemeine Angaben</td>
    </tr>
    <tr>
        <td style="width: 180px;">Anrede:</td>
        <td style="font-weight: bold;">{{$prospect['address']['salutation']}}</td>
    </tr>
    <tr>
        <td>Vorname / Nachname:</td>
        <td style="font-weight: bold;">{{$prospect['address']['first_name']}} {{$prospect['address']['last_name']}}</td>
    </tr>
    <tr>
        <td>Straße:</td>
        <td style="font-weight: bold;">{{$prospect['address']['street']}}</td>
    </tr>
    <tr>
        <td>PLZ / Ort (Ortsteil):</td>
        <td style="font-weight: bold;">{{$prospect['address']['postcode']}} {{$prospect['address']['city']}} ({{$prospect['address']['district']}})</td>
    </tr>
    <tr>
        <td>Telefon:</td>
        <td style="font-weight: bold;">{{$prospect['address']['telephone']}}</td>
    </tr>
    <tr>
        <td>Mobiltelefon:</td>
        <td style="font-weight: bold;">{{$prospect['address']['mobilephone']}}</td>
    </tr>
    <tr>
        <td>Fax:</td>
        <td style="font-weight: bold;">{{$prospect['address']['fax']}}</td>
    </tr>
    <tr>
        <td>E-Mail:</td>
        <td style="font-weight: bold;">{{$prospect['address']['email']}}</td>
    </tr>

    <tr>
        <td style="font-size: 12pt;padding-bottom: 20px;padding-top: 20px;font-weight: bold;" colspan="2">Zusatzadressen</td>
    </tr>
    @foreach ($prospect['addresses'] as $address)
    <tr>
        <td colspan="2">{{ $address['first_name']}} {{ $address['last_name'] }}, {{ $address['street'] }}, {{ $address['postcode'] }} {{ $address['city'] }} ({{ $address['district'] }})</td>
    </tr>
    @endforeach

    <tr>
        <td style="font-size: 12pt;padding-bottom: 20px;padding-top: 20px;font-weight: bold;" colspan="2">Produkte</td>
    </tr>
    @foreach ($prospect['products'] as $product)
    <tr>
        <td colspan="2">{{ $product['section']}} {{ $product['product_type']}}, {{ $product['consumption']}} kWh</td>
    </tr>
    @endforeach

    <tr>
        <td style="font-size: 12pt;padding-bottom: 20px;padding-top: 20px;font-weight: bold;" colspan="2">Notizen</td>
    </tr>
    @foreach ($prospect['comments'] as $comment)
    <tr>
        <td colspan="2" style="padding-bottom: 10px;"><b>{{$comment['user']['name']}}</b>, <span style="font-size: 8pt;">{{$comment['created_at_formated']}} Uhr</span><br>{{$comment['comment_text']}}</td>
    </tr>
    @endforeach

</table>