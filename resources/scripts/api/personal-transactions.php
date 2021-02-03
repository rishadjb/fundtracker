<?php
set_time_limit ( 50000 );
ini_set('display_errors', 1); error_reporting(E_ALL); 

include('../../Utils.php');

runQuery($_GET['user'], $_GET['broker']);

function runQuery($userID, $broker){
    
    $shareNamesFromDBQuery = "SELECT shares.shareName name, datePurchased, amountPurchased, prices.sharePrice sharePricePurchased, pricesCurrent.sharePrice sharePrice_now FROM
    (SELECT * FROM `personal` WHERE userID=$userID) personal
    LEFT JOIN shares ON personal.shareID=shares.shareID 
    LEFT JOIN prices ON personal.seriesID=prices.seriesID AND personal.shareID=prices.shareID AND personal.datePurchased=prices.date 
    LEFT JOIN prices pricesCurrent ON personal.seriesID=pricesCurrent.seriesID AND personal.shareID=pricesCurrent.shareID AND pricesCurrent.date=(select max(date) from prices)";
    
    
    $result = connectToDB($broker, $shareNamesFromDBQuery);
    
    while($row = mysqli_fetch_array($result,MYSQLI_ASSOC)){ 
         $rows[] = $row;
    }
    
    echo json_encode($rows);
}
