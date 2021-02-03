<?php
//set_time_limit ( 60 );
//ini_set('display_errors', 1); error_reporting(E_ALL); 
//
//include('../../Utils.php');
//
//
//runQuery($_POST['data']);


function runQuery($token, $broker, $funds){
	
    $insert_array = [];
    
    foreach ($funds as $row){
        $series = $row['series'];
        $name = $row['name'];
        $transactionType = $row['transactionType'];
        $amountPurchased = $row['amountPurchased'];
        $datePurchased = $row['datePurchased'];

        array_push($insert_array,"((SELECT userid from credentials WHERE token='$token'),(SELECT seriesID from series WHERE seriesName='$series'),(SELECT shareID from shares WHERE shareName='$name'),'$transactionType',$amountPurchased,'$datePurchased')");
    }

    $queryString = "INSERT INTO personal VALUES ".implode(",",$insert_array);

    $multiQueryArray = ["DELETE FROM personal WHERE userId=(SELECT userid from credentials WHERE token='$token')",$queryString];
    	
    multiQuery($broker,$multiQueryArray);
}
