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
  
         
    $date_1mo = subQuery("1mo", getClosestWeekdayAfterTimespan("-1 month"), $series);
    $date_3mo = subQuery("3mo", getClosestWeekdayAfterTimespan("-3 month"), $series);
    $date_6mo = subQuery("6mo", getClosestWeekdayAfterTimespan("-6 month"), $series);
    $date_1yr = subQuery("1yr", getClosestWeekdayAfterTimespan("-1 year"), $series);
    $date_2yr = subQuery("2yr", getClosestWeekdayAfterTimespan("-2 year"), $series);
    $date_3yr = subQuery("3yr", getClosestWeekdayAfterTimespan("-3 year"), $series);
    $date_4yr = subQuery("4yr", getClosestWeekdayAfterTimespan("-4 year"), $series);
    $date_5yr = subQuery("5yr", getClosestWeekdayAfterTimespan("-5 year"), $series);
    $date_6yr = subQuery("6yr", getClosestWeekdayAfterTimespan("-6 year"), $series);
    $date_7yr = subQuery("7yr", getClosestWeekdayAfterTimespan("-7 year"), $series);
    $date_8yr = subQuery("8yr", getClosestWeekdayAfterTimespan("-8 year"), $series);
    $date_9yr = subQuery("9yr", getClosestWeekdayAfterTimespan("-9 year"), $series);
    $date_10yr = subQuery("10yr", getClosestWeekdayAfterTimespan("-10 year"), $series);

/*
    $date_3mo = getClosestWeekdayAfterTimespan("-3 month");
    $date_6mo = getClosestWeekdayAfterTimespan("-6 month");
    $date_1yr = getClosestWeekdayAfterTimespan("-1 year");
    $date_3yr = getClosestWeekdayAfterTimespan("-3 year");
    $date_5yr = getClosestWeekdayAfterTimespan("-5 year");
    $date_10yr = getClosestWeekdayAfterTimespan("-10 year");
*/
    
    $shareNamesFromDBQuery = 
    "SELECT latest.shareID, shares.shareName name, shares.*,
    latest.sharePrice sharePrice_now,
	(latest.sharePrice - previous.sharePrice) priceChange, 
    sharePrice_1mo, 
    sharePrice_3mo, 
    sharePrice_6mo, 
    sharePrice_1yr, 
    sharePrice_2yr, 
    sharePrice_3yr,
    sharePrice_4yr,
    sharePrice_5yr,
    sharePrice_6yr,
    sharePrice_7yr,
    sharePrice_8yr,
    sharePrice_9yr,
    sharePrice_10yr
    FROM 
    (
        SELECT * FROM `prices` WHERE $series and date=(select max(date) from prices)
    ) latest 
    LEFT JOIN 
	(
        SELECT * FROM `prices` where $series and date=(SELECT MAX(date) FROM prices WHERE Date < ( SELECT MAX(date) FROM prices)) 
    ) 
    previous 
    ON latest.shareID=previous.shareID and latest.seriesID=previous.seriesID 
    LEFT JOIN
    $date_1mo $date_3mo $date_6mo $date_1yr $date_2yr $date_3yr $date_4yr $date_5yr $date_6yr $date_7yr $date_8yr $date_9yr $date_10yr 
    (
        SELECT shares.*,series.* from shares 
        LEFT JOIN 
        series_shares 
        ON shares.shareID = series_shares.shareID 
        LEFT JOIN 
        series 
        ON series_shares.seriesID=series.seriesID
    ) shares 
    ON latest.shareID=shares.shareID and latest.seriesID=shares.seriesID
    WHERE shareName NOT LIKE '%US$%' and shareName NOT LIKE '$classToExclude' ";
 
    //and shareName NOT LIKE '%class' and 
    
//    echo $shareNamesFromDBQuery;
    
    $result = connectToDB($dbName, $shareNamesFromDBQuery);
    
    while($row = mysqli_fetch_array($result,MYSQLI_ASSOC)){ 
         $rows[] = $row;
    }
    
    echo json_encode($rows);
}

function subQuery($period, $date, $series){
    return "(SELECT shareID shareID_$period, sharePrice sharePrice_$period, date date_$period FROM `prices` WHERE $series and date=(SELECT max(date) from prices where date<='$date' LIMIT 1)) $period on latest.shareID=shareID_$period LEFT JOIN";
}

function getClosestWeekdayAfterTimespan($timespan) {
    date_default_timezone_set('America/New_York');
	$newDate = date("Y-m-d", strtotime( date( "Y-m-d", strtotime( date("Y-m-d") ) ) . $timespan ) );
    		
    $date = new DateTime($newDate);
	
    $weekday = $date->format("N");
    if ($weekday == 6) {
        $date->sub(new DateInterval("P1D"))->format('Y-m-d');
    } else if ($weekday == 7) {
        $date->add(new DateInterval("P1D"))->format('Y-m-d');
    }
	
	return $date->format('Y-m-d');
}