<?php
set_time_limit ( 60 );
ini_set('display_errors', 1); error_reporting(E_ALL); 

include('../../Utils.php');
    
runQuery($_GET['user'], $_GET['broker']);

function runQuery($userID, $broker){
    
//    $personalSummaryData = runPersonalSummaryQuery($userID, $broker);
    
    $shareNamesFromDBQuery="SELECT shareName name, pricesCurrent.sharePrice sharePrice_now, transactions.* FROM 
        (SELECT Purchase.seriesID,Purchase.shareID,totalAmountPurchased,purchaseUnits,totalDividend,dividendUnits FROM 
    (SELECT purchases.seriesID,purchases.shareID,transactionType,SUM(amountPurchased) totalAmountPurchased, sum(amountPurchased/sharePrice) purchaseUnits FROM 
(SELECT * FROM `personal` where transactionType='purchase' and userID=$userID) purchases 
LEFT JOIN prices on purchases.seriesID=prices.seriesID and purchases.shareID=prices.shareID and purchases.datePurchased=prices.date GROUP BY shareID) Purchase 
    LEFT JOIN (SELECT dividends.seriesID,dividends.shareID,transactionType,SUM(amountPurchased) totalDividend, SUM(amountPurchased/sharePrice) dividendUnits FROM 
           (SELECT * FROM `personal` where transactionType='distribution' and userID=$userID) dividends 
           LEFT JOIN prices on dividends.seriesID=prices.seriesID and dividends.shareID=prices.shareID and dividends.datePurchased=prices.date GROUP BY shareID) Dividend on Purchase.shareID=Dividend.shareID and Purchase.seriesID=Dividend.seriesID) transactions 
           LEFT JOIN shares on transactions.shareID=shares.shareID 
           LEFT JOIN prices pricesCurrent ON transactions.seriesID=pricesCurrent.seriesID AND transactions.shareID=pricesCurrent.shareID AND pricesCurrent.date=(select max(date) from prices)";
    
    
    $shareNamesFromDBQuery = "SELECT shareName name, seriesName, sharePrice sharePrice_now, allAmounts.*
FROM 
(SELECT purchases.*,amountExchanged, amountDistributed, (IFNULL(sharesPurchased ,0)+IFNULL(sharesExchanged,0)+IFNULL(sharesDistributed,0)) totalShares 
	FROM 
	(
		SELECT personal.*,amountPurchased, sharesPurchased  
		FROM 
		(
			SELECT DISTINCT seriesID,shareID FROM personal where userID=1
		) personal 
		LEFT JOIN 
		(
			SELECT purchaseAmounts.seriesID, purchaseAmounts.shareID, sum(amountPurchased) amountPurchased, sum(amountPurchased/sharePrice) sharesPurchased 
			FROM 
			(
				SELECT seriesID, shareID, datePurchased, amountPurchased FROM `personal` WHERE transactionType='purchase' and userID=1
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
			SELECT seriesID, shareID, datePurchased, amountPurchased FROM `personal` WHERE transactionType IN ('rebalancing','exchange') and userID=1
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
			SELECT seriesID, shareID, datePurchased, amountPurchased FROM `personal` WHERE transactionType IN ('distribution') and userID=1
		) purchaseAmounts 
		LEFT JOIN 
		prices 
		ON purchaseAmounts.seriesID=prices.seriesID and purchaseAmounts.shareID=prices.shareID and purchaseAmounts.datePurchased=prices.date GROUP BY seriesID,shareID
	) dists 
	ON purchases.seriesID=dists.seriesID and purchases.shareID=dists.shareID
) allAmounts 
LEFT JOIN 
prices 
ON allAmounts.seriesID=prices.seriesID and allAmounts.shareID=prices.shareID and date=(select max(date) from prices)
LEFT JOIN
shares
ON allAmounts.shareID=shares.shareID
LEFT JOIN
series
ON allAmounts.seriesID=series.seriesID";
    
    echo $shareNamesFromDBQuery;
    
//    $result = connectToDB($broker, $shareNamesFromDBQuery);
    
    while($row = mysqli_fetch_array($result,MYSQLI_ASSOC)){ 
         $rows[] = $row;
    }
    
    echo json_encode($rows);
}
