<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use SoapClient;
use App\Http\Requests;
use Validator;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class NetframeController extends Controller
{

    private $netframeConnPara = array(), $soapCl, $netframeConn;

    public function __construct()
    {
        // Apply the jwt.auth middleware to all methods in this controller
        // except for the authenticate method. We don't want to prevent
        // the user from retrieving their token if they don't already have it
        $this->middleware('jwt.auth', ['except' => ['authenticate']]);
    }


    public function connect()
    {
        if (\App::environment('live')) {
            $this->netframeConnPara = array(
                "rasHost" => "srverp10.intranet.rheingas.de",
                "clientName" => "Rheingas",
                "appContext" => 1,
                "userName" => "CRM",
                "userPw" => md5("crmrsd10"),
                "timeOut" => 1800,
                "readTimeOut" => 30);
        }else{
            $this->netframeConnPara = array(
                "rasHost" => "srverp11.intranet.rheingas.de",
                "clientName" => "Test4",
                "appContext" => 1,
                "userName" => "CRM",
                "userPw" => md5("crmrsd10"),
                "timeOut" => 3600,
                "readTimeOut" => 60);

        }

        // get object of PHP Soap Client
        $this->soapCl 		= new SoapClient("../gsdservice.xml");
        $this->netframeConn = $this->soapCl->openERPframeDB($this->netframeConnPara);	// do request
        $retCode 			= (int) $this->netframeConn->retCode;

        if($retCode === 200){
            return TRUE;
        }else{
            return FALSE;
        }
    }

    public function get($makro, $params = array("kundenid" => "133076", "vertragid" => "1947325"))
    {

        //Route: /backend/public/api/netframe/get/[makro]
        //_SV_NETFRAME_SAM_IMPORT_LOGIN - kundennummer => 710526
        //_SV_NETFRAME_SAM_EXPORT_KUNDE - kundenid => 133076
        //_SV_NETFRAME_SAM_EXPORT_VERTRAG - kundenid => 133076, vertragid => 133076

        $this->connect();
        $xml = $this->array2Xml($params);
        $para = array(
            "sessionID" => $this->netframeConn->sessionID,
            "requestName" => $makro,
            "readTimeOut" => 60,
            "input" => $xml
        );
//var_dump($para);
        $objResult = $this->soapCl->executeERPframeRequest($para);

        $retCode = (int)$objResult->retCode;

        if ($retCode === 200) {

            $xml = "";
            if (isset($objResult->output)) {
                $xml = (string)$objResult->output;


                //$arr = $xml;
                $arr = $this->xml2Array($xml);
            }

            $this->close();

            return $arr;

        } else {

            $this->close();
//var_dump($objResult);
            return response()->json(['error' => 'Netframe Anfrage fehlgeschlagen', 'RetCode' => $retCode], 200);
        }

        $this->close();
    }

public function console_log( $data ){
        echo '<script>';
        echo 'console.log('. json_encode( $data ) .')';
        echo '</script>';
    }

    /*
     * getCustomerByCustomerNumber
     */
    // Normaler Kunde $customerNumber = "710526" 123687 102368
    public function getCustomerByCustomerNumber( $customerNumber ){ //

        $erp_ret = $this->get("_SV_NETFRAME_CRM_IMPORT_LOGIN", $params = array("kundennummer" => $customerNumber));

        $kunden_id = $erp_ret['kundenid'];

                if(!empty($kunden_id)){
                    $erp_ret = $this->get("_SV_NETFRAME_CRM_EXPORT_KUNDE", $params = array("kundenid" => $kunden_id));
                    // Bei einem Vertrag kommt ein Objekt, bei mehreren ein Array -> Objekt wird zum Array umgebastelt, damit gleiche Struktur zurück kommt
                    if(isset($erp_ret['vertraege']['Vertrag'][0]['vertragid'])) {
                        foreach ($erp_ret['vertraege']['Vertrag'] as $key => $vertrag) {
                            if (isset($vertrag['vertragid'])) {
                                $erp_ret['vertraege']['Vertrag'][$key]['data'] = $this->get("_SV_NETFRAME_CRM_EXPORT_VERTRAG", $params = array("vertragid" => $vertrag['vertragid'], "kundenid" => $kunden_id));
                            }
                        }
                    }
                    else{
                        $temp = $erp_ret['vertraege']['Vertrag'];
                        unset($erp_ret['vertraege']['Vertrag']);
                        $erp_ret['vertraege']['Vertrag'] = array(0 => $temp);
                        $erp_ret['vertraege']['Vertrag'][0]['data'] = $this->get("_SV_NETFRAME_CRM_EXPORT_VERTRAG", $params = array("vertragid" => $erp_ret['vertraege']['Vertrag'][0]['vertragid'], "kundenid" => $kunden_id));
                    }
                    // das gleiche wie oben bei Vertrag, wenn kein Array, dann wird als array[0] geändert
                    if(!isset($erp_ret['vertraege']['Vertrag'][0]['data']['Vertrag']['Bestellungen']['Bestellung'][0]['Bestelldatum']) &&
                        isset($erp_ret['vertraege']['Vertrag'][0]['data']['Vertrag']['Bestellungen']['Bestellung'])) {
                        $temp = $erp_ret['vertraege']['Vertrag'][0]['data']['Vertrag']['Bestellungen']['Bestellung'];
                        unset($erp_ret['vertraege']['Vertrag'][0]['data']['Vertrag']['Bestellungen']['Bestellung']);
                        $erp_ret['vertraege']['Vertrag'][0]['data']['Vertrag']['Bestellungen']['Bestellung'] = array(0 => $temp);
                    }
                }
                else{
                    $erp_ret['kundennummer'] = $customerNumber;
                    $erp_ret['result'] = false;
                }

        return $erp_ret;

    }

    public function getProjects($project)
    {
        $erp_ret = $this->get("_SV_NETFRAME_BESCHAFFUNG_EXPORT_PROJEKTE", $params = array("lieferantenid" => $project));
        return [$erp_ret];
    }

    public function createWe($data)
    {
        $store_data = json_decode ($data);
        $erp_ret = $this->get("_SV_NETFRAME_BESCHAFFUNG_IMPORT_WE", $params = array("rowid" => $store_data->rowid));
        //$erp_ret = array('status' => '0');
        return [$erp_ret];
    }

    public function getProjectData($project)
    {
        $project = json_decode ($project);
        $project['lieferantenid'] = '6692';
        $erp_ret = $this->get("_SV_NETFRAME_BESCHAFFUNG_EXPORT_PROJEKTE", $params = $project);
        return [$erp_ret];
    }

    public function getStoresByDate($date_value)
    {
        $erp_ret = $this->get("_SV_NETFRAME_BESCHAFFUNG_EXPORT_STATIONEN", $params = array("JahrMonat" => $date_value));
        return [$erp_ret];
    }

    public function getStoreAdministration($store)
    {
        $erp_ret = $this->get(" _SV_NETFRAME_BESCHAFFUNG_EXPORT_ZUGANG", $params = array("lagernr" => $store));
        return [$erp_ret];
    }

    public function getStoreLeaving($store)
    {
        $erp_ret = $this->get(" _SV_NETFRAME_BESCHAFFUNG_EXPORT_LAGERSTAMM", $params = array("lagernr" => $store));
        return [$erp_ret];
    }

    public function getFhtGasabgaenge($store)
    {
        $erp_ret = $this->get(" _SV_NETFRAME_BESCHAFFUNG_EXPORT_ABGANG_FHT", $params = array("lagernr" => $store));
        return [$erp_ret];
    }

    public function getGrosshandelGasabgaenge($store)
    {
        $erp_ret = $this->get(" _SV_NETFRAME_BESCHAFFUNG_EXPORT_ABGANG_GROSSHANDEL", $params = array("lagernr" => $store));
        return [$erp_ret];
    }

    public function getSpeditionen($store)
    {
        $erp_ret = $this->get(" _SV_NETFRAME_BESCHAFFUNG_EXPORT_LAGER_SPEDITEURE", $params = array("lagernr" => $store));
        return [$erp_ret];
    }

    public function getSpeditionFlaschen($store)
    {
        $erp_ret = $this->get(" _SV_NETFRAME_BESCHAFFUNG_EXPORT_FLASCHEN", $params = array("lagernr" => $store));
        return [$erp_ret];
    }

    public function getKunden($store)
    {
        $erp_ret = $this->get("_SV_NETFRAME_BESCHAFFUNG_EXPORT_LAGER_SA", $params = array("lagernr" => $store));
        return [$erp_ret];
    }

    public function getAuswertung($request)
    {
        $erp_ret = $this->get("_SV_NETFRAME_BESCHAFFUNG_EXPORT_AUSWERTUNG_ABGANG", $params = $request );
//var_dump($erp_ret);
//print_r($erp_ret);
        return [$erp_ret];
    }

    public function createFhtGasabgang($gasAbgang)
    {
        $gasAbgang = json_decode($gasAbgang);
        $erp_ret = $this->get("_SV_NETFRAME_BESCHAFFUNG_IMPORT_GASABGANG_FHT",
            $params = array("datum" => $gasAbgang->{"datum"},
                            "produkt" => $gasAbgang->{"produkt"},
                            "lager" => $gasAbgang->{"lager"},
                            "menge" => $gasAbgang->{"menge"},
                            "bonnr" => $gasAbgang->{"bonnr"}));
        return [$erp_ret];
    }

    public function createGrosshandelGasabgang($gasAbgang){
        $gasAbgang = json_decode($gasAbgang);
        $erp_ret = $this->get("_SV_NETFRAME_BESCHAFFUNG_IMPORT_GASABGANG_GH",
            $params = array(
                "row_id" => $gasAbgang->{"row_id"},
                "datum" => $gasAbgang->{"datum"},
                "produkt" => $gasAbgang->{"produkt"},
                "lager" => $gasAbgang->{"lager"},
                "menge" => $gasAbgang->{"menge"},
                "bonnr" => $gasAbgang->{"bonnr"}));
        return [$erp_ret];
    }

    // eine universelle Funktion, die viele andere ersetzen könnte
    public function executeMacro($macroName, $request)
    {
        $erp_ret = $this->get($macroName, $params = $request );
        return [$erp_ret];
    }



    public function getStoreReview($store,$monat_jahr){
        $erp_ret = $this->get("_SV_NETFRAME_BESCHAFFUNG_EXPORT_LAGER", $params = array("lagernr" => $store, "monat_jahr" => $monat_jahr));
        return [$erp_ret];
    }

    public function getGasStations($lieferantenId){
        $erp_ret = $this->get("_SV_NETFRAME_BESCHAFFUNG_EXPORT_TANKSTELLEN", $params = array("lieferantenId" => $lieferantenId ));
        return [$erp_ret];
    }

    public function getSupplierReceipt($supplier_nr)
    {
        $erp_ret = $this->get("_SV_NETFRAME_BESCHAFFUNG_EXPORT_ZUGANGSPED", $params = array("spednr" => $supplier_nr));
        return [$erp_ret];
    }

    public function updateSupplierCheckData($rowid,$ladedatum,$entladedatum,$menge)
    {
//        print_r("rowid" . $rowid . ", ladedatum" . $ladedatum . ", menge" . $menge);
        $erp_ret = $this->get("_SV_NETFRAME_BESCHAFFUNG_UPDATE_ZUGANGSPED", $params = array( "rowid" => $rowid, "menge" => $menge, "ladedatum" => $ladedatum, "entladedatum" => $entladedatum ));
//        print_r("$erp_ret=".$erp_ret);
        return [$erp_ret];
    }

    public function updateTankstelleSupplierCheckData($rowid,$lieferscheinnr,$tkwkz,$ladedatum,$entladedatum,$menge,$mengeLtr,$temperatur,$fuellgrad,$bemerkung)
    {
        $erp_ret = $this->get("_SV_NETFRAME_BESCHAFFUNG_UPDATE_ZUGANGSPED_TS", $params = array("rowid" => $rowid, "lieferscheinnr" => $lieferscheinnr,
                                     "tkwkz" => $tkwkz,"ladedatum" => $ladedatum, "entladedatum" => $entladedatum, "menge" => $menge,
                                     "mengeltr" => $mengeLtr, "temperatur" => $temperatur, "_fuellgrad" => $fuellgrad, "bemerkung" => $bemerkung ));
        return [$erp_ret];
    }

    public function getWareneingaenge($request)
    {
        $erp_ret = $this->get("_SV_NETFRAME_BESCHAFFUNG_EXPORT_AUSWERTUNG_TS", $params = $request);
        return [$erp_ret];
    }


    public function updateGasStationsTour($request)
    {
        $erp_ret = $this->get("_SV_NETFRAME_BESCHAFFUNG_IMPORT_LADELISTE_ENTLADE", $params = $request);
//        print_r("$erp_ret=".$erp_ret);
        return [$erp_ret];
    }

    public function getSupplierDetailData($vertrag_nr,$projektnr)
    {
        $erp_ret = $this->get("_SV_NETFRAME_BESCHAFFUNG_EXPORT_LIEFERADRESSE", $params = array("vertragnr" => $vertrag_nr, "projektnr" => $projektnr));
        return [$erp_ret];
    }

    public function getStoreDetails($station_id)
    {
        $erp_ret = $this->get("_SV_NETFRAME_BESCHAFFUNG_EXPORT_STATIONSDETAILS", $params = array("stationid" => $station_id));
        return [$erp_ret];
    }

    public function updateStore($store_data)
    {
        $store_data['posid'] = $store_data['positionid'];
        $store_data['lagernr'] = $store_data['lagernr'];
        $store_data['produktid'] = $store_data['produkt_row_id'];
        $store_data['ladedatum'] = $store_data['ladedatum'];
        $store_data['entladedatum'] = $store_data['entladedatum'];
        $store_data['speditionsnr'] = $store_data['speditionnr'];
        if(empty($store_data['bemerkung'])){
            $store_data['bemerkung'] = '';
        }

        $erp_ret = $this->get("_SV_NETFRAME_BESCHAFFUNG_UPDATE_LADELISTE", $params = $store_data);
        return $erp_ret;
    }

    /*
     * getContractById
     */
    // Normaler Kunde $contractId = "1947325", $customerId = "133076"
    public function getContractById( $contractId = "126266", $customerId = "112649"){
        //  print_r($erp_ret);
        $erp_ret = $this->get("_SV_NETFRAME_CRM_EXPORT_VERTRAG", $params = array("vertragid" => $contractId, "kundenid" => $customerId ));
        return $erp_ret;
    }

    /*
     * PHP Array in XML konvertieren
     */
    protected function array2Xml( $arr ){

        $xml = "";
//var_dump($arr);
        foreach($arr as $key => $value){
            if (is_array($value)){
//                print_r("\n".$key. "--->" );
//                var_dump($value);
                if(is_numeric($key)){
                    // fuer den Fall <0>Daten </0>, damit 0 aus dem xml entfernt wird
                    $xml .= $this->array2Xml($value);
                }
                else{
                    $xml .= "<".$key." type=\"C\">".$this->array2Xml($value)."</".$key.">";
                }
            }
            else {
                $xml .= "<" . $key . " type=\"C\">" . $value . "</" . $key . ">";
            }
        }
//print_r("\n XML:\n")    ;
//var_dump($xml);
        return $xml;
    }


    /*
        XML in PHP Array konvertieren.
    */
    protected function xml2Array( $xml ){

        $saved  = libxml_use_internal_errors(true);
        $xml_object = simplexml_load_string(html_entity_decode($xml));
        $errors = libxml_get_errors();
        libxml_use_internal_errors($saved);

        $json = json_encode($xml_object);
        $arr = json_decode($json, TRUE);

        /*if(isset($arr['kunde']) AND !empty($arr['kunde'])) {
            $xml_object = simplexml_load_string($arr['kunde']);
            $json = json_encode($xml_object);
            $arr['kunde'] = json_decode($json, TRUE);
        }*/

        /*$xml   = simplexml_load_string($xml);
        $arr = $this->XML2ArrayCore($xml);*/
        return $arr;
    }

    function XML2ArrayCore($parent)
    {
        $array = array();

        foreach ($parent as $name => $element) {
            ($node = & $array[$name])
            && (1 === count($node) ? $node = array($node) : 1)
            && $node = & $node[];

            $node = $element->count() ? XML2Array($element) : trim($element);
        }

        return $array;
    }


    protected function close()
    {
        if($this->netframeConn->sessionID !== ""){
            $para = array(
                "sessionID"	=> $this->netframeConn->sessionID
            );
            $objResult = $this->soapCl->close($para);
        }
        return TRUE;
    }
}
