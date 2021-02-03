<?php
//set_time_limit ( 60 );
//ini_set('display_errors', 1); error_reporting(E_ALL); 
//
//include('../../Utils.php');
//
//runQuery($_GET['dbName']);

function runQuery($dbName){
    
    if($dbName == 'agf'){
        $classToExclude = '%Series%';
        $series = "seriesID IN (1,2)";
    }
    else {
        $classToExclude = '%class';
        $series = "seriesID=1";
    }
    
    
//    $dateCurr = '2017-02-10';
    $date17 = subQuery("17", $series);
    $date16 = subQuery("16", $series);
    $date15 = subQuery("15", $series);
    $date14 = subQuery("14", $series);
    $date13 = subQuery("13", $series);
    $date12 = subQuery("12", $series);
    $date11 = subQuery("11", $series);
    $date10 = subQuery("10", $series);
    $date09 = subQuery("09", $series);
    $date08 = subQuery("08", $series);
    $date07 = subQuery("07", $series);
    $date06 = subQuery("06", $series);
    $date05 = subQuery("05", $series);
    $date04 = subQuery("04", $series);
    $date03 = subQuery("03", $series);
    $date02 = subQuery("02", $series);
    $date01 = subQuery("01", $series);
    $date00 = subQuery("00", $series);
    
    $shareNamesFromDBQuery = 
    "SELECT shares.shareName name, shares.*, 
    latest.sharePrice sharePrice_now, 
	(latest.sharePrice - previous.sharePrice) priceChange, 
    price17.sharePrice sharePrice_2017, 
    price16.sharePrice sharePrice_2016, 
    price15.sharePrice sharePrice_2015,
    price14.sharePrice sharePrice_2014,
    price13.sharePrice sharePrice_2013,
    price12.sharePrice sharePrice_2012,
    price11.sharePrice sharePrice_2011,
    price10.sharePrice sharePrice_2010,
    price09.sharePrice sharePrice_2009,
    price08.sharePrice sharePrice_2008,
    price07.sharePrice sharePrice_2007,
    price06.sharePrice sharePrice_2006,
    price05.sharePrice sharePrice_2005,
    price04.sharePrice sharePrice_2004,
    price03.sharePrice sharePrice_2003,
    price02.sharePrice sharePrice_2002,
    price01.sharePrice sharePrice_2001,
    price00.sharePrice sharePrice_2000
    FROM 
    (
        SELECT * FROM `prices` where $series and date=(select max(date) from prices)
    ) latest 
	LEFT JOIN 
    (
        SELECT * FROM `prices` where $series and date=(SELECT MAX(date) FROM prices WHERE Date < ( SELECT MAX(date) FROM prices)) 
    ) 
    previous 
    ON 
    latest.shareID=previous.shareID and latest.seriesID=previous.seriesID 
    $date17 $date16 $date15 $date14 $date13 $date12 $date11 $date10 $date09 $date08 $date07 $date06 $date05 $date04 $date03 $date02 $date01 $date00 
    LEFT JOIN 
    (
        select shares.*,series.* from shares 
        LEFT JOIN 
        series_shares 
        ON shares.shareID = series_shares.shareID 
        LEFT JOIN 
        series 
        ON series_shares.seriesID=series.seriesID
    ) 
    shares 
    ON 
    latest.shareID=shares.shareID and latest.seriesID=shares.seriesID
    WHERE shareName NOT LIKE '%US$%' and shareName NOT LIKE '$classToExclude'";
    
//    echo $shareNamesFromDBQuery;
    
    $result = connectToDB($dbName, $shareNamesFromDBQuery);
    
    while($row = mysqli_fetch_array($result,MYSQLI_ASSOC)){ 
         $rows[] = $row;
    }
    
    echo json_encode($rows);
}


function subQuery($year, $series){
    return "LEFT JOIN (SELECT * FROM `prices` where $series and date=(SELECT min(date) from prices where date>='20$year-01-01' LIMIT 1)) price$year on price$year.shareID=latest.shareID and price$year.seriesID=latest.seriesID ";
}
