<?php
//set_time_limit ( 60 );
//ini_set('display_errors', 1); error_reporting(E_ALL); 
//
//include('../../Utils.php');
//
//runQuery($_GET['dbName']);

function runQuery(){    
    
    $dbName = $_GET['broker'];
    $startDate = isset($_GET['startDate']) ? $_GET['startDate'] : '1900-01-01' ;
    $endDate = isset($_GET['endDate']) ? $_GET['endDate'] : '2020-12-12' ;
    $series = $_GET['series'];
    
    if($dbName == 'agf'){
        $series = "";
    }
    else $series = " and seriesID = (SELECT seriesID FROM series where seriesName = 'A')";
    
//    $query = "SELECT UNIX_TIMESTAMP(date)*1000 date,sharePrice FROM `prices` WHERE shareID = (SELECT shareID FROM shares where shareName='".$_GET['shareName']."') and date>='".$startDate."' and date<='".$endDate."' order by date ASC";
    
    $startDate;
    
//    $query = "SELECT UNIX_TIMESTAMP(date)*1000 date,sharePrice FROM `prices` WHERE shareID = (SELECT shareID FROM shares where shareName='".$_GET['shareName']."') and seriesID = (SELECT seriesID FROM series where seriesName='".$series."') and date>='".$startDate."' and date<='".$endDate."' order by date ASC";
    
//    $query = "SELECT * FROM (SELECT * from prices where seriesID=1 and shareID BETWEEN 1 and 5 and date IN ('2017-01-18','2016-12-19','2016-09-20','2016-06-20','2015-01-17','2013-01-17','2011-01-17','2007-01-17')) A LEFT JOIN  shares ON A.shareID=shares.shareID ORDER BY A.shareID ASC, date DESC";

    $query = "SELECT UNIX_TIMESTAMP(date)*1000 date,sharePrice FROM `prices` WHERE shareID ='".$_GET['shareID']."' $series and date>='$startDate' and date<='$endDate' order by date ASC";
    
    
    $result = connectToDB($dbName, $query);
    
    $output = "[";
    

    //get oldest date from DB
    while($row = mysqli_fetch_array($result,MYSQLI_ASSOC)){  
        
        
        $str = "[";
        $str .= $row['date'].",";
        $str .= $row['sharePrice'];
        $str .= "],";
        
        $output .= $str;
        
    }
    
    
    $output = trim($output,",")."]";

    echo $output;
}