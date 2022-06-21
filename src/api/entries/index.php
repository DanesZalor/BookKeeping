<?php require '../commons.php' ?>

<?php

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    
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

    $strdateto = convertToTimeStamp($_GET['date_to'], '2030-01-01 23:59:59');
    $strdatefrom = convertToTimeStamp($_GET['date_from'], '2000-01-01 00:00:00');
    
    $querystr = "SELECT * FROM journalentry WHERE dateoftransaction BETWEEN '${strdatefrom}' AND '${strdateto}' ORDER BY dateoftransaction ASC";

    $entries = db_query($querystr)->fetchAll(PDO::FETCH_ASSOC);
    
    $responsebody = [];

    foreach($entries as $entry){
        $rows = db_query("SELECT * FROM jerow WHERE jeid='".$entry['id']."'")->fetchAll(PDO::FETCH_ASSOC);

        $entry['rows'] = $rows;
        array_push($responsebody, $entry);
    }

    respond($responsebody, 200);

}  /**
* @param body { entrydesc: str, dateoftransaction: timestamp, rows: array() }
* sample: entrydesc="description" dateoftransaction="2001-09-12 00:01:23" rows:='[{"accounttitle":"Cash", "amount":-2000}, {"accounttitle":"Accounts Receivable", "amount":2000}]'
*/
else if ($_SERVER['REQUEST_METHOD'] == 'POST') {
   
   $errorResponse = array(
       "Expected Parameters:"=> array("entrydesc" => "str",
           "dateoftransaction" => "timestamp",
           "rows" => array(
               array(
                   "accounttitle" => "str",
                   "amount" => "float",
               ),"...",
           ),
       ),
   );

   function isAccountTitleinDB($acc){
       return sizeof(db_query("SELECT accountname FROM account WHERE accountname='$acc'")->fetchAll(PDO::FETCH_NUM)) >= 1;
   }

   /**
    * rows validation
    * must be atleast 2 rows
    * each with accounttitle:str and amount:float
    */
   function correctArrayShape($arg){
       global $errorResponse;

       if(is_array($arg) && sizeof($arg) >= 2){

           $totalamount = 0;

           foreach($arg as $obj){
               

               if( 
                   (!property_exists($obj, 'amount') || !property_exists($obj, 'accounttitle')) ||
                   !is_string($obj->accounttitle) || !is_numeric($obj->amount)
               ) {
                   $errorResponse = array("ERROR"=>"rows[i] must follow shape:{accounttitle:str, amount:float}");
                   return false;
               } else if(!isAccountTitleinDB($obj->accounttitle)){
                   $errorResponse = array("ERROR"=> "'$obj->accounttitle' is not a registered accounttitle in the database");
                   return false;
               }
                   
               $totalamount += $obj->amount;
           }
           
           
           if($totalamount != 0) $errorResponse = array("ERROR"=>"SUM(rows.amount) should be == 0. Actual SUM: ${totalamount}");
           
           return $totalamount == 0;
       }

       if(sizeof($arg)<2) $errorResponse = array("ERROR"=>"there should be atleast 2 rows");

       return false;
   }

   if(
       is_string($body->entrydesc) && 
       is_string($body->dateoftransaction) && 
       correctArrayShape($body->rows)
   ){

       db_query("INSERT INTO  journalentry (dateoftransaction, entrysummary) VALUES ('$body->dateoftransaction', '$body->entrydesc')");
       
       $querystr = "SELECT id FROM journalentry WHERE dateoftransaction='$body->dateoftransaction' AND entrysummary='$body->entrydesc';";
       
       $jeid = db_query($querystr)->fetchAll(PDO::FETCH_NUM)[0][0];
       
       
       foreach($body->rows as $row){
           db_query("INSERT INTO jerow (accounttitle, amount, jeid) VALUES ('$row->accounttitle', $row->amount, ${jeid})");
       }

       respond(array(
           "msg"=>"Successfully added journal entry",
           "journalentry.id" => $jeid,
       ),200);
   }
       
   else // wrong parameters; specify 
       respond($errorResponse,406);

}
else {
    respond("Invalid HTTP Method", 405);
}

?>