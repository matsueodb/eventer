package com.opendata.Eventer;

import android.os.Build;
import android.os.Bundle;
import android.net.Uri;
import android.support.v7.app.ActionBarActivity;
import android.view.Menu;
import android.view.MenuItem;
import android.webkit.GeolocationPermissions.Callback;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.*;

public class MainActivity extends ActionBarActivity {

    public WebView  myWebView;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            WebView.setWebContentsDebuggingEnabled(true);
        }
        myWebView = (WebView)findViewById(R.id.webView);

        //標準ブラウザをキャンセル
        //myWebView.setWebViewClient(new WebViewClient(){
        /*myWebView.setWebViewClient(new WebViewClient(){
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {

                if (url.matches("163.*")) {
                    // WebView内で表示する
                    System.out.println("asdfasdf");
                    return true;
                }
                // 標準ブラウザで表示する

                System.out.println("vbbbbbbb");
                return true;
            }
        });*/
        myWebView.getSettings().setJavaScriptEnabled(true);
        myWebView.getSettings().setGeolocationEnabled(true);
        myWebView.setWebChromeClient(new WebChromeClient(){

            @Override
            // onGeolocationPermissionsShowPromptのオーバーライド
            public void onGeolocationPermissionsShowPrompt(String origin, Callback callback) {
                callback.invoke(origin, true, false);
            }


        });
        myWebView.getSettings().setLoadWithOverviewMode(true);
        //アプリ起動時に読み込むURL
        //myWebView.loadUrl("http://172.16.23.124:3000/events/maps");
        myWebView.loadUrl("http://mob.tpj.co.jp/eventer/events/maps");

    }

    //@Override
    //protected void onResume(){
    //    super.onResume();
    //    myWebView.loadUrl("http://163.49.71.190/eventer/events/maps");
    //}
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

}
