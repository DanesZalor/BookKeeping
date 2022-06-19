<?php require '../commons.php' ?>

<?php

/**
 * @param body { entrydesc: str, dateoftransaction: timestamp, rows: array() }
 */
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    
    // check param shape
    if(
        is_string($body->entrydesc) && 
        is_string($body->dateoftransaction) && 
        is_array($body->rows)
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