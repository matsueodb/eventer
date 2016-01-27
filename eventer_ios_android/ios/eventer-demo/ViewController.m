//
//  ViewController.m
//  eventer-demo
//
//  Created by 清井孝裕 on 2015/01/09.
//  Copyright (c) 2015年 清井孝裕. All rights reserved.
//

#import "ViewController.h"
#define MAINURL @"http://mob.tpj.co.jp/eventer/events/maps"
@interface ViewController ()
@property (weak, nonatomic) IBOutlet UIWebView *myView;

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
    NSString* urlString = MAINURL;
    NSURL* eventerURL = [NSURL URLWithString: urlString];
    NSURLRequest* myRequest = [NSURLRequest requestWithURL: eventerURL];
    [self.myView loadRequest:myRequest];
    //アプリ切替時に初期化
  //  [[NSNotificationCenter defaultCenter] addObserver:self
  //          selector:@selector(initWindow)
  //          name:UIApplicationDidBecomeActiveNotification
  //          object:nil];
    
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}
- (void)initWindow{
    NSString* urlString = MAINURL;
    NSURL* eventerURL = [NSURL URLWithString: urlString];
    NSURLRequest* myRequest = [NSURLRequest requestWithURL: eventerURL];
    [self.myView loadRequest:myRequest];
}

- (BOOL)webView:(UIWebView *)webView
      shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType {
    
    NSString *checkURL = [request.URL absoluteString];
    
    
    //チェックするURL
    NSRange linkMatch  = [checkURL  rangeOfString:@"mob.tpj.co.jp"];
    
    if (linkMatch.location == NSNotFound) {
        [[UIApplication sharedApplication] openURL:request.URL];
        return NO;
    }
    
    return YES;
}
@end
