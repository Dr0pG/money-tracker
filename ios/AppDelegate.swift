//
//  AppDelegate.swift
//  moneytracker
//
//  Created by Diogo Venâncio on 01/05/2025.
//
import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import Firebase // Add this line (for firebase)
import FirebaseAuth //Add this line (for firebase auth) not required, but if we get blank error after captcha verification using simulator

@main
class AppDelegate: RCTAppDelegate {
  override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    
    self.moduleName = "main"
    self.dependencyProvider = RCTAppDependencyProvider()

    self.initialProps = [:]

    FirebaseApp.configure() // Add this line

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

// Add the following function if needed (for firebase if getting blank recaptcha on webview)
  override func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
    if Auth.auth().canHandle(url) {
      return true
    }
    // URL not auth related, developer should handle it
    return false
  }

  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: ".expo/.virtual-metro-entry") // Change this file location as per your code
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}