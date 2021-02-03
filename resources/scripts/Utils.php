<?php

//include('connectToDB.php');
//include('getXPath.php');

function getResultsFromDB($dbName, $query){
    
    $result = connectToDB($dbName, $query);
    
    while($row = mysqli_fetch_array($result,MYSQLI_ASSOC)){ 
         $rows[] = $row;
    }
    
    return json_encode($rows);
    
}


function getCharactersAfterLastDashX($input){
    return substr($input, strrpos($input, '-') + 1);
}

function getCharactersAfterLastDash($input){
    return substr($input, strrpos($input, '-') + 1);
}

function convertDoubleArrayToQuery($array){
    
    $new_array = array();
    
    foreach($array as $item){
         array_push($new_array, implode_special($item, '"', '"'));   
    }
    
    return implode_special($new_array, '(', ')');
}


function specialArray($array){
    
    $new_array = array();
    
    foreach($array as $item){
         array_push($new_array, "((SELECT shareID FROM shares WHERE shareName = '".$item[0]."'),(SELECT seriesID FROM series WHERE seriesName='$item[1]'),$item[3],'$item[2]')");   
    }
    
    return implode($new_array, ',');
}

function createQueryForFidelity($array){
    
    $new_array = array();
    
    foreach((array)$array as $item){
         array_push($new_array, "((SELECT shareID FROM shares WHERE shareName = '$item[0]'),(SELECT seriesID FROM series WHERE seriesName='$item[1]'),$item[3],'$item[2]')");   
    }
    
    return implode($new_array, ',');
    
    
    
}

function implode_special($array, $char1, $char2){
    return str_replace("'", "\'", $char1.implode($array, $char2.','.$char1).$char2);
}

function secondsToTime($s)
{
    $h = floor($s / 3600);
    $s -= $h * 3600;
    $m = floor($s / 60);
    $s -= $m * 60;
    return $h.':'.sprintf('%02d', $m).':'.sprintf('%02d', $s);
}


function runPersonalSummaryQuery($userID, $broker, $limitDate = null){
    
   /* $shareNamesFromDBQuery="SELECT shareName name, pricesCurrent.sharePrice sharePrice_now, transactions.* FROM 
(SELECT Purchase.seriesID,Purchase.shareID,totalAmountPurchased,purchaseUnits,totalDividend,dividendUnits FROM 
(SELECT purchases.seriesID,purchases.shareID,transactionType,SUM(amountPurchased) totalAmountPurchased, sum(amountPurchased/sharePrice) purchaseUnits FROM 
(SELECT * FROM `personal` where transactionType='purchase' and userID=$userID) purchases 
LEFT JOIN prices on purchases.seriesID=prices.seriesID and purchases.shareID=prices.shareID and purchases.datePurchased=prices.date GROUP BY shareID) Purchase 
LEFT JOIN (SELECT dividends.seriesID,dividends.shareID,transactionType,SUM(amountPurchased) totalDividend, SUM(amountPurchased/sharePrice) dividendUnits FROM 
           (SELECT * FROM `personal` where transactionType='distribution' and userID=$userID) dividends 
           LEFT JOIN prices on dividends.seriesID=prices.seriesID and dividends.shareID=prices.shareID and dividends.datePurchased=prices.date GROUP BY shareID) Dividend on Purchase.shareID=Dividend.shareID and Purchase.seriesID=Dividend.seriesID) transactions 
           LEFT JOIN shares on transactions.shareID=shares.shareID 
           LEFT JOIN prices pricesCurrent ON transactions.seriesID=pricesCurrent.seriesID AND transactions.shareID=pricesCurrent.shareID AND pricesCurrent.date=(select max(date) from prices)";*/
    	
    $limitDate = $limitDate == null ? date("Y-m-d") : $limitDate;
	
//    $limitDate = date("Y-m-d");
    
    $shareNamesFromDBQuery = 
    "SELECT shareName name, seriesName series, prices.sharePrice sharePrice_now, (prices.sharePrice - previous.sharePrice) priceChange,  allAmounts.*
    FROM 
    (SELECT purchases.*,amountExchanged, amountDistributed, ROUND((IFNULL(sharesPurchased ,0)+IFNULL(sharesExchanged,0)+IFNULL(sharesDistributed,0)),4) totalShares 
        FROM 
        (
            SELECT personal.*,amountPurchased, sharesPurchased  
            FROM 
            (
                SELECT DISTINCT seriesID,shareID FROM personal where userID=$userID
            ) personal 
            LEFT JOIN 
            (
                SELECT purchaseAmounts.seriesID, purchaseAmounts.shareID, sum(amountPurchased) amountPurchased, sum(amountPurchased/sharePrice) sharesPurchased 
                FROM 
                (
                    SELECT seriesID, shareID, datePurchased, amountPurchased FROM `personal` WHERE transactionType='purchase' and datePurchased<='$limitDate' and userID=$userID
                ) purchaseAmounts 
                LEFT JOIN 
                prices 
                ON purchaseAmounts.seriesID=prices.seriesID and purchaseAmounts.shareID=prices.shareID and purchaseAmounts.datePurchased=prices.date GROUP BY seriesID,shareID
            ) purchases 
            ON personal.seriesID=purchases.seriesID and personal.shareID=purchases.shareID
        ) purchases 
        LEFT JOIN 
        (
            SELECT purchaseAmounts.seriesID, purchaseAmounts.shareID, sum(amountPurchased) amountExchanged, sum(amountPurchased/sharePrice) sharesExchanged 
            FROM 
            (
                SELECT seriesID, shareID, datePurchased, amountPurchased FROM `personal` WHERE transactionType IN ('rebalancing','exchange') and datePurchased<='$limitDate' and userID=$userID
            ) purchaseAmounts 
            LEFT JOIN 
            prices 
            ON purchaseAmounts.seriesID=prices.seriesID and purchaseAmounts.shareID=prices.shareID and purchaseAmounts.datePurchased=prices.date GROUP BY seriesID,shareID
        ) exchanges 
        ON purchases.seriesID=exchanges.seriesID and purchases.shareID=exchanges.shareID 
        LEFT JOIN 
        (
            SELECT purchaseAmounts.seriesID, purchaseAmounts.shareID, sum(amountPurchased) amountDistributed, sum(amountPurchased/sharePrice) sharesDistributed 
            FROM 
            (
                SELECT seriesID, shareID, datePurchased, amountPurchased FROM `personal` WHERE transactionType IN ('distribution') and datePurchased<='$limitDate' and userID=$userID
            ) purchaseAmounts 
            LEFT JOIN 
            prices 
            ON purchaseAmounts.seriesID=prices.seriesID and purchaseAmounts.shareID=prices.shareID and purchaseAmounts.datePurchased=prices.date GROUP BY seriesID,shareID
        ) dists 
        ON purchases.seriesID=dists.seriesID and purchases.shareID=dists.shareID
    ) allAmounts 
    LEFT JOIN 
    prices 
    ON allAmounts.seriesID=prices.seriesID and allAmounts.shareID=prices.shareID and date=(select max(date) from prices where date<='$limitDate')
    LEFT JOIN 
	(
		SELECT * FROM `prices` where date=(SELECT MAX(date) FROM prices WHERE date < ( SELECT MAX(date) FROM prices)) 
	)
	previous
    ON allAmounts.seriesID=previous.seriesID and allAmounts.shareID=previous.shareID
    LEFT JOIN
    shares
    ON allAmounts.shareID=shares.shareID
    LEFT JOIN
    series
    ON allAmounts.seriesID=series.seriesID where totalShares >= 1";
	
//	echo $shareNamesFromDBQuery;
    
    return getResultsFromDB($broker, $shareNamesFromDBQuery);
}



function runPersonalTransactionsQuery($userID, $broker){
    
    $shareNamesFromDBQuery = 
    "SELECT shares.shareName name, shares.seriesName series, datePurchased, amountPurchased, transactionType, prices.sharePrice sharePricePurchased, pricesCurrent.sharePrice sharePrice_now 
    FROM
    (
        SELECT * FROM `personal` WHERE userID=$userID
    ) personal
    LEFT JOIN 
    (
        SELECT shares.*,series.* 
        FROM shares 
        LEFT JOIN 
        series_shares 
        ON shares.shareID = series_shares.shareID 
        LEFT JOIN 
        series 
        ON series_shares.seriesID=series.seriesID
    ) shares 
    ON personal.shareID=shares.shareID and personal.seriesID=shares.seriesID
    LEFT JOIN 
    prices 
    ON personal.seriesID=prices.seriesID AND personal.shareID=prices.shareID AND personal.datePurchased=prices.date 
    LEFT JOIN 
    prices pricesCurrent 
    ON 
    personal.seriesID=pricesCurrent.seriesID AND personal.shareID=pricesCurrent.shareID AND pricesCurrent.date=(select max(date) from prices) ORDER BY datePurchased DESC";
    
    
    
    return getResultsFromDB($broker, $shareNamesFromDBQuery);
}

?>

