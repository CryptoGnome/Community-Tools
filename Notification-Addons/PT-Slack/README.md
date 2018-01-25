1.	Make sure ruby is installed and available in your local PATH. You can check if it's already available by typing ruby -v in the command line.
o	Mac: Ruby is included by default
o	Windows: Use https://rubyinstaller.org and make sure to check Add Ruby executables to your PATH if prompted
o	*nix: Check https://www.ruby-lang.org/en/documentation/installation for instructions
2.	Copy Gemfile and ProfitTrailerLogToSlack.rb to the same folder.
3.	Open the command prompt and change directories to the folder containing the 2 files above.
4.	Install the ruby dependencies
o	If you have bundler installed, you can simply type bundle install
o	If that doesn't work, type gem install file-tail and then gem install slack-notifier. Both of these commands may need sudo.
5.	In a browser, go to https://my.slack.com/services/new/incoming-webhook and make sure you select the right workspace in the top right menu. Then click on "Incoming WebHooks" link in the breadcrumb menu.
6.	Click "Add Configuration", choose which channel to post to, and click "Add Incoming WebHooks integration".
7.	Copy the "Webhook URL" to the clipboard.
8.	Run the script by passing in the location of the log file and the webhook URL from step 7: ruby ProfitTrailerLogToSlack.rb "/path/to/ProfitTrail/logs/ProfitTrailer.log" "https://hooks.slack.com/services/ABCDEF/G12345H/IJKMNOPQRTUV"

