<?php
//set_time_limit ( 60 );
//ini_set('display_errors', 1); error_reporting(E_ALL); 
//
//include('../../Utils.php');
//
//runQuery($_POST['token'], $_GET['broker']);


function runQuery($token, $broker, $limitDate){
	
	\Log::info($limitDate);
	
    $userID = null;
        
    $query = "SELECT userid, token FROM `credentials` WHERE token='$token'";
    
    $result = connectToDB('users', $query);
	
    while($row = mysqli_fetch_array($result,MYSQLI_ASSOC)){
        $userID = $row['userid'];
        $token = $row['token'];
    }
    
    if($userID != null){
        
        $personalSummaryData = runPersonalSummaryQuery($userID, $broker, $limitDate);
		
		//if no limitDate set, then get transaction data
		if($limitDate == ""){
		
			$personalTransactionsData = runPersonalTransactionsQuery($userID, $broker);
			echo '{"userid":"'.$userID.'", "token":"'.$token.'", "personalSummary":'.$personalSummaryData.', "personalTransactions":'.$personalTransactionsData.'}';
		
		} else {
			//otherwise get summary data only
			echo '{"userid":"'.$userID.'", "token":"'.$token.'", "personalSummary":'.$personalSummaryData.'}';
		}
		
//		echo $limitDate;
        
        
    }
    
    else echo "{}";
    
}



