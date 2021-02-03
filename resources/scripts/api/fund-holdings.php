<?php
//set_time_limit ( 60 );
//ini_set('display_errors', 1); error_reporting(E_ALL); 
//
//include('../../Utils.php');
//
//
//runQuery($_GET['name']);

function runQuery($fundName){
    
    $searchQuery = "SELECT A.holdingID, holdingName, holdingValue, holdingPercent FROM (SELECT holdingID, holdingValue, holdingPercent from share_holding where shareID = (SELECT shareID from shares WHERE shareName='$fundName')) A LEFT JOIN holdings on A.holdingID=holdings.holdingID ORDER BY holdingPercent DESC";
    
    
    $result = connectToDB('fidelity', $searchQuery);
    
    while($row = mysqli_fetch_array($result,MYSQLI_ASSOC)){ 
        $rows[] = $row;
    }
    
    
    echo json_encode($rows);
}
