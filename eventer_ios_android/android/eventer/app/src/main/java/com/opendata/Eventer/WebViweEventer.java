package com.opendata.Eventer;

import android.app.Dialog;
import android.graphics.Bitmap;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;
/**
 * Created by seii on 2015/02/12.
 */
public class WebViweEventer extends WebViewClient{
    private Dialog dialog;
    public WebViweEventer() {
        super();
        dialog = null;
    }

    private void disimissDialog() {
        dialog.dismiss();
        dialog = null;
    }

    //ページの読み込み開始
    @Override
    public void onPageStarted(WebView view, String url, Bitmap favicon) {
        dialog = new Dialog(view.getContext());
        dialog.setTitle("Now Loading");
        dialog.show();
    }

    //ページの読み込み完了
    @Override
    public void onPageFinished(WebView view, String url) {
        disimissDialog();
    }

    //ページの読み込み失敗
    @Override
    public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
        if (null != dialog) {
            disimissDialog();
        }
        Toast.makeText(view.getContext(), "エラー", Toast.LENGTH_LONG).show();
    }
}
