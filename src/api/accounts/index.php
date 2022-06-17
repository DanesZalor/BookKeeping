<?php require '../commons.php' ?>

<?php
if ($_SERVER['REQUEST_METHOD'] == "GET") {
    $query_res = db_query("SELECT accountname FROM account");
    respond($query_res->fetchAll(PDO::FETCH_ASSOC), 200);
}
?>