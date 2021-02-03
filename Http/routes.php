<?php

/*
  |--------------------------------------------------------------------------
  | Application Routes
  |--------------------------------------------------------------------------
  |
  | Here is where you can register all of the routes for an application.
  | It is a breeze. Simply tell Lumen the URIs it should respond to
  | and give it the Closure to call when that URI is requested.
  |
 */


$app->group(['prefix' => 'api','namespace' => 'App\Http\Controllers\API', 'middleware' => ['api_auth']], function ($app) {
	

});




$app->group(['middleware' => 'stratus_auth', 'namespace' => 'App\Http\Controllers'], function ($app) {
    
	//FUND INFO
	
    $app->post('/fund_price', ['uses' => 'FundController@fund_price']);
    
	$app->get('/funds_by_growth/{broker}', ['uses' => 'FundController@funds_by_growth']);
    
	$app->get('/funds_by_year/{broker}', ['uses' => 'FundController@funds_by_year']);
	
	$app->get('/fund/{series}/{fund}', ['uses' => 'FundController@fund']);
		
	$app->get('/fund_holdings/{name}', ['uses' => 'FundController@fund_holdings']);
    
	$app->get('/historical_prices/{fundID}/{startDate}/{endDate}/{series}/{broker}', ['uses' => 'FundController@historical_prices']);
	
	//SAVE PERSONAL DATA
	
	$app->post('/save_personal_data', ['uses' => 'FundController@save_personal_data']);
    
	//TOKEN & PASSWORD CHECK
	
	$app->post('/check_password', ['uses' => 'FundController@check_password']);
	$app->post('/check_token', ['uses' => 'FundController@check_token']);
	
	//SCRAPERS
	
	$app->get('/agf_latest_prices/{series}', ['uses' => 'FundController@agf_latest_prices']);
		
	$app->get('/fidelity_latest_prices/{series}', ['uses' => 'FundController@fidelity_latest_prices']);

//	$app->get('/logout', 'LoginController@logout');

    
    
    $app->get('/template', ['uses' => 'TickerController@template']);
    $app->get('/daily_riser', ['uses' => 'TickerController@daily_riser']);
    $app->get('/daydata', ['uses' => 'TickerController@daydata']);
    $app->get('/gain', ['uses' => 'TickerController@gain']);
    $app->get('/day_action', ['uses' => 'TickerController@day_action']);
    $app->get('/all_action', ['uses' => 'TickerController@all_action']);
    $app->get('/realtime_treats', ['uses' => 'TickerController@realtime_treats']);
    $app->get('/realtime_treats_grouped', ['uses' => 'TickerController@realtime_treats_grouped']);
    $app->get('/realtime_news', ['uses' => 'TickerController@realtime_news']);
    $app->get('/live_chart/{ticker}', ['uses' => 'TickerController@live_chart']);
    


});
