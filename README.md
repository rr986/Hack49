Run on mac: 

# ADEManager
cd frontend

npm install

npx react-native start

open ios/ADEManager.xcworkspace

install cocoapods

In xcode click the run button to run the app on the simulator 

Run on windows:

Install JDK
1.	Go to the Oracle JDK download page and download the x64 Installer: Javascript: jdk-11.0.25_windows-x64_bin.exe, https://www.oracle.com/java/technologies/javase-jdk11-downloads.html 
2.	Run the installer and follow the prompts to install the JDK.
3.	Set the JAVA_HOME environment variable:
4.	Right-click on This PC or My Computer, then click on Properties.
5.	Click on Advanced system settings on the left.
6.	Click on Environment Variables.
7.	Under System variables, click on New.
8.	Set the variable name as JAVA_HOME and the variable value as the path to the JDK installation:
9.	C:\Program Files\Java\jdk-11.x.x
10.	Add the following to the PATH environment variable: %JAVA_HOME%\bin 

Install Android Studio
1.	Install Android Studio by following the prompts: https://developer.android.com/studio
2.	During installation, make sure the boxes for Android SDK, Android Virtual Device (AVD), and Android SDK Platform are checked. 
3.	Open Android Studio.
4.	Go to Configure -> SDK Manager (bottom right corner on the start screen).
5.	Note the path to the Android SDK Location (usually something like C:\Users\<YourUsername>\AppData\Local\Android\Sdk)
6.	Now, set the ANDROID_HOME environment variable, by right-clicking This PC or My Computer, and selecting Properties.
7.	Click on Advanced system settings -> Environment Variables.
8.	Under System variables, click New.
9.	Set the variable name as ANDROID_HOME, and the value as the path to your Android SDK (from step 5 above), for example: C:\Users\<YourUsername>\AppData\Local\Android\Sdk
10.	Add the following to your PATH variable:
11.	C:\Users\<YourUsername>\AppData\Local\Android\Sdk\platform-tools
12.	C:\Users\<YourUsername>\AppData\Local\Android\Sdk\tools Open Android Studio and click on AVD Manager.
13.	Create a new virtual device and select your desired phone model and system image (typically, a recent version of Android).
14.	Start the emulator from Android Studio. then finally run: cd frontend and npx react-native start in one terminal. Then start another terminal instance in a separate tab and run: android npx react-native run-android which will run the app in android studio.
![image](https://github.com/user-attachments/assets/34e13b88-cdce-4d3e-96e3-6c9865426453)
