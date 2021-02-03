<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Http\Controllers\Custom\BaseController;
use Illuminate\Http\Response as LaravelResponse;
use Illuminate\Support\Facades\File;

class TickerController extends BaseController
{
    /**
     *
     * @param Request $request
     */

    public function home(Request $request)
    {
//        $variables =$this->getWebSiteAndUserInformationFromSession($request);
//        return view('practice-profile') ->with('variables', $variables);
        return view('home');
    }
    
    public function daily_riser(Request $request = null)
    {
        
        $variables = [];
      
        if($request->input('max_price')){
            
            /*
            if(!($max_price < 1 || $max_price > 20)){
                $variables['max_price'] = $max_price;
            }*/
            $max_price = $request->max_price;
            $variables['max_price'] = ($max_price < 1 || $max_price > 20) ? 'undefined' : $max_price;
        }
        
        if($request->input('min_growth')){
            $min_growth = $request->min_growth;
            $variables['min_growth'] = ($min_growth < -50 || $min_growth > 50) ? 'undefined' : $min_growth;
        }
        
        if($request->input('match_range')){
//            $variables['match_range'] = $request->match_range;
            
            $match_range = $request->match_range;
            $variables['match_range'] = ($match_range < 0 || $match_range > 5) ? 'undefined' : $match_range;
            \Log::info('match_range: '.$match_range);
        }
        
        if($request->input('day_range')){
            
            $day_range = $request->day_range;
            $variables['day_range'] = ($day_range < 1 || $day_range > 5 || $match_range>$day_range) ? 'undefined' : $day_range;

            \Log::info('day_range: '.$day_range);
        }
        
        
        return view('stocks')->with('variables', $variables);
    }

    public function all_action(Request $request = null)
    {
        $variables = [];      
        if($request->input('ticker')){
            $ticker = $request->ticker;
            $variables['ticker'] = $ticker;
        }
        return view('all-action')->with('variables', $variables);
    }

    public function daydata(Request $request = null)
    {        
        $variables = [];
      
        if($request->input('ticker')){
            $ticker = $request->ticker;
            $variables['ticker'] = $ticker;
        }
        
        if($request->input('date')){
            $date = $request->date;
            $variables['date'] = $date;
        }

        
        return view('daydata')->with('variables', $variables);
    }
    
    public function day_action(Request $request = null)
    {
       $variables = [];
      
        if($request->input('ticker')){
            $ticker = $request->ticker;
            $variables['ticker'] = $ticker;
        }
        
        if($request->input('date')){
            $date = $request->date;
            $variables['date'] = $date;
        }

        return view('day-action')->with('variables', $variables);
    }
    
    public function realtime_treats(Request $request = null)
    {
        return view('realtime-treats');
    }
    public function realtime_treats_grouped(Request $request = null)
    {
        return view('realtime-treats-grouped');
    }
    
    public function realtime_news(Request $request = null)
    {
        return view('realtime-news');
    }

    public function live_chart(Request $request = null, $ticker)
    {
        return view('live-chart', ['ticker' => $ticker]);
    }


    public function template(Request $request = null)
    {
        return view('template');
    }

}
