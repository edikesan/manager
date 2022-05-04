<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Mail;
use Validator;
use File;
use DB;
use PDF;

class StoreLeavingController extends Controller
{
    public function __construct()
    {
        // Apply the jwt.auth middleware to all methods in this controller
        // except for the authenticate method. We don't want to prevent
        // the user from retrieving their token if they don't already have it
        $this->middleware('jwt.auth', ['except' => ['authenticate']]);
    }

    public function search(Request $request)
    {
        if ($request['query']) {
            $store_data = app('App\Http\Controllers\NetframeController')->getStoreLeaving($request['query']);
//            $store_data = '[{"Lagerstammdaten":{"@attributes":{"type":"C"},"Lagerstammdaten":{"rowid":"110960","fht":"nein","Grosshandel":"ja","Flaschenselbstabholer":"ja","Flaschenspedition":"ja","Zaehlerabgang":"nein"}}}]';
            return $store_data;
        }
        return 'Nicht gefunden';
    }


    public function fht_search(Request $request)
    {
        if ($request['query']) {
            $store_data = app('App\Http\Controllers\NetframeController')->getFhtGasabgaenge($request['query']);
            return $store_data;
        }
        return 'Nicht gefunden';
    }

    public function grosshandel_search(Request $request)
    {
        if ($request['query']) {
            $store_data = app('App\Http\Controllers\NetframeController')->getGrosshandelGasabgaenge($request['query']);
            return $store_data;
        }
        return 'Nicht gefunden';
    }

    public function speditionen_search(Request $request)
    {
        if ($request['query']) {
            $store_data = app('App\Http\Controllers\NetframeController')->getSpeditionen($request['query']);
            return $store_data;
        }
        return 'Nicht gefunden';
    }

    public function bottles_search(Request $request)
    {
        if ($request['query']) {
            $store_data = app('App\Http\Controllers\NetframeController')->getSpeditionFlaschen($request['query']);
//            $store_data = '[{"LagerFlaschen":{"@attributes":{"type":"C"},"LagerFlaschen":{"LagerFlasche":[{"Artikelnr":"210","Bezeichnung":"03 KG Brenngas grau F\u00fcllung DIN 51622"},{"Artikelnr":"220","Bezeichnung":"05 KG Brenngas grau F\u00fcllung DIN 51622"},{"Artikelnr":"230","Bezeichnung":"11 KG Brenngas grau F\u00fcllung DIN 51622"},{"Artikelnr":"300","Bezeichnung":"02 KG Brenngas Eigentum F\u00fcllung"},{"Artikelnr":"370","Bezeichnung":"11 KG Brenngas Alu F\u00fcllung DIN 51622"},{"Artikelnr":"400","Bezeichnung":"11 KG Autogas Pfand F\u00fcllung DIN 51622"},{"Artikelnr":"490","Bezeichnung":"14 KG Autogas Aluflasche F\u00fcllung DRIVE"},{"Artikelnr":"180","Bezeichnung":"03 KG Brenngas Pfand F\u00fcllung DIN 51622"},{"Artikelnr":"415","Bezeichnung":"11 KG Autogas Clip on F\u00fcllung DIN 51622"},{"Artikelnr":"233","Bezeichnung":"08 KG Brenngas BBQ F\u00fcllung DIN 51622"},{"Artikelnr":"903","Bezeichnung":"Ballongas (Ballonfahrer) DIN 51622 (Erfassung in kg)"},{"Artikelnr":"110","Bezeichnung":"11 KG Brenngas Pfand F\u00fcllung DIN 51622"}]}}}]';
            return $store_data;
        }
        return 'Nicht gefunden';
    }

    public function kunden_search(Request $request)
    {
        if ($request['query']) {
            $store_data = app('App\Http\Controllers\NetframeController')->getKunden($request['query']);
//            $store_data = '[{"LagerSelbstabholer":{"@attributes":{"type":"C"},"LagerSelbstabholer":{"LagerSA":{"kundenid":"152189","kundennr":"237686","kundenname":"Musterfirma","vertragid":"2259013","vertragsnr":"3237686001"}}}}]';
            return $store_data;
        }
        return 'Nicht gefunden';
    }

    public function auswertung_search(Request $request)
    {
        if ($request['query']) {
            $param_array = json_decode($request['query'], true);
            $store_data = app('App\Http\Controllers\NetframeController')->getAuswertung($param_array);
            return $store_data;
        }
        return 'Nicht gefunden';
    }

    public function projekte_search(Request $request)
    {
        if ($request['query']) {
            $param_array = json_decode($request['query'], true);
            $store_data = app('App\Http\Controllers\NetframeController')->executeMacro("_SV_NETFRAME_BESCHAFFUNG_EXPORT_LAGER_ZAEHLER", $param_array);
            return $store_data;
        }
        return 'Nicht gefunden';
    }

    public function create_fht_gasabgang(Request $request)
    {
        if ($request['query']) {
            $data = app('App\Http\Controllers\NetframeController')->createFhtGasabgang($request['query']);
            return $data;
        }
        return 'Nicht gefunden';
    }

    public function create_grosshandel_gasabgang(Request $request)
    {
        if ($request['query']) {
            $data = app('App\Http\Controllers\NetframeController')->createGrosshandelGasabgang($request['query']);
            return $data;
        }
        return 'Nicht gefunden';
    }

    public function create_kunden_gasabgang(Request $request)
    {
        if ($request['query']) {
            $param_array = json_decode($request['query'], true);
            if($param_array["ballongas_tacken"] == "N"){
                $file = '_SV_NETFRAME_BESCHAFFUNG_IMPORT_FLASCHENSA.txt';
                $data = app('App\Http\Controllers\NetframeController')->executeMacro("_SV_NETFRAME_BESCHAFFUNG_IMPORT_FLASCHENSA", $param_array);
                $t = explode(" ",microtime());
                file_put_contents($file,"\r\n"."---------- ".date("d.m.y H:i:s",$t[1]).((string)$t[0])."----------"."\r\n", FILE_APPEND | LOCK_EX);
                file_put_contents($file, "Parameter: ".$request['query']."\n", FILE_APPEND | LOCK_EX );
            }
            else{
                $file = '_SV_NETFRAME_BESCHAFFUNG_IMPORT_BALLONSA.txt';
                $data = app('App\Http\Controllers\NetframeController')->executeMacro("_SV_NETFRAME_BESCHAFFUNG_IMPORT_BALLONSA", $param_array);
                $t = explode(" ",microtime());
                file_put_contents($file,"\r\n"."---------- ".date("d.m.y H:i:s",$t[1]).((string)$t[0])."----------"."\r\n", FILE_APPEND | LOCK_EX);
                file_put_contents($file, "Parameter: ".$request['query']."\n", FILE_APPEND | LOCK_EX );
            }
            ob_start();
            print_r($data);
            $textualRepresentation = ob_get_contents();
            ob_end_clean();
            file_put_contents($file, "Return: ".$textualRepresentation, FILE_APPEND | LOCK_EX);

            return $data;
        }
        return 'Nicht gefunden';
    }

    public function create_spedition_gasabgang(Request $request)
    {
        $file = '_SV_NETFRAME_BESCHAFFUNG_IMPORT_FLASCHENSPED.txt';
        if ($request['query']) {
            $t = explode(" ",microtime());
            file_put_contents($file,"\r\n"."---------- ".date("d.m.y H:i:s",$t[1]).((string)$t[0])."----------"."\r\n", FILE_APPEND | LOCK_EX);
            file_put_contents($file, "Parameter: ".$request['query']."\n", FILE_APPEND | LOCK_EX );
            $param_array = json_decode($request['query'], true);
            $data = app('App\Http\Controllers\NetframeController')->executeMacro("_SV_NETFRAME_BESCHAFFUNG_IMPORT_FLASCHENSPED", $param_array);
            ob_start();
            print_r($data);
            $textualRepresentation = ob_get_contents();
            ob_end_clean();
            file_put_contents($file, "Return: ".$textualRepresentation, FILE_APPEND | LOCK_EX);

            return $data;
        }
        return 'Nicht gefunden';
    }


    public function create_projekt_gasabgang(Request $request)
    {
        $file = '_SV_NETFRAME_BESCHAFFUNG_IMPORT_ZAEHLERABGANG.txt';
        if ($request['query']) {
            $t = explode(" ",microtime());
            file_put_contents($file,"\r\n"."---------- ".date("d.m.y H:i:s",$t[1]).((string)$t[0])."----------"."\r\n", FILE_APPEND | LOCK_EX);
            file_put_contents($file, "Parameter: ".$request['query']."\n", FILE_APPEND | LOCK_EX );
            $param_array = json_decode($request['query'], true);
            $data = app('App\Http\Controllers\NetframeController')->executeMacro("_SV_NETFRAME_BESCHAFFUNG_IMPORT_ZAEHLERABGANG", $param_array);
            ob_start();
            print_r($data);
            $textualRepresentation = ob_get_contents();
            ob_end_clean();
            file_put_contents($file, "Return: ".$textualRepresentation, FILE_APPEND | LOCK_EX);
            return $data;
        }
        return 'Nicht gefunden';
    }

    public function createLieferschein(Request $request){
        if ($request['query']) {
            $param_array = json_decode($request['query'], true);
            $lieferscheinNr = $param_array['lieferscheinNr'];
            $belegNr = $param_array['belegNr'];
            $kundenNr = $param_array['kundenNr'];
            $kundenName = $param_array['kundenName'];
            $flaschenArr = $param_array['Positionen'];
//var_dump($flaschenArr)    ;
//return;
            $datum = date("d.m.Y");
            ob_start();
            require_once( __DIR__ . "/../../../../angular-frontend/app/modules/store_leaving/views/Lieferschein.php");
            $file_content = ob_get_contents();
            ob_end_clean();
            $pdf = \App::make('dompdf.wrapper');
            $pdf->loadHTML($file_content);

//            $font = $pdf->getFontMetrics()->getFont("Arial", "bold");
//            $pdf->getCanvas()->page_text(16, 770, "Page: {PAGE_NUM} of {PAGE_COUNT}", $font, 8, array(0, 0, 0));
//            $pdf->page_text(16, 770, "Page: {PAGE_NUM} of {PAGE_COUNT}", $font, 8, array(0, 0, 0));
            $output = $pdf->output();

            file_put_contents('Lieferschein_'.$lieferscheinNr.'.pdf', $output);
            file_put_contents('Lieferschein_'.$lieferscheinNr.'.html', $file_content);
            return response()->json('Lieferschein_'.$lieferscheinNr.'.pdf', 200);
        }
    }

}
