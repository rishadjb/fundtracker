<?php
//set_time_limit ( 60 );
//ini_set('display_errors', 1); error_reporting(E_ALL); 
//
//include('../../Utils.php');

//runQuery($_POST['user'], $_POST['pass'], $_GET['broker']);
//runQuery('rishadjb@gmail.com', 'Jackberry0');

function runQuery($email, $pass, $broker){
    $userID = null;
    
    $passHash = hash("md2", "XT230@suckmyballs".$pass, false);
    
    $query = "SELECT userid, token FROM `credentials` WHERE email='$email' and password='$passHash'";
    
    $result = connectToDB('users', $query);
    
    while($row = mysqli_fetch_array($result,MYSQLI_ASSOC)){
        $userID = $row['userid'];
        $token = $row['token'];
    }
    
    if($userID != null){
        
        $personalSummaryData = runPersonalSummaryQuery($userID, $broker);
        $personalTransactionsData = runPersonalTransactionsQuery($userID, $broker);
        
        echo '{"userid":"'.$userID.'", "token":"'.$token.'", "personalSummary":'.$personalSummaryData.', "personalTransactions":'.$personalTransactionsData.'}';
    }
    
    else echo "{}";
    
}
