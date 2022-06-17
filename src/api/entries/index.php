<?php require '../commons.php' ?>

<?php
if ($_SERVER['REQUEST_METHOD'] == "GET") {
    $entries = db_query("SELECT * FROM journalentry")->fetchAll(PDO::FETCH_ASSOC);
    
    $responsebody = [];

    foreach($entries as $entry){
        $rows = db_query("SELECT * FROM jerow WHERE jeid='".$entry['id']."'")->fetchAll(PDO::FETCH_ASSOC);

        $entry['rows'] = $rows;
        array_push($responsebody, $entry);
    }

    respond($responsebody, 200);
}
?>