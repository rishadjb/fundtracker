<?php
//set_time_limit ( 50000 );
//ini_set('display_errors', 1); error_reporting(E_ALL); 

//include('../../Utils.php');
//include('./../testpage.php');


function runQuery($date, $shareName, $seriesName, $broker){
    
    $shareNamesFromDBQuery = "select sharePrice sharePurchasedPrice, date from prices where date>='$date' and seriesID=(SELECT seriesID from series where seriesName='$seriesName') and shareID=(SELECT shareID from shares WHERE shareName='$shareName') LIMIT 1";
    
//    echo $shareNamesFromDBQuery;
        
    $result = connectToDB($broker, $shareNamesFromDBQuery);
//    
    while($row = mysqli_fetch_array($result,MYSQLI_ASSOC)){ 
//         echo $row['sharePurchasedPrice'];
        $rows[] = $row;
    }
    
    echo json_encode($rows);
}
