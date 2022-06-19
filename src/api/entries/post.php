<?php require '../commons.php' ?>

<?php

/**
 * @param body { entrydesc: str, dateoftransaction: timestamp, rows: array() }
 */
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    
    function correctArrayShape($arg){
        
        if(is_array($arg) && sizeof($arg) >= 2){

            foreach($arg as $obj){
                
                if( 
                    !is_string($obj->accounttitle) ||
                    !is_string($obj->amount) == null
                ) return false;
                
                //echo $obj;
            }
            return true;
        }
        return false;
    }

    // check param shape
    if(
        is_string($body->entrydesc) && 
        is_string($body->dateoftransaction) && 
        correctArrayShape($body->rows)
    )
        respond('ok',200);
    else 
        respond(
            array(
                "Expected Parameters:"=> array(
                    "entrydesc" => "str",
                    "dateoftransaction" => "timestamp",
                    "rows" => array(
                        array(
                            "accounttitle" => "str",
                            "amount" => "float",
                        ),"..."
                    ),
                )
        ),
         406);
}else{
    respond("Invalid HTTP Method",405);
}
?>