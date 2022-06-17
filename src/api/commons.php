<?php


if ($_SERVER['SERVER_NAME'] == "localhost") {
    $_SESSION['db_host'] = "localhost";
    $_SESSION['db_name'] = "ledger";
    $_SESSION['db_user'] = "djdols";
    $_SESSION['db_port'] = "5432";
    $_SESSION['db_pass'] = "";
} else {
}


function db_query($statement, $fetch_mode = PDO::FETCH_DEFAULT)
{
    try {
        $databaseConnection = new PDO( // pgsql db connect
            "pgsql:host=${_SESSION['db_host']};port=5432;dbname=${_SESSION['db_name']};",
            $_SESSION['db_user'],
            $_SESSION['db_pass']
        );
        if (!$databaseConnection) die("Failed to query ${statement}\nCan't connect to Database.");
        return $databaseConnection->query($statement, $fetch_mode);
    } catch (PDOException $e) {
        printf("ERROR:" . $statement);
        throw $e;
    }
}

/* implement later if we add accounts system for authentication
$body = json_decode(file_get_contents('php://input'));

$basicAuth = [
    "user" => array_key_exists('PHP_AUTH_USER', $_SERVER) ? $_SERVER['PHP_AUTH_USER'] : '',
    "pass" => array_key_exists('PHP_AUTH_PW', $_SERVER) ? $_SERVER['PHP_AUTH_PW'] : '',
    "authorized" => false,
];

if (
    $basicAuth['user'] != '' && $basicAuth['pass'] != '' &&
    db_query(
        "SELECT * FROM account WHERE username='${basicAuth['user']}' AND password='${basicAuth['pass']}'")->rowCount() > 0
) $basicAuth['authorized'] = true;
*/

/**
 * send json http_response
 * 
 * @param array $data the data to be shown in the response code. It is encoded in json.
 * @param int $responseCode http response code
 */
function respond($data, int $responseCode)
{
    header('Content-Type: application/json', true, $responseCode);
    echo json_encode($data);
}

