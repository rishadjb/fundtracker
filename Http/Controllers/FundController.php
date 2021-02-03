<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use  App\Http\Controllers\Custom\BaseController;
use Illuminate\Http\Response as LaravelResponse;
use Illuminate\Support\Facades\File;

class FundController extends BaseController
{
    /**
     *
     * @param Request $request
     */

    public function fund_price(Request $request)
    {
        return view('fund-price', ["date" => $request->sdate, "name" => $request->name, "series" => $request->series, "broker" => $request->broker]);
    }
	
    public function funds_by_growth(Request $request, $broker)
    {
        return view('funds-by-growth', ["broker" => $broker]);
    }
	
    public function funds_by_year(Request $request, $broker)
    {
        return view('funds-by-year', ["broker" => $broker]);
    }
		
    public function fund(Request $request, $series, $fund)
    {
        return view('fund', ["series" => $series, "fund" => $fund]);
    }
	
    public function fund_holdings(Request $request, $name)
    {
        return view('fund-holdings', ["fund_name" => $name]);
    }
    
	public function historical_prices(Request $request, $fundID, $startDate, $endDate, $series, $broker)
    {
        return view('historical-prices', ["fundID" => $fundID, "startDate" => $startDate, "endDate" => $endDate, "series" => $series, "broker" => $broker, ]);
    }
    
	public function save_personal_data(Request $request)
    {					
        return view('save-personal-data', ["token" => $request->token, "broker" => $request->broker, "funds" => $request->funds]);
    }
    
	public function check_password(Request $request)
    {							
        return view('check-password', ["user" => $request->user, "password" => $request->pass, "broker" => $request->broker]);
    }
    
	public function check_token(Request $request)
    {		
//		$date = isset($request->date) ? $request->date : NULL;
						
        return view('check-token', ["token" => $request->token, "broker" => $request->broker, "date" => $request->date]);
    }
	
	public function agf_latest_prices(Request $request, $series)
    {
        return view('agf-latest-prices', ["series" => $series]);
    }
	
	public function fidelity_latest_prices(Request $request, $series)
    {
        return view('fidelity-latest-prices', ["series" => $series]);
    }



}
