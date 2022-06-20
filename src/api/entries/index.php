<?php require '../commons.php' ?>

<?php

/**
 *  GET|POST. because my javascript APICall function for some reason cannot send a request body with GET
 */
if ($_SERVER['REQUEST_METHOD'] == "GET" || $_SERVER['REQUEST_METHOD'] == 'POST') {
    
    $querystr = "SELECT * FROM journalentry";

    function apnd0($num){
        $str = strval($num); if(strlen($str)<2) $str = "0" . $str; return $str;
    }

    function convertToTimeStamp($datestr, $fallback){

        $pD = date_parse($datestr);

        if($datestr == "" || $datestr == null || ($pD['warning_count'] > 0 && $pD['error_count'] > 0)) return $fallback;

        $pD['month'] = apnd0($pD['month']);
        $pD['day'] = apnd0($pD['day']);
        $pD['hour'] = apnd0($pD['hour']);
        $pD['minute'] = apnd0($pD['minute']);
        $pD['second'] = apnd0($pD['second']);

        return "${pD['year']}-${pD['month']}-${pD['day']} ${pD['hour']}:${pD['minute']}:${pD['second']}";
    }

    $strdateto = convertToTimeStamp($body->dateto, '2030-01-01 23:59:59');
    $strdatefrom = convertToTimeStamp($body->datefrom, '2000-01-01 00:00:00');
    
    $querystr = "SELECT * FROM journalentry WHERE dateoftransaction BETWEEN '${strdatefrom}' AND '${strdateto}'";

    $entries = db_query($querystr)->fetchAll(PDO::FETCH_ASSOC);
    
    $responsebody = [];

    foreach($entries as $entry){
        $rows = db_query("SELECT * FROM jerow WHERE jeid='".$entry['id']."'")->fetchAll(PDO::FETCH_ASSOC);

        $entry['rows'] = $rows;
        array_push($responsebody, $entry);
    }

    respond($responsebody, 200);
}
else {
    respond("Invalid HTTP Method", 405);
}

?>